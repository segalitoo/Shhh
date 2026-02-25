import Foundation

/// Parsed message from the Python backend.
enum ProtocolMessage: Equatable {
    case status(DictationStatus)
    case interim(String)
    case final_(String)
    case error(String)
    case unknown
}

/// Parses @@TAG:value protocol lines from the Python backend.
enum ProtocolParser {
    /// Parse a single stdout line into a ProtocolMessage.
    static func parse(_ line: String) -> ProtocolMessage {
        guard line.hasPrefix("@@") else { return .unknown }

        let content = String(line.dropFirst(2))
        guard let colonIndex = content.firstIndex(of: ":") else { return .unknown }

        let tag = String(content[content.startIndex..<colonIndex])
        let value = String(content[content.index(after: colonIndex)...])

        switch tag {
        case "STATUS":
            if let status = DictationStatus(rawValue: value) {
                return .status(status)
            }
            return .unknown
        case "INTERIM":
            return .interim(value)
        case "FINAL":
            return .final_(value)
        case "ERROR":
            return .error(value)
        default:
            return .unknown
        }
    }
}
