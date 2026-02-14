type LogLevel = "info" | "warn" | "error"

type LogContext = Record<string, unknown>

const writeLog = (level: LogLevel, event: string, context: LogContext = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...context,
  }

  const line = JSON.stringify(payload)
  if (level === "error") {
    console.error(line)
    return
  }

  if (level === "warn") {
    console.warn(line)
    return
  }

  console.log(line)
}

export const logger = {
  info: (event: string, context?: LogContext) => writeLog("info", event, context),
  warn: (event: string, context?: LogContext) => writeLog("warn", event, context),
  error: (event: string, context?: LogContext) =>
    writeLog("error", event, context),
}

