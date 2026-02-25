"""Tests for GUI mode integration in main module."""

import io
import sys
from unittest.mock import patch, MagicMock

from src.main import Shhh


class TestEmitMethod:
    """Test the _emit method output format."""

    def _make_shhh(self, gui=False):
        """Create a Shhh instance with mocked dependencies."""
        with patch("src.main.Transcriber"), \
             patch("src.main.TextOutput"):
            return Shhh(config={"hotkey": "<ctrl>+<space>", "grammar_correction": False}, gui=gui)

    def test_gui_emit_status(self):
        app = self._make_shhh(gui=True)
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            app._emit("STATUS", "recording")
        assert captured.getvalue().strip() == "@@STATUS:recording"

    def test_gui_emit_interim(self):
        app = self._make_shhh(gui=True)
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            app._emit("INTERIM", "hello world")
        assert captured.getvalue().strip() == "@@INTERIM:hello world"

    def test_gui_emit_final(self):
        app = self._make_shhh(gui=True)
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            app._emit("FINAL", "Hello world.")
        assert captured.getvalue().strip() == "@@FINAL:Hello world."

    def test_gui_emit_error(self):
        app = self._make_shhh(gui=True)
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            app._emit("ERROR", "mic failed")
        assert captured.getvalue().strip() == "@@ERROR:mic failed"

    def test_gui_info_suppressed(self):
        """INFO messages should not be emitted in GUI mode."""
        app = self._make_shhh(gui=True)
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            app._emit("INFO", "some info")
        assert captured.getvalue().strip() == ""

    def test_terminal_emit_no_protocol(self):
        """Terminal mode should not emit @@ protocol lines."""
        app = self._make_shhh(gui=False)
        captured = io.StringIO()
        with patch("sys.stdout", captured):
            app._emit("STATUS", "recording")
        assert "@@" not in captured.getvalue()
