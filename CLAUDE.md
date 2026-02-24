# Shhh — Live Dictation Tool for macOS

## Project Overview
A Python CLI tool that captures microphone audio, streams it to Google Cloud Speech-to-Text for live transcription, and types the result directly into the active application. Grammar correction runs when dictation stops.

## Tech Stack
- Python 3.11+
- google-cloud-speech (streaming gRPC API)
- sounddevice (audio capture, bundles PortAudio — no brew needed)
- pynput (global hotkey listener + keystroke simulation)
- requests (LanguageTool API)
- pyyaml (config)
- pytest (testing)

## Project Structure
```
shhh/
├── CLAUDE.md
├── config.yaml          # Runtime config (hotkey, language, credentials path)
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── audio.py         # MicrophoneStream context manager
│   ├── transcriber.py   # Google STT streaming client
│   ├── output.py        # Keystroke simulation via pynput
│   ├── grammar.py       # LanguageTool API correction
│   └── main.py          # Orchestrator + hotkey toggle
├── tests/
│   ├── __init__.py
│   ├── test_grammar.py
│   └── test_output.py
└── docs/plans/
```

## Architecture
- Single main thread runs STT streaming loop
- pynput GlobalHotKeys runs in background thread for toggle (Ctrl+Space)
- threading.Event coordinates start/stop between hotkey and recording
- Interim transcription results typed at cursor, replaced on update
- Grammar correction (LanguageTool) runs only when dictation stops

## Commands
- Run: `source venv/bin/activate && python3 -m src.main`
- Test: `python3 -m pytest tests/ -v`
- Install deps: `pip install -r requirements.txt`

## Key Decisions
- Streaming (not batch) transcription for live dictation
- Insert at cursor via pynput keystroke simulation (requires macOS Accessibility permission)
- Grammar correction deferred to stop-time (not inline) to avoid latency
- Custom dictionary deferred to later phase
- SwiftUI wrapper deferred to later phase

## Conventions
- Use `src/` package for all source modules
- Tests in `tests/` with `test_` prefix
- Config via `config.yaml` in project root
- Google credentials path set in config.yaml, expanded at runtime
