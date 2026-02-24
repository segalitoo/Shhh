"""Grammar correction via LanguageTool public API."""

import requests

LANGUAGETOOL_URL = "https://api.languagetool.org/v2/check"


def correct_text(text: str, language: str = "en-US") -> str:
    """Send text to LanguageTool API and apply corrections.

    Args:
        text: The text to check and correct.
        language: BCP-47 language code.

    Returns:
        Corrected text, or original text if API fails.
    """
    if not text.strip():
        return text

    try:
        response = requests.post(
            LANGUAGETOOL_URL,
            data={"text": text, "language": language},
            timeout=10,
        )
        response.raise_for_status()
    except Exception:
        return text

    matches = response.json().get("matches", [])
    if not matches:
        return text

    # Apply corrections from end to start to preserve offsets
    corrected = text
    for match in sorted(matches, key=lambda m: m["offset"], reverse=True):
        if not match.get("replacements"):
            continue
        start = match["offset"]
        end = start + match["length"]
        replacement = match["replacements"][0]["value"]
        corrected = corrected[:start] + replacement + corrected[end:]

    return corrected
