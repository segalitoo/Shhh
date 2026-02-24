"""Google Cloud Speech-to-Text streaming transcription."""

import os

from google.cloud import speech


class Transcriber:
    """Streams audio to Google Cloud STT and yields transcription results."""

    def __init__(self, language: str = "en-US", credentials_path: str = None):
        if credentials_path:
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
        self._client = speech.SpeechClient()
        self._config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language,
        )
        self._streaming_config = speech.StreamingRecognitionConfig(
            config=self._config,
            interim_results=True,
        )

    def transcribe_stream(self, audio_generator, on_interim=None, on_final=None):
        """Stream audio chunks and call back with transcription results.

        Args:
            audio_generator: Yields raw audio bytes (16-bit PCM, 16kHz, mono).
            on_interim: Called with interim transcript text (partial result).
            on_final: Called with final transcript text (committed result).

        Returns:
            List of all final transcripts from this session.
        """
        requests = (
            speech.StreamingRecognizeRequest(audio_content=chunk)
            for chunk in audio_generator
        )

        responses = self._client.streaming_recognize(
            self._streaming_config, requests
        )

        final_transcripts = []

        for response in responses:
            if not response.results:
                continue

            result = response.results[0]
            if not result.alternatives:
                continue

            transcript = result.alternatives[0].transcript

            if result.is_final:
                final_transcripts.append(transcript)
                if on_final:
                    on_final(transcript)
            else:
                if on_interim:
                    on_interim(transcript)

        return final_transcripts
