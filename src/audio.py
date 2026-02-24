"""Audio capture from microphone as a generator of chunks."""

import queue

import pyaudio


class MicrophoneStream:
    """Opens a recording stream as a generator yielding audio chunks.

    Usage:
        with MicrophoneStream(rate=16000, chunk_size=1600) as stream:
            for chunk in stream.generator():
                process(chunk)
    """

    def __init__(self, rate: int = 16000, chunk_size: int = 1600):
        self._rate = rate
        self._chunk_size = chunk_size
        self._buff: queue.Queue = queue.Queue()
        self._audio_interface = None
        self._audio_stream = None
        self.closed = True

    def __enter__(self):
        self._audio_interface = pyaudio.PyAudio()
        self._audio_stream = self._audio_interface.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=self._rate,
            input=True,
            frames_per_buffer=self._chunk_size,
            stream_callback=self._fill_buffer,
        )
        self.closed = False
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._audio_stream:
            self._audio_stream.stop_stream()
            self._audio_stream.close()
        self.closed = True
        self._buff.put(None)  # Signal generator to stop
        if self._audio_interface:
            self._audio_interface.terminate()

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        """PyAudio callback: puts audio data into the buffer."""
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self):
        """Yields audio chunks from the buffer until closed."""
        while not self.closed:
            chunk = self._buff.get()
            if chunk is None:
                return
            yield chunk
