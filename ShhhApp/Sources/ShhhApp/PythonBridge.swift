import AppKit
import Foundation

/// Log to file since print() is invisible when launched as .app.
private func bridgeLog(_ message: String) {
    let entry = "[\(ISO8601DateFormatter().string(from: Date()))] \(message)\n"
    let path = "/tmp/shhhapp_bridge.log"
    if let handle = FileHandle(forWritingAtPath: path) {
        handle.seekToEndOfFile()
        handle.write(entry.data(using: .utf8)!)
        handle.closeFile()
    } else {
        FileManager.default.createFile(atPath: path, contents: entry.data(using: .utf8))
    }
}

/// Manages the Python backend subprocess.
@MainActor
class PythonBridge {
    private var process: Process?
    private var stdinHandle: FileHandle?
    private weak var delegate: AppDelegate?
    private var lineBuffer = ""

    init(delegate: AppDelegate) {
        self.delegate = delegate
    }

    /// Launch the Python backend process.
    func start() {
        let projectDir = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Claude/Shhh")
        let pythonPath = projectDir
            .appendingPathComponent("venv/bin/python3")
            .path

        bridgeLog("Starting PythonBridge")
        bridgeLog("Project dir: \(projectDir.path)")
        bridgeLog("Python path: \(pythonPath)")

        guard FileManager.default.fileExists(atPath: pythonPath) else {
            bridgeLog("ERROR: Python not found at \(pythonPath)")
            return
        }

        let proc = Process()
        proc.executableURL = URL(fileURLWithPath: pythonPath)
        proc.arguments = ["-m", "src.main", "--gui"]
        proc.currentDirectoryURL = projectDir

        let stdoutPipe = Pipe()
        let stdinPipe = Pipe()
        let stderrPipe = Pipe()
        proc.standardOutput = stdoutPipe
        proc.standardInput = stdinPipe
        proc.standardError = stderrPipe

        stdinHandle = stdinPipe.fileHandleForWriting

        // Read stdout asynchronously
        stdoutPipe.fileHandleForReading.readabilityHandler = { [weak self] handle in
            let data = handle.availableData
            guard !data.isEmpty else {
                handle.readabilityHandler = nil
                return
            }
            if let string = String(data: data, encoding: .utf8) {
                bridgeLog("stdout: \(string.trimmingCharacters(in: .whitespacesAndNewlines))")
                Task { @MainActor [weak self] in
                    self?.handleData(string)
                }
            }
        }

        // Log stderr for debugging
        stderrPipe.fileHandleForReading.readabilityHandler = { handle in
            let data = handle.availableData
            if let string = String(data: data, encoding: .utf8), !string.isEmpty {
                bridgeLog("stderr: \(string.trimmingCharacters(in: .whitespacesAndNewlines))")
            }
        }

        // Handle process termination
        proc.terminationHandler = { [weak self] proc in
            bridgeLog("Python process terminated with status: \(proc.terminationStatus)")
            Task { @MainActor [weak self] in
                self?.delegate?.status = .idle
            }
        }

        do {
            try proc.run()
            self.process = proc
            bridgeLog("Python backend started (PID: \(proc.processIdentifier))")
        } catch {
            bridgeLog("ERROR: Failed to start Python: \(error)")
        }
    }

    /// Buffer incoming data and extract complete lines.
    private func handleData(_ string: String) {
        lineBuffer += string
        while let newlineIndex = lineBuffer.firstIndex(of: "\n") {
            let line = String(lineBuffer[lineBuffer.startIndex..<newlineIndex])
            lineBuffer = String(lineBuffer[lineBuffer.index(after: newlineIndex)...])
            if !line.isEmpty {
                handleLine(line)
            }
        }
    }

    /// Parse a protocol line and update app state.
    private func handleLine(_ line: String) {
        bridgeLog("handleLine: \(line)")
        let message = ProtocolParser.parse(line)

        guard let delegate = self.delegate else { return }

        switch message {
        case .status(let status):
            bridgeLog("Status change: \(status)")
            delegate.status = status
        case .interim(let text):
            delegate.interimText = text
        case .final_(let text):
            bridgeLog("Final text (display): \(text)")
            delegate.interimText = text
            // Display only — actual paste happens on .paste
            let capturedText = text
            Task { @MainActor in
                try? await Task.sleep(for: .seconds(3))
                if delegate.interimText == capturedText {
                    delegate.interimText = ""
                }
            }
        case .paste(let text):
            bridgeLog("Paste text: \(text)")
            delegate.interimText = text
            pasteText(text)
            let capturedText = text
            Task { @MainActor in
                try? await Task.sleep(for: .seconds(3))
                if delegate.interimText == capturedText {
                    delegate.interimText = ""
                }
            }
        case .error(let msg):
            bridgeLog("Python error: \(msg)")
        case .unknown:
            bridgeLog("Unknown line: \(line)")
            break
        }
    }

    /// Send a command to the Python process via stdin.
    func sendCommand(_ cmd: String) {
        bridgeLog("Sending command: \(cmd)")
        guard let data = "\(cmd)\n".data(using: .utf8) else { return }
        stdinHandle?.write(data)
    }

    /// Toggle recording state by sending START or STOP.
    func toggleRecording() {
        if delegate?.isRecording == true {
            bridgeLog("toggleRecording -> STOP")
            sendCommand("STOP")
        } else {
            bridgeLog("toggleRecording -> START")
            sendCommand("START")
        }
    }

    /// Copy text to clipboard and send Cmd+V to the frontmost app.
    private func pasteText(_ text: String) {
        guard !text.isEmpty else {
            bridgeLog("pasteText: empty text, skipping")
            return
        }

        // Copy to clipboard
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setString(text, forType: .string)
        bridgeLog("Copied to clipboard: \(text.prefix(80))")

        // Small delay for clipboard readiness, then send Cmd+V
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.15) {
            let trusted = AXIsProcessTrusted()
            bridgeLog("Accessibility trusted: \(trusted)")

            if !trusted {
                bridgeLog("WARNING: Accessibility not granted — cannot paste.")
                bridgeLog("Add ShhhApp to: System Settings > Privacy & Security > Accessibility")
                return
            }

            // Send Cmd+V via CGEvent
            guard let source = CGEventSource(stateID: .hidSystemState) else {
                bridgeLog("ERROR: Could not create CGEventSource")
                return
            }
            let keyDown = CGEvent(keyboardEventSource: source, virtualKey: 0x09, keyDown: true)
            let keyUp = CGEvent(keyboardEventSource: source, virtualKey: 0x09, keyDown: false)
            keyDown?.flags = .maskCommand
            keyUp?.flags = .maskCommand
            keyDown?.post(tap: .cghidEventTap)
            usleep(50_000)  // 50ms between key down and up
            keyUp?.post(tap: .cghidEventTap)
            bridgeLog("Paste Cmd+V sent via CGEvent")
        }
    }

    /// Shut down the Python process gracefully.
    func quit() {
        sendCommand("QUIT")
        let process = self.process
        DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
            if process?.isRunning == true {
                process?.terminate()
            }
        }
    }
}
