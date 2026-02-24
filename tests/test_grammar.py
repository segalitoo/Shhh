"""Tests for grammar correction module."""

from unittest.mock import patch, MagicMock

from src.grammar import correct_text


class TestGrammarCorrection:
    def test_no_corrections_returns_original(self):
        """Text with no errors returns unchanged."""
        mock_response = MagicMock()
        mock_response.json.return_value = {"matches": []}
        mock_response.raise_for_status = MagicMock()

        with patch("requests.post", return_value=mock_response):
            result = correct_text("This is correct.")
        assert result == "This is correct."

    def test_applies_single_correction(self):
        """Single grammar error gets corrected."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "matches": [
                {
                    "offset": 0,
                    "length": 3,
                    "replacements": [{"value": "This"}],
                }
            ]
        }
        mock_response.raise_for_status = MagicMock()

        with patch("requests.post", return_value=mock_response):
            result = correct_text("Tis is correct.")
        assert result == "This is correct."

    def test_applies_multiple_corrections_reverse_order(self):
        """Multiple corrections applied from end to start to preserve offsets."""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "matches": [
                {
                    "offset": 0,
                    "length": 2,
                    "replacements": [{"value": "I"}],
                },
                {
                    "offset": 3,
                    "length": 4,
                    "replacements": [{"value": "went"}],
                },
            ]
        }
        mock_response.raise_for_status = MagicMock()

        with patch("requests.post", return_value=mock_response):
            result = correct_text("i  goed home")
        assert result == "I went home"

    def test_empty_text_returns_empty(self):
        """Empty string returns empty without API call."""
        result = correct_text("")
        assert result == ""

    def test_api_failure_returns_original(self):
        """If API fails, return original text unchanged."""
        with patch("requests.post", side_effect=Exception("Network error")):
            result = correct_text("some text")
        assert result == "some text"
