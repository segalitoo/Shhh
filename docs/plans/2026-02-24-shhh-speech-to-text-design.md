# Shhh — Live Dictation Tool for macOS

## Overview

A Python CLI tool that captures microphone audio, streams it to Google Cloud Speech-to-Text for live transcription, and types the result directly into the active application. Grammar correction runs when dictation stops. Activated/deactivated via a global hotkey.

## Requirements

- **Live dictation** — text appears as you speak
- **Insert at cursor** — text types into whatever app has focus
- **Toggle hotkey** — press to start, press again to stop (default: Ctrl+Space)
- **Grammar correction on stop** — LanguageTool API cleans up text after dictation ends
- **Python CLI first** — SwiftUI macOS app deferred to later phase

## Architecture

Single-threaded async (asyncio). One coroutine captures audio, another consumes streaming transcription results and simulates keystrokes.

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Audio       │────>│  Google Cloud     │────>│  Text Output    │
│  Capture     │     │  STT Streaming   │     │  (keystrokes)   │
│  (pyaudio)   │     │  (gRPC)          │     │  (pynput)       │
└─────────────┘     └──────────────────┘     └─────────────────┘
       ^                                              │
       │              ┌──────────────────┐            │
       └──────────────│  Hotkey Listener │            │
        start/stop    │  (pynput)        │            v
                      └──────────────────┘     ┌─────────────────┐
                                               │  Grammar Fix    │
                                               │  (LanguageTool)  │
                                               │  (on stop only) │
                                               └─────────────────┘
```

## Components

### Audio Capture
- `pyaudio` reads from the default microphone
- 16kHz sample rate, 16-bit mono (Google STT requirement)
- Audio chunks yielded as a generator to the streaming API

### Google Cloud STT Streaming
- Uses `google-cloud-speech` `streaming_recognize` gRPC API
- Sends audio chunks, receives interim and final transcription results
- Interim results shown live, final results committed to text
- Language: en-US

### Text Output
- `pynput` simulates keystrokes to type at the cursor position
- Interim results are typed and then replaced when final result arrives
- Works in any application that accepts keyboard input

### Hotkey Listener
- `pynput` global hotkey listener
- Default: Ctrl+Space (configurable via config.yaml)
- Toggle: first press starts recording, second press stops

### Grammar Correction
- Runs only when dictation stops (not inline)
- Sends accumulated transcribed text to LanguageTool public API
- Corrected text replaces the original via select + retype

## Data Flow

1. User presses Ctrl+Space — recording starts
2. Audio chunks stream to Google STT via gRPC
3. Interim results type into the active app in real-time
4. Final results replace interim text
5. User presses Ctrl+Space again — recording stops
6. Full transcribed text is sent to LanguageTool API
7. If corrections found, text is updated in-place

## Dependencies

- `pyaudio` — audio capture
- `google-cloud-speech` — STT streaming
- `pynput` — global hotkey + keystroke simulation
- `requests` — LanguageTool API calls
- `pyyaml` — config file parsing

## Configuration

`config.yaml` in project root:

```yaml
hotkey: ctrl+space
language: en-US
google_credentials: path/to/service-account.json
grammar_correction: true
```

## macOS Permissions Required

- **Microphone access** — macOS will prompt on first run
- **Accessibility** — required for pynput to simulate keystrokes and listen for global hotkeys

## Deferred to Later Phases

- Custom terms dictionary (find-and-replace for proper nouns, jargon)
- SwiftUI macOS app with menu bar icon
- Multi-language support
- Configurable audio device selection

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| STT engine | Google Cloud STT | Best streaming support, good accuracy, free tier |
| Architecture | Single-threaded async | Simplicity wins for a personal tool |
| Grammar timing | On stop only | Avoids latency during live dictation |
| Text output | Insert at cursor (pynput) | Most seamless UX |
| Hotkey style | Toggle | Simpler than hold-to-talk, good for longer dictation |
| MVP scope | Python CLI | Faster to iterate, SwiftUI later |
| Custom dictionary | Deferred | Not needed for MVP |
