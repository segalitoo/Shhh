"""Tests for GUI protocol formatting and command parsing."""

from src.protocol import format_message, parse_command


class TestFormatMessage:
    def test_status_recording(self):
        assert format_message("STATUS", "recording") == "@@STATUS:recording"

    def test_status_idle(self):
        assert format_message("STATUS", "idle") == "@@STATUS:idle"

    def test_status_processing(self):
        assert format_message("STATUS", "processing") == "@@STATUS:processing"

    def test_interim_text(self):
        assert format_message("INTERIM", "hello world") == "@@INTERIM:hello world"

    def test_final_text(self):
        assert format_message("FINAL", "Hello world.") == "@@FINAL:Hello world."

    def test_error(self):
        assert format_message("ERROR", "mic failed") == "@@ERROR:mic failed"

    def test_hebrew_text(self):
        assert format_message("INTERIM", "שלום עולם") == "@@INTERIM:שלום עולם"

    def test_colon_in_value(self):
        """Values with colons should not break parsing."""
        assert format_message("ERROR", "err: something: bad") == "@@ERROR:err: something: bad"


class TestParseCommand:
    def test_start(self):
        assert parse_command("START\n") == "START"

    def test_stop(self):
        assert parse_command("stop\n") == "STOP"

    def test_quit(self):
        assert parse_command("QUIT") == "QUIT"

    def test_case_insensitive(self):
        assert parse_command("Start\n") == "START"

    def test_whitespace_stripped(self):
        assert parse_command("  STOP  \n") == "STOP"

    def test_invalid_command(self):
        assert parse_command("HELLO\n") is None

    def test_empty(self):
        assert parse_command("") is None

    def test_empty_newline(self):
        assert parse_command("\n") is None
