"""Text output via clipboard paste.

Uses clipboard (pbcopy/Cmd+V) instead of keystroke simulation
to correctly handle all languages including Hebrew, Arabic, etc.
"""

import subprocess
import time

from pynput.keyboard import Controller, Key


class TextOutput:
    """Pastes text at the cursor position using clipboard.

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
        self._saved_clipboard: str | None = None

    def _backspace(self, count: int):
        """Send N backspace keystrokes."""
        if self._simulate or not self._keyboard:
            return
        for _ in range(count):
            self._keyboard.press(Key.backspace)
            self._keyboard.release(Key.backspace)

    def _paste_text(self, text: str):
        """Paste text via clipboard (handles all languages correctly)."""
        if self._simulate or not self._keyboard:
            return
        # Save current clipboard
        try:
            result = subprocess.run(
                ["pbpaste"], capture_output=True, text=True, timeout=2
            )
            self._saved_clipboard = result.stdout
        except Exception:
            self._saved_clipboard = None

        # Copy our text to clipboard
        subprocess.run(
            ["pbcopy"], input=text, text=True, timeout=2
        )

        # Paste with Cmd+V
        time.sleep(0.05)
        self._keyboard.press(Key.cmd)
        self._keyboard.press('v')
        self._keyboard.release('v')
        self._keyboard.release(Key.cmd)
        time.sleep(0.05)

        # Restore original clipboard
        if self._saved_clipboard is not None:
            try:
                subprocess.run(
                    ["pbcopy"], input=self._saved_clipboard, text=True, timeout=2
                )
            except Exception:
                pass

    def type_interim(self, text: str):
        """Type interim (partial) transcription result.

        Replaces any previous interim text with backspaces first.
        """
        if self._interim_chars > 0:
            self._backspace(self._interim_chars)
        self._paste_text(text)
        self._interim_chars = len(text)

    def type_final(self, text: str):
        """Type final transcription result.

        Replaces any pending interim text, then types the final text.
        Resets interim counter.
        """
        if self._interim_chars > 0:
            self._backspace(self._interim_chars)
        self._paste_text(text)
        self._interim_chars = 0
        self._accumulated.append(text)

    def get_accumulated_text(self) -> str:
        """Return all final text typed in this session."""
        return "".join(self._accumulated)

    def clear(self):
        """Reset accumulated text and interim counter."""
        self._accumulated.clear()
        self._interim_chars = 0
