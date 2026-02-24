"""Tests for text output module."""

from src.output import TextOutput


class TestTextOutput:
    def test_backspace_count_tracks_interim_length(self):
        """After typing interim text, backspace count should match."""
        output = TextOutput(simulate=True)
        output.type_interim("hello")
        assert output._interim_chars == 5

    def test_interim_replaces_previous(self):
        """Typing new interim should record correct replacement length."""
        output = TextOutput(simulate=True)
        output.type_interim("hel")
        output.type_interim("hello wor")
        assert output._interim_chars == 9

    def test_final_resets_interim(self):
        """After typing final text, interim counter should reset."""
        output = TextOutput(simulate=True)
        output.type_interim("hello wor")
        output.type_final("hello world")
        assert output._interim_chars == 0

    def test_accumulated_text(self):
        """Final text should accumulate across calls."""
        output = TextOutput(simulate=True)
        output.type_final("hello ")
        output.type_final("world")
        assert output.get_accumulated_text() == "hello world"
