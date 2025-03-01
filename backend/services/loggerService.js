const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

class LoggerService {
    constructor(context = 'APP') {
        this.logLevel = this._getLogLevel();
        this.context = context;
    }

    _getLogLevel() {
        const level = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
        return LOG_LEVELS[level] || LOG_LEVELS.INFO;
    }

    log(level, message, data = null) {
        if (LOG_LEVELS[level] <= this.logLevel) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${this.context}] [${level}] ${message}`;
            
            if (level === 'ERROR') {
                console.error(logMessage);
                if (data) console.error(data);
            } else {
                console.log(logMessage);
                if (data) console.log(data);
            }
        }
    }

    error(message, data = null) {
        this.log('ERROR', message, data);
    }

    warn(message, data = null) {
        this.log('WARN', message, data);
    }

    info(message, data = null) {
        this.log('INFO', message, data);
    }

    debug(message, data = null) {
        this.log('DEBUG', message, data);
    }
}

module.exports = LoggerService; 