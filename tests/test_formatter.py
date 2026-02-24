"""Tests for text formatter module."""

from src.formatter import format_text


class TestBulletTriggers:
    def test_bullet_keyword(self):
        result = format_text("bullet buy milk bullet clean house")
        assert "• buy milk" in result
        assert "• clean house" in result

    def test_bullet_point_keyword(self):
        result = format_text("bullet point buy milk bullet point clean house")
        assert "• buy milk" in result
        assert "• clean house" in result

    def test_new_bullet_keyword(self):
        result = format_text("new bullet first item new bullet second item")
        assert "• first item" in result
        assert "• second item" in result

    def test_next_item_keyword(self):
        result = format_text("next item buy milk next item clean house")
        assert "• buy milk" in result
        assert "• clean house" in result

    def test_dash_keyword(self):
        result = format_text("dash buy milk dash clean house")
        assert "• buy milk" in result
        assert "• clean house" in result

    def test_case_insensitive(self):
        result = format_text("Bullet buy milk BULLET clean house")
        assert "• buy milk" in result
        assert "• clean house" in result


class TestNumberedLists:
    def test_number_word(self):
        result = format_text("number one buy milk number two clean house")
        assert "1. buy milk" in result
        assert "2. clean house" in result

    def test_number_digit(self):
        result = format_text("number 1 buy milk number 2 clean house")
        assert "1. buy milk" in result
        assert "2. clean house" in result

    def test_ordinals(self):
        result = format_text("first buy milk second clean house third take out trash")
        assert "1. buy milk" in result
        assert "2. clean house" in result
        assert "3. take out trash" in result


class TestEdgeCases:
    def test_empty_text(self):
        assert format_text("") == ""

    def test_no_triggers(self):
        text = "I want to go to the store and buy some food"
        assert format_text(text) == text

    def test_no_leading_newline(self):
        result = format_text("bullet buy milk")
        assert not result.startswith("\n")
