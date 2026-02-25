"""Shhh — Live dictation tool for macOS.

Toggle recording with a global hotkey (default: Ctrl+Space).
Audio streams to Google Cloud STT, text types at cursor.
Grammar correction runs when dictation stops.
"""

import os
import sys
import threading

import yaml
from pynput import keyboard

from src.audio import MicrophoneStream
from src.transcriber import Transcriber
from src.output import TextOutput
from src.grammar import correct_text
from src.formatter import format_text


def load_config(path: str = "config.yaml") -> dict:
    """Load configuration from YAML file."""
    try:
        with open(path) as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        return {}


class Shhh:
    """Main orchestrator for the dictation tool."""

    def __init__(self, config: dict = None, gui: bool = False):
        self._config = config or load_config()
        self._gui = gui
        self._hotkey_str = self._config.get("hotkey", "<ctrl>+<space>")
        self._language = self._config.get("language", "en-US")
        self._credentials = self._config.get("google_credentials")
        self._grammar_enabled = self._config.get("grammar_correction", True)
        self._sample_rate = self._config.get("sample_rate", 16000)
        self._chunk_size = self._config.get("chunk_size", 1600)

        # Set up Google credentials
        if self._credentials:
            creds_path = os.path.expanduser(self._credentials)
            if not os.path.exists(creds_path):
                print(f"⚠️  Google credentials not found at: {creds_path}")
                print("   Set 'google_credentials' in config.yaml or set GOOGLE_APPLICATION_CREDENTIALS env var.")
                sys.exit(1)
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path
        # If no credentials path configured, google-cloud-speech will use
        # Application Default Credentials (via 'gcloud auth application-default login')

        self._alternative_languages = self._config.get("alternative_languages", [])

        self._recording = False
        self._should_stop = threading.Event()
        self._transcriber = Transcriber(
            language=self._language,
            alternative_languages=self._alternative_languages,
            credentials_path=self._credentials,
        )
        self._output = TextOutput()

        # Current mic stream reference for stopping
        self._mic_stream = None

    def _emit(self, tag: str, value: str = ""):
        """Output a message in the appropriate format.

        GUI mode: structured @@TAG:value protocol lines on stdout.
        Terminal mode: human-readable formatted output.
        """
        if self._gui:
            if tag != "INFO":  # INFO is terminal-only
                from src.protocol import format_message
                print(format_message(tag, value), flush=True)
            return

        # Terminal mode formatting
        if tag == "STATUS" and value == "recording":
            print("\n🎙️  Recording started... (press hotkey again to stop)")
        elif tag == "STATUS" and value == "processing":
            print("📝 Running grammar correction...")
        elif tag == "INTERIM":
            print(f"\r  💬 {value}    ", end="", flush=True)
        elif tag == "FINAL":
            print(f"\r  ✅ {value}    ")
        elif tag == "ERROR":
            print(f"\n❌ Transcription error: {value}")
        elif tag == "INFO":
            print(value)

    def _start_recording(self):
        """Begin a recording session."""
        self._recording = True
        self._should_stop.clear()
        self._emit("STATUS", "recording")
        thread = threading.Thread(target=self._record_and_transcribe, daemon=True)
        thread.start()

    def _stop_recording(self):
        """End the current recording session."""
        self._recording = False
        self._should_stop.set()
        if self._mic_stream:
            self._mic_stream.closed = True
        if not self._gui:
            print("\n⏹️  Recording stopped.")

    def _on_hotkey(self):
        """Called when the global hotkey is pressed."""
        if not self._recording:
            self._start_recording()
        else:
            self._stop_recording()

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

                def on_interim(text):
                    self._emit("INTERIM", text)

                def on_final(text):
                    formatted = format_text(text)
                    self._emit("FINAL", formatted)
                    self._output.type_final(formatted)

                self._transcriber.transcribe_stream(
                    audio_gen(),
                    on_interim=on_interim,
                    on_final=on_final,
                )
        except Exception as e:
            self._emit("ERROR", str(e))
        finally:
            self._mic_stream = None

        # Grammar correction on stop
        if self._grammar_enabled:
            accumulated = self._output.get_accumulated_text()
            if accumulated.strip():
                self._emit("STATUS", "processing")
                corrected = correct_text(accumulated, self._language)
                if corrected != accumulated:
                    import subprocess
                    n = len(accumulated)
                    script = (
                        f'tell application "System Events"\n'
                        f'  repeat {n} times\n'
                        f'    key code 123 using shift down\n'
                        f'  end repeat\n'
                        f'end tell'
                    )
                    subprocess.run(["osascript", "-e", script], timeout=10)
                    self._output._paste_text(corrected)
                    self._emit("INFO", "✅ Grammar corrected.")
                else:
                    self._emit("INFO", "✅ No grammar corrections needed.")

        self._emit("STATUS", "idle")

    def run(self):
        """Start the dictation tool. Blocks until Ctrl+C."""
        print("=" * 50)
        print("  Shhh — Live Dictation Tool")
        print(f"  Hotkey: {self._hotkey_str}")
        langs = [self._language] + self._alternative_languages
        print(f"  Languages: {', '.join(langs)}")
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


    def run_gui(self):
        """Start in GUI mode. Reads commands from stdin, outputs protocol to stdout."""
        self._emit("STATUS", "idle")

        # Start hotkey listener in background (still works alongside GUI controls)
        hotkey = keyboard.HotKey(
            keyboard.HotKey.parse(self._hotkey_str),
            self._on_hotkey,
        )

        def for_canonical(f):
            return lambda k: f(hotkey_listener.canonical(k))

        hotkey_listener = keyboard.Listener(
            on_press=for_canonical(hotkey.press),
            on_release=for_canonical(hotkey.release),
        )
        hotkey_listener.start()

        # Read commands from stdin (main thread blocks here)
        try:
            for line in sys.stdin:
                from src.protocol import parse_command
                cmd = parse_command(line)
                if cmd == "START" and not self._recording:
                    self._on_hotkey()
                elif cmd == "STOP" and self._recording:
                    self._on_hotkey()
                elif cmd == "QUIT":
                    if self._recording:
                        self._on_hotkey()
                    break
        except (KeyboardInterrupt, EOFError):
            pass
        finally:
            hotkey_listener.stop()


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Shhh — Live dictation tool")
    parser.add_argument("--gui", action="store_true", help="GUI protocol mode (used by ShhhApp)")
    args = parser.parse_args()

    app = Shhh(gui=args.gui)
    if args.gui:
        app.run_gui()
    else:
        app.run()


if __name__ == "__main__":
    main()
