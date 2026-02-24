"""Text formatting for dictated speech.

Converts spoken list cues into formatted bullet points and numbered lists.
Runs on final transcription results before they're pasted.
"""

import re


# Voice trigger patterns → bullet replacement
BULLET_TRIGGERS = [
    r"\bbullet\s*point\b",
    r"\bnew\s*bullet\b",
    r"\bbullet\b",
    r"\bnext\s*item\b",
    r"\bnext\s*point\b",
    r"\bdash\b",
]

# Numbered list triggers (e.g., "number one", "number 1", "first", "second")
ORDINAL_MAP = {
    "first": 1, "second": 2, "third": 3, "fourth": 4, "fifth": 5,
    "sixth": 6, "seventh": 7, "eighth": 8, "ninth": 9, "tenth": 10,
}

# Pattern: "number N" or "number one/two/..."
NUMBER_WORD_MAP = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}


def format_text(text: str) -> str:
    """Apply formatting rules to transcribed text.

    Converts spoken bullet/list cues into formatted text.

    Args:
        text: Raw transcribed text from STT.

    Returns:
        Formatted text with bullets and numbered lists.
    """
    if not text.strip():
        return text

    result = text
    has_bullets = False

    # Check if any bullet triggers are present in original text
    for pattern in BULLET_TRIGGERS:
        if re.search(pattern, result, re.IGNORECASE):
            has_bullets = True
            break

    # Replace bullet triggers with bullet character
    for pattern in BULLET_TRIGGERS:
        result = re.sub(
            pattern,
            "\n• ",
            result,
            flags=re.IGNORECASE,
        )

    # Replace "number N" patterns (e.g., "number one", "number 3")
    def replace_number_word(match):
        word = match.group(1).lower()
        num = NUMBER_WORD_MAP.get(word)
        if num is not None:
            return f"\n{num}. "
        return match.group(0)

    result = re.sub(
        r"\bnumber\s+(one|two|three|four|five|six|seven|eight|nine|ten)\b",
        replace_number_word,
        result,
        flags=re.IGNORECASE,
    )

    # Replace "number N" with digit (e.g., "number 1")
    result = re.sub(
        r"\bnumber\s+(\d+)\b",
        lambda m: f"\n{m.group(1)}. ",
        result,
        flags=re.IGNORECASE,
    )

    # Replace ordinals only when 2+ are present AND no bullet triggers were used
    # (bullets take priority — "new bullet first item" should stay as bullet, not numbered)
    if not has_bullets:
        ordinals_found = []
        for word, num in ORDINAL_MAP.items():
            if re.search(rf"\b{word}\b", result, re.IGNORECASE):
                ordinals_found.append((word, num))

        if len(ordinals_found) >= 2:
            for word, num in sorted(ordinals_found, key=lambda x: x[1], reverse=True):
                result = re.sub(
                    rf"\b{word}\b",
                    f"\n{num}. ",
                    result,
                    count=1,
                    flags=re.IGNORECASE,
                )

    # Clean up: remove leading newline if text starts with bullet/number
    result = result.lstrip("\n")

    # Clean up: collapse multiple spaces
    result = re.sub(r"  +", " ", result)

    # Clean up: trim space after bullet/number markers
    result = re.sub(r"(• |(\d+)\. )\s+", r"\1", result)

    return result
