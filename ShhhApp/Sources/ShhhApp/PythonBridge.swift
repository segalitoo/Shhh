import Foundation

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

        guard FileManager.default.fileExists(atPath: pythonPath) else {
            print("[ShhhApp] Python not found at \(pythonPath)")
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
                Task { @MainActor [weak self] in
                    self?.handleData(string)
                }
            }
        }

        // Log stderr for debugging
        stderrPipe.fileHandleForReading.readabilityHandler = { handle in
            let data = handle.availableData
            if let string = String(data: data, encoding: .utf8), !string.isEmpty {
                print("[Python stderr] \(string)", terminator: "")
            }
        }

        // Handle process termination
        proc.terminationHandler = { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.delegate?.status = .idle
            }
        }

        do {
            try proc.run()
            self.process = proc
            print("[ShhhApp] Python backend started (PID: \(proc.processIdentifier))")
        } catch {
            print("[ShhhApp] Failed to start Python: \(error)")
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
        let message = ProtocolParser.parse(line)

        guard let delegate = self.delegate else { return }

        switch message {
        case .status(let status):
            delegate.status = status
        case .interim(let text):
            delegate.interimText = text
        case .final_(let text):
            delegate.interimText = text
            let capturedText = text
            Task { @MainActor in
                try? await Task.sleep(for: .seconds(3))
                if delegate.interimText == capturedText {
                    delegate.interimText = ""
                }
            }
        case .error(let msg):
            print("[ShhhApp] Python error: \(msg)")
        case .unknown:
            break
        }
    }

    /// Send a command to the Python process via stdin.
    func sendCommand(_ cmd: String) {
        guard let data = "\(cmd)\n".data(using: .utf8) else { return }
        stdinHandle?.write(data)
    }

    /// Toggle recording state by sending START or STOP.
    func toggleRecording() {
        if delegate?.isRecording == true {
            sendCommand("STOP")
        } else {
            sendCommand("START")
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
