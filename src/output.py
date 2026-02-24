"""Text output via clipboard paste to the frontmost application.

Uses pbcopy + osascript to reliably paste into whatever app has focus,
correctly handling all languages including Hebrew.
"""

import subprocess


class TextOutput:
    """Pastes text into the frontmost application using clipboard + AppleScript.

    Args:
        simulate: If True, don't actually type (for testing).
    """

    def __init__(self, simulate: bool = False):
        self._simulate = simulate
        self._accumulated: list[str] = []

    def _paste_text(self, text: str):
        """Copy text to clipboard and Cmd+V into the frontmost app via AppleScript."""
        if self._simulate:
            return
        # Copy text to clipboard
        subprocess.run(["pbcopy"], input=text, text=True, timeout=2)
        # Send Cmd+V to the frontmost application via AppleScript
        subprocess.run([
            "osascript", "-e",
            'tell application "System Events" to keystroke "v" using command down'
        ], timeout=2)

    def _backspace(self, count: int):
        """Send N backspace keystrokes to the frontmost app via AppleScript."""
        if self._simulate:
            return
        # AppleScript to press delete key N times
        script = f'tell application "System Events" to key code 51 using {{}} -- repeat {count} times'
        for _ in range(count):
            subprocess.run([
                "osascript", "-e",
                'tell application "System Events" to key code 51'
            ], timeout=2)

    def type_final(self, text: str):
        """Paste final transcription result into the frontmost app."""
        self._paste_text(text)
        self._accumulated.append(text)

    def get_accumulated_text(self) -> str:
        """Return all final text typed in this session."""
        return "".join(self._accumulated)

    def clear(self):
        """Reset accumulated text."""
        self._accumulated.clear()
