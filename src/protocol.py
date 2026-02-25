"""GUI protocol for Swift <-> Python communication.

Protocol format (Python -> Swift, on stdout):
    @@STATUS:idle|recording|processing
    @@INTERIM:text here
    @@FINAL:text here
    @@ERROR:message

Commands (Swift -> Python, on stdin):
    START
    STOP
    QUIT
"""

from typing import Optional


def format_message(tag: str, value: str) -> str:
    """Format a structured GUI protocol message.

    Args:
        tag: Message type (STATUS, INTERIM, FINAL, ERROR).
        value: Message payload.

    Returns:
        Formatted protocol string, e.g. '@@STATUS:recording'.
    """
    return f"@@{tag}:{value}"


def parse_command(line: str) -> Optional[str]:
    """Parse a command from stdin.

    Args:
        line: Raw line from stdin (may include newline/whitespace).

    Returns:
        Uppercase command string ('START', 'STOP', 'QUIT') or None if invalid.
    """
    cmd = line.strip().upper()
    if cmd in ("START", "STOP", "QUIT"):
        return cmd
    return None
