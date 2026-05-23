function formatPrefix(level) {
  return `[${new Date().toISOString()}] [${level}]`;
}

function log(level, message, details) {
  const prefix = formatPrefix(level);

  if (details !== undefined) {
    console.log(`${prefix} ${message}`, details);
    return;
  }

  console.log(`${prefix} ${message}`);
}

module.exports = {
  info(message, details) {
    log("INFO", message, details);
  },
  success(message, details) {
    log("SUCCESS", message, details);
  },
  warn(message, details) {
    log("WARN", message, details);
  },
  error(message, details) {
    log("ERROR", message, details);
  }
};
