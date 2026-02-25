# Shhh — Live Dictation Tool for macOS

## Project Overview
A Python CLI tool that captures microphone audio, streams it to Google Cloud Speech-to-Text for live transcription, and pastes the result into the frontmost application. Supports English and Hebrew with auto-detection. Grammar correction runs when dictation stops.

## Tech Stack
- Python 3.9+ (3.11+ recommended)
- google-cloud-speech (streaming gRPC API)
- sounddevice (audio capture, bundles PortAudio — no brew needed)
- pynput (global hotkey listener)
- osascript/AppleScript (paste into frontmost app via System Events)
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
│   ├── audio.py         # MicrophoneStream context manager (sounddevice)
│   ├── transcriber.py   # Google STT streaming client (bilingual en/he)
│   ├── output.py        # Paste into frontmost app via pbcopy + osascript
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
- pynput HotKey listener runs in background thread for toggle (Ctrl+Space)
- threading.Event coordinates start/stop between hotkey and recording
- Interim results shown in terminal only (fast, no keystrokes)
- Final results pasted into frontmost app via pbcopy + osascript Cmd+V
- Grammar correction (LanguageTool) runs only when dictation stops

## Commands
- Run: `source venv/bin/activate && python3 -m src.main`
- Test: `python3 -m pytest tests/ -v`
- Install deps: `pip install -r requirements.txt`
- Auth: `~/google-cloud-sdk/bin/gcloud auth application-default login`

## macOS Permissions Required
- **Accessibility** — Terminal app must be in System Settings → Privacy & Security → Accessibility
- **Microphone** — macOS will prompt on first run
- **Automation** — Allow Terminal to control System Events (prompted automatically)

## Key Decisions
- Streaming (not batch) transcription for live dictation
- Paste via clipboard (pbcopy + osascript) — handles Hebrew/English correctly
- NOT pynput keyboard.type() — garbles non-ASCII on bilingual keyboards
- Interim results terminal-only — avoids latency and system alert sounds
- Grammar correction deferred to stop-time (not inline) to avoid latency
- Application Default Credentials (gcloud auth) — no service account key needed
- sounddevice over pyaudio — bundles PortAudio, no Homebrew dependency
- Custom dictionary deferred to later phase
- SwiftUI wrapper deferred to later phase

## Conventions
- Use `src/` package for all source modules
- Tests in `tests/` with `test_` prefix
- Config via `config.yaml` in project root
- Google credentials via Application Default Credentials (gcloud auth)

## macOS App (ShhhApp)

SwiftUI menu bar app wrapping the Python CLI backend.

### Build & Run
- Build: `cd ShhhApp && swift build -c release`
- Run: `./ShhhApp/.build/release/ShhhApp`
- Kill: `killall ShhhApp`

### Architecture
- Swift Package Manager project in `ShhhApp/`
- `AppDelegate` owns all state (status, interimText, isPreviewVisible)
- `PythonBridge` manages `python3 -m src.main --gui` subprocess
- Communication via `@@TAG:value` stdout protocol + `START/STOP/QUIT` stdin commands
- Two floating NSPanel windows: toggle button (bottom-center) + preview overlay (top-center)
- No Dock icon (MenuBarExtra-only + NSApp.accessory activation policy)
