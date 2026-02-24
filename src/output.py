"""Text output via simulated keystrokes."""

from pynput.keyboard import Controller, Key


class TextOutput:
    """Types text at the cursor position using pynput.

    Handles interim (partial) results by tracking character count
    and using backspace to replace them when updated.

    Args:
        simulate: If True, don't actually type (for testing).
    """

    def __init__(self, simulate: bool = False):
        self._simulate = simulate
        self._keyboard = None if simulate else Controller()
        self._interim_chars = 0
        self._accumulated: list[str] = []

    def _backspace(self, count: int):
        """Send N backspace keystrokes."""
        if self._simulate or not self._keyboard:
            return
        for _ in range(count):
            self._keyboard.press(Key.backspace)
            self._keyboard.release(Key.backspace)

    def _type_text(self, text: str):
        """Type a string of text."""
        if self._simulate or not self._keyboard:
            return
        self._keyboard.type(text)

    def type_interim(self, text: str):
        """Type interim (partial) transcription result.

        Replaces any previous interim text with backspaces first.
        """
        if self._interim_chars > 0:
            self._backspace(self._interim_chars)
        self._type_text(text)
        self._interim_chars = len(text)

    def type_final(self, text: str):
        """Type final transcription result.

        Replaces any pending interim text, then types the final text.
        Resets interim counter.
        """
        if self._interim_chars > 0:
            self._backspace(self._interim_chars)
        self._type_text(text)
        self._interim_chars = 0
        self._accumulated.append(text)

    def get_accumulated_text(self) -> str:
        """Return all final text typed in this session."""
        return "".join(self._accumulated)

    def clear(self):
        """Reset accumulated text and interim counter."""
        self._accumulated.clear()
        self._interim_chars = 0
