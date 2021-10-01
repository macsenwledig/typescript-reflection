import { PACKAGE_ID } from "./helpers";

export const color = {
    blue: 34,
    magenta: 35,
    cyan: 36,
    gray: 90
};

export enum LogLevel {
    Trace,
    Info,
    Warning,
    Error
}

class Logger
{
    log(level: LogLevel, color: number, ...args: any[])
    {
        console.log.apply(undefined, [`\x1b[${color}m[${LogLevel[level]}] ${PACKAGE_ID}`, ...args, "\x1b[0m"]);
    }

    /**
     * Log INFO message
     * @param args
     */
    info(...args: any[])
    {
        console.log.apply(undefined, ["[INF] " + PACKAGE_ID, ...args]);
    }

    /**
     * Log TRACE message
     * @param args
     */
    trace(...args: any[])
    {
        this.log(LogLevel.Trace, color.gray, ...args);
    }

    /**
     * Log WARN message
     * @param args
     */
    warn(...args: any[])
    {
        console.warn.apply(undefined, ["[WRN] " + PACKAGE_ID, ...args]);
    }
}

export const log = new Logger();