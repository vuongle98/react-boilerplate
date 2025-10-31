export interface LogEntry {
  module: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
