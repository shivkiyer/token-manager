const path = require('path');
const fs = require('fs');
const pino = require('pino-http');

const rootDir = path.resolve(__dirname, '..');
const logDir = path.join(rootDir, 'logs');

const stream = fs.createWriteStream(
  `${logDir}/logs_${process.env.NODE_ENV}.txt`,
  { flags: 'a' }
);

const levels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};

const logger = pino(
  {
    quietResLogger: true,
    customReceivedObject: (req, res, val) => {
      return { datetime: new Date(), ...val };
    },
    customSuccessObject: () => {
      return {};
    },
    translateTime: true,
    customLevels: levels,
    useOnlyCustomLevels: true,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
  },
  stream
);

module.exports = logger;
