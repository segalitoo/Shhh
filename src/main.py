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


def load_config(path: str = "config.yaml") -> dict:
    """Load configuration from YAML file."""
    try:
        with open(path) as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        return {}


class Shhh:
    """Main orchestrator for the dictation tool."""

    def __init__(self, config: dict = None):
        self._config = config or load_config()
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

        self._recording = False
        self._should_stop = threading.Event()
        self._transcriber = Transcriber(
            language=self._language,
            credentials_path=self._credentials,
        )
        self._output = TextOutput()

        # Current mic stream reference for stopping
        self._mic_stream = None

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
                    # Backspace the accumulated text and retype corrected version
                    total_len = len(accumulated)
                    for _ in range(total_len):
                        self._output._keyboard.press(keyboard.Key.backspace)
                        self._output._keyboard.release(keyboard.Key.backspace)
                    self._output._keyboard.type(corrected)
                    print("✅ Grammar corrected.")
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
