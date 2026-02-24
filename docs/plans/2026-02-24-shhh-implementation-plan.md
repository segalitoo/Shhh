# Shhh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Python CLI live dictation tool that streams microphone audio to Google Cloud STT and types transcribed text at the cursor.

**Architecture:** Single main thread runs the STT streaming loop. pynput GlobalHotKeys runs in a background thread to toggle recording on/off via threading.Event. Grammar correction runs synchronously when dictation stops.

**Tech Stack:** Python 3.11+, google-cloud-speech, pyaudio, pynput, requests, pyyaml

---

### Project Structure

```
shhh/
├── config.yaml
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── audio.py          # MicrophoneStream context manager
│   ├── transcriber.py    # Google STT streaming client
│   ├── output.py         # Keystroke simulation via pynput
│   ├── grammar.py        # LanguageTool API correction
│   └── main.py           # Orchestrator + hotkey toggle
├── tests/
│   ├── __init__.py
│   ├── test_grammar.py
│   └── test_output.py
└── docs/plans/
```

---

### Task 1: Project Setup

**Files:**
- Create: `requirements.txt`
- Create: `config.yaml`
- Create: `src/__init__.py`
- Create: `tests/__init__.py`

**Step 1: Create Python virtual environment**

Run:
```bash
cd /Users/rannsegal/Claude/Shhh
python3 -m venv venv
source venv/bin/activate
```

**Step 2: Create requirements.txt**

```
google-cloud-speech==2.27.0
pyaudio==0.2.14
pynput==1.7.7
requests==2.32.3
pyyaml==6.0.2
pytest==8.3.4
```

**Step 3: Install dependencies**

Run:
```bash
pip install -r requirements.txt
```

Note: `pyaudio` requires PortAudio. If install fails:
```bash
brew install portaudio
pip install pyaudio
```

**Step 4: Create config.yaml**

```yaml
hotkey: "<ctrl>+<space>"
language: en-US
google_credentials: ~/.config/gcloud/service-account.json
sample_rate: 16000
chunk_size: 1600
grammar_correction: true
```

**Step 5: Create empty __init__.py files**

Create `src/__init__.py` and `tests/__init__.py` as empty files.

**Step 6: Commit**

```bash
git add requirements.txt config.yaml src/__init__.py tests/__init__.py
git commit -m "chore: project setup with dependencies and config"
```

---

### Task 2: Audio Capture Module

**Files:**
- Create: `src/audio.py`

**Step 1: Write src/audio.py**

The MicrophoneStream is a context manager that opens a PyAudio stream and yields audio chunks via a thread-safe queue.

```python
"""Audio capture from microphone as a generator of chunks."""

import queue

import pyaudio


class MicrophoneStream:
    """Opens a recording stream as a generator yielding audio chunks.

    Usage:
        with MicrophoneStream(rate=16000, chunk_size=1600) as stream:
            for chunk in stream.generator():
                process(chunk)
    """

    def __init__(self, rate: int = 16000, chunk_size: int = 1600):
        self._rate = rate
        self._chunk_size = chunk_size
        self._buff: queue.Queue[bytes | None] = queue.Queue()
        self._audio_interface: pyaudio.PyAudio | None = None
        self._audio_stream: pyaudio.Stream | None = None
        self.closed = True

    def __enter__(self):
        self._audio_interface = pyaudio.PyAudio()
        self._audio_stream = self._audio_interface.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=self._rate,
            input=True,
            frames_per_buffer=self._chunk_size,
            stream_callback=self._fill_buffer,
        )
        self.closed = False
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._audio_stream:
            self._audio_stream.stop_stream()
            self._audio_stream.close()
        self.closed = True
        self._buff.put(None)  # Signal generator to stop
        if self._audio_interface:
            self._audio_interface.terminate()

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        """PyAudio callback: puts audio data into the buffer."""
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self):
        """Yields audio chunks from the buffer until closed."""
        while not self.closed:
            chunk = self._buff.get()
            if chunk is None:
                return
            yield chunk
```

**Step 2: Quick manual test**

Create a throwaway test script (don't commit):
```bash
python3 -c "
from src.audio import MicrophoneStream
import time
with MicrophoneStream() as stream:
    print('Recording 2 seconds...')
    gen = stream.generator()
    chunks = []
    start = time.time()
    for chunk in gen:
        chunks.append(chunk)
        if time.time() - start > 2:
            break
    print(f'Captured {len(chunks)} chunks, {sum(len(c) for c in chunks)} bytes')
"
```

Expected: prints chunk count and byte count, no errors.

**Step 3: Commit**

```bash
git add src/audio.py
git commit -m "feat: add MicrophoneStream audio capture module"
```

---

### Task 3: Transcriber Module (Google STT Streaming)

**Files:**
- Create: `src/transcriber.py`

**Step 1: Write src/transcriber.py**

```python
"""Google Cloud Speech-to-Text streaming transcription."""

import os
from typing import Generator, Callable

from google.cloud import speech


class Transcriber:
    """Streams audio to Google Cloud STT and yields transcription results."""

    def __init__(self, language: str = "en-US", credentials_path: str | None = None):
        if credentials_path:
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
        self._client = speech.SpeechClient()
        self._config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language,
        )
        self._streaming_config = speech.StreamingRecognitionConfig(
            config=self._config,
            interim_results=True,
        )

    def transcribe_stream(
        self,
        audio_generator: Generator[bytes, None, None],
        on_interim: Callable[[str], None] | None = None,
        on_final: Callable[[str], None] | None = None,
    ) -> list[str]:
        """Stream audio chunks and call back with transcription results.

        Args:
            audio_generator: Yields raw audio bytes (16-bit PCM, 16kHz, mono).
            on_interim: Called with interim transcript text (partial result).
            on_final: Called with final transcript text (committed result).

        Returns:
            List of all final transcripts from this session.
        """
        requests = (
            speech.StreamingRecognizeRequest(audio_content=chunk)
            for chunk in audio_generator
        )

        responses = self._client.streaming_recognize(
            self._streaming_config, requests
        )

        final_transcripts = []

        for response in responses:
            if not response.results:
                continue

            result = response.results[0]
            if not result.alternatives:
                continue

            transcript = result.alternatives[0].transcript

            if result.is_final:
                final_transcripts.append(transcript)
                if on_final:
                    on_final(transcript)
            else:
                if on_interim:
                    on_interim(transcript)

        return final_transcripts
```

**Step 2: Integration test with microphone**

Run (speak into mic for a few seconds, then Ctrl+C):
```bash
GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/service-account.json python3 -c "
from src.audio import MicrophoneStream
from src.transcriber import Transcriber

t = Transcriber(language='en-US')
print('Speak now (Ctrl+C to stop)...')
try:
    with MicrophoneStream() as stream:
        results = t.transcribe_stream(
            stream.generator(),
            on_interim=lambda text: print(f'  ... {text}', end='\r'),
            on_final=lambda text: print(f'FINAL: {text}'),
        )
except KeyboardInterrupt:
    print('\nDone.')
"
```

Expected: interim results appear and get overwritten, final results print on new lines.

**Step 3: Commit**

```bash
git add src/transcriber.py
git commit -m "feat: add Google Cloud STT streaming transcriber"
```

---

### Task 4: Text Output Module (Keystroke Simulation)

**Files:**
- Create: `src/output.py`
- Create: `tests/test_output.py`

**Step 1: Write the failing test**

```python
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
```

**Step 2: Run test to verify it fails**

Run: `python3 -m pytest tests/test_output.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'src.output'`

**Step 3: Write src/output.py**

```python
"""Text output via simulated keystrokes."""

from pynput.keyboard import Controller, Key


class TextOutput:
    """Types text at the cursor position using pynput.

    Handles interim (partial) results by tracking character count
    and using backspace to replace them when updated.

    Args:
        simulate: If True, don't actually type (for testing).
    """

    def __init__(self, simulate: bool = False):
        self._simulate = simulate
        self._keyboard = None if simulate else Controller()
        self._interim_chars = 0
        self._accumulated: list[str] = []

    def _backspace(self, count: int):
        """Send N backspace keystrokes."""
        if self._simulate or not self._keyboard:
            return
        for _ in range(count):
            self._keyboard.press(Key.backspace)
            self._keyboard.release(Key.backspace)

    def _type_text(self, text: str):
        """Type a string of text."""
        if self._simulate or not self._keyboard:
            return
        self._keyboard.type(text)

    def type_interim(self, text: str):
        """Type interim (partial) transcription result.

        Replaces any previous interim text with backspaces first.
        """
        if self._interim_chars > 0:
            self._backspace(self._interim_chars)
        self._type_text(text)
        self._interim_chars = len(text)

    def type_final(self, text: str):
        """Type final transcription result.

        Replaces any pending interim text, then types the final text.
        Resets interim counter.
        """
        if self._interim_chars > 0:
            self._backspace(self._interim_chars)
        self._type_text(text)
        self._interim_chars = 0
        self._accumulated.append(text)

    def get_accumulated_text(self) -> str:
        """Return all final text typed in this session."""
        return "".join(self._accumulated)

    def clear(self):
        """Reset accumulated text and interim counter."""
        self._accumulated.clear()
        self._interim_chars = 0
```

**Step 4: Run tests to verify they pass**

Run: `python3 -m pytest tests/test_output.py -v`
Expected: 4 passed

**Step 5: Commit**

```bash
git add src/output.py tests/test_output.py
git commit -m "feat: add text output module with keystroke simulation"
```

---

### Task 5: Grammar Correction Module

**Files:**
- Create: `src/grammar.py`
- Create: `tests/test_grammar.py`

**Step 1: Write the failing test**

```python
"""Tests for grammar correction module."""

import json
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
```

**Step 2: Run test to verify it fails**

Run: `python3 -m pytest tests/test_grammar.py -v`
Expected: FAIL — `ModuleNotFoundError`

**Step 3: Write src/grammar.py**

```python
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
```

**Step 4: Run tests to verify they pass**

Run: `python3 -m pytest tests/test_grammar.py -v`
Expected: 5 passed

**Step 5: Commit**

```bash
git add src/grammar.py tests/test_grammar.py
git commit -m "feat: add grammar correction module with LanguageTool API"
```

---

### Task 6: Main Orchestrator

**Files:**
- Create: `src/main.py`

This is the central module that ties everything together: hotkey listener, audio capture, transcription, text output, and grammar correction.

**Step 1: Write src/main.py**

```python
"""Shhh — Live dictation tool for macOS.

Toggle recording with a global hotkey (default: Ctrl+Space).
Audio streams to Google Cloud STT, text types at cursor.
Grammar correction runs when dictation stops.
"""

import threading
import sys

import yaml
from pynput import keyboard

from src.audio import MicrophoneStream
from src.transcriber import Transcriber
from src.output import TextOutput
from src.grammar import correct_text


def load_config(path: str = "config.yaml") -> dict:
    """Load configuration from YAML file."""
    try:
        with open(path) as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        return {}


class Shhh:
    """Main orchestrator for the dictation tool."""

    def __init__(self, config: dict | None = None):
        self._config = config or load_config()
        self._hotkey_str = self._config.get("hotkey", "<ctrl>+<space>")
        self._language = self._config.get("language", "en-US")
        self._credentials = self._config.get("google_credentials")
        self._grammar_enabled = self._config.get("grammar_correction", True)
        self._sample_rate = self._config.get("sample_rate", 16000)
        self._chunk_size = self._config.get("chunk_size", 1600)

        self._recording = False
        self._should_stop = threading.Event()
        self._transcriber = Transcriber(
            language=self._language,
            credentials_path=self._credentials,
        )
        self._output = TextOutput()

        # Current mic stream reference for stopping
        self._mic_stream: MicrophoneStream | None = None

    def _on_hotkey(self):
        """Called when the global hotkey is pressed."""
        if not self._recording:
            self._recording = True
            self._should_stop.clear()
            print("\n🎙️  Recording started... (press hotkey again to stop)")
            # Start recording in a new thread so hotkey listener stays responsive
            thread = threading.Thread(target=self._record_and_transcribe, daemon=True)
            thread.start()
        else:
            self._recording = False
            self._should_stop.set()
            # Close the mic stream to unblock the generator
            if self._mic_stream:
                self._mic_stream.closed = True
            print("\n⏹️  Recording stopped.")

    def _record_and_transcribe(self):
        """Record audio and stream to Google STT."""
        self._output.clear()

        try:
            with MicrophoneStream(self._sample_rate, self._chunk_size) as stream:
                self._mic_stream = stream

                def audio_gen():
                    for chunk in stream.generator():
                        if self._should_stop.is_set():
                            return
                        yield chunk

                self._transcriber.transcribe_stream(
                    audio_gen(),
                    on_interim=self._output.type_interim,
                    on_final=self._output.type_final,
                )
        except Exception as e:
            print(f"\n❌ Transcription error: {e}")
        finally:
            self._mic_stream = None

        # Grammar correction on stop
        if self._grammar_enabled:
            accumulated = self._output.get_accumulated_text()
            if accumulated.strip():
                print("📝 Running grammar correction...")
                corrected = correct_text(accumulated, self._language)
                if corrected != accumulated:
                    # Select and replace the dictated text
                    # We need to backspace the accumulated text length and retype
                    total_len = len(accumulated)
                    for _ in range(total_len):
                        self._output._keyboard.press(keyboard.Key.backspace)
                        self._output._keyboard.release(keyboard.Key.backspace)
                    self._output._keyboard.type(corrected)
                    print(f"✅ Grammar corrected.")
                else:
                    print("✅ No grammar corrections needed.")

    def run(self):
        """Start the dictation tool. Blocks until Ctrl+C."""
        print("=" * 50)
        print("  Shhh — Live Dictation Tool")
        print(f"  Hotkey: {self._hotkey_str}")
        print(f"  Language: {self._language}")
        print(f"  Grammar correction: {'on' if self._grammar_enabled else 'off'}")
        print("=" * 50)
        print(f"\nPress {self._hotkey_str} to start/stop dictation.")
        print("Press Ctrl+C to quit.\n")

        def for_canonical(f):
            return lambda k: f(hotkey_listener.canonical(k))

        hotkey = keyboard.HotKey(
            keyboard.HotKey.parse(self._hotkey_str),
            self._on_hotkey,
        )

        with keyboard.Listener(
            on_press=for_canonical(hotkey.press),
            on_release=for_canonical(hotkey.release),
        ) as hotkey_listener:
            try:
                hotkey_listener.join()
            except KeyboardInterrupt:
                print("\nGoodbye!")


def main():
    app = Shhh()
    app.run()


if __name__ == "__main__":
    main()
```

**Step 2: Manual end-to-end test**

Run:
```bash
cd /Users/rannsegal/Claude/Shhh
source venv/bin/activate
python3 -m src.main
```

Test checklist:
- [ ] App starts and shows banner with hotkey info
- [ ] Pressing Ctrl+Space shows "Recording started..."
- [ ] Speaking into mic produces text at cursor (try in a text editor)
- [ ] Pressing Ctrl+Space again shows "Recording stopped."
- [ ] Grammar correction runs and reports result
- [ ] Ctrl+C exits cleanly

**Step 3: Commit**

```bash
git add src/main.py
git commit -m "feat: add main orchestrator with hotkey toggle and grammar correction"
```

---

### Task 7: Polish and Error Handling

**Files:**
- Modify: `src/main.py`
- Modify: `config.yaml`

**Step 1: Add GOOGLE_APPLICATION_CREDENTIALS check at startup**

In `src/main.py`, add to `Shhh.__init__`:

```python
import os

# Verify credentials exist
if self._credentials:
    creds_path = os.path.expanduser(self._credentials)
    if not os.path.exists(creds_path):
        print(f"⚠️  Google credentials not found at: {creds_path}")
        print("   Set 'google_credentials' in config.yaml or set GOOGLE_APPLICATION_CREDENTIALS env var.")
        sys.exit(1)
```

**Step 2: Add graceful handling for missing pyaudio**

In `src/audio.py`, add to `__enter__`:

```python
try:
    self._audio_interface = pyaudio.PyAudio()
except OSError as e:
    raise RuntimeError(
        "Could not initialize audio. Is PortAudio installed? "
        "Run: brew install portaudio"
    ) from e
```

**Step 3: Update config.yaml with your actual credentials path**

Update the `google_credentials` path to match where your service account key is.

**Step 4: Run all tests**

Run: `python3 -m pytest tests/ -v`
Expected: All tests pass.

**Step 5: Commit**

```bash
git add src/main.py src/audio.py config.yaml
git commit -m "fix: add startup validation and error handling"
```

---

### Known Limitations (for future tasks)

- **5-minute streaming limit**: Google STT streaming has a ~5 min limit per stream. Long dictation sessions will need stream restart logic.
- **Interim text replacement**: The backspace-and-retype approach for interim results can be imperfect in some apps.
- **Accessibility permission**: macOS will prompt for Accessibility access on first run. Must be granted in System Preferences.
- **No custom dictionary yet**: Deferred to later phase.
- **No SwiftUI wrapper yet**: Deferred to later phase.
