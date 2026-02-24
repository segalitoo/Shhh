"""Audio capture from microphone as a generator of chunks."""

import queue

import numpy as np
import sounddevice as sd


class MicrophoneStream:
    """Opens a recording stream as a generator yielding audio chunks.

    Uses sounddevice (which bundles PortAudio) instead of pyaudio,
    so no separate PortAudio installation is needed.

    Usage:
        with MicrophoneStream(rate=16000, chunk_size=1600) as stream:
            for chunk in stream.generator():
                process(chunk)
    """

    def __init__(self, rate: int = 16000, chunk_size: int = 1600):
        self._rate = rate
        self._chunk_size = chunk_size
        self._buff: queue.Queue = queue.Queue()
        self._stream = None
        self.closed = True

    def __enter__(self):
        try:
            self._stream = sd.RawInputStream(
                samplerate=self._rate,
                blocksize=self._chunk_size,
                dtype="int16",
                channels=1,
                callback=self._fill_buffer,
            )
            self._stream.start()
        except Exception as e:
            raise RuntimeError(
                f"Could not initialize audio: {e}\n"
                "Check that your microphone is connected and accessible."
            ) from e
        self.closed = False
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._stream:
            self._stream.stop()
            self._stream.close()
        self.closed = True
        self._buff.put(None)  # Signal generator to stop

    def _fill_buffer(self, indata, frames, time, status):
        """sounddevice callback: puts raw audio bytes into the buffer."""
        if status:
            print(f"Audio status: {status}")
        self._buff.put(bytes(indata))

    def generator(self):
        """Yields audio chunks from the buffer until closed."""
        while not self.closed:
            chunk = self._buff.get()
            if chunk is None:
                return
            yield chunk
