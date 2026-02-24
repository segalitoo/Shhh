"""Tests for text output module."""

from src.output import TextOutput


class TestTextOutput:
    def test_final_accumulates_text(self):
        """Final text should accumulate across calls."""
        output = TextOutput(simulate=True)
        output.type_final("hello ")
        output.type_final("world")
        assert output.get_accumulated_text() == "hello world"

    def test_clear_resets(self):
        """Clear should reset accumulated text."""
        output = TextOutput(simulate=True)
        output.type_final("hello")
        output.clear()
        assert output.get_accumulated_text() == ""

    def test_hebrew_text_accumulated(self):
        """Hebrew text should accumulate correctly."""
        output = TextOutput(simulate=True)
        output.type_final("שלום ")
        output.type_final("עולם")
        assert output.get_accumulated_text() == "שלום עולם"

    def test_mixed_language_accumulated(self):
        """Mixed Hebrew and English should accumulate correctly."""
        output = TextOutput(simulate=True)
        output.type_final("hello ")
        output.type_final("שלום")
        assert output.get_accumulated_text() == "hello שלום"

    def test_empty_accumulated(self):
        """Fresh output should have empty accumulated text."""
        output = TextOutput(simulate=True)
        assert output.get_accumulated_text() == ""
