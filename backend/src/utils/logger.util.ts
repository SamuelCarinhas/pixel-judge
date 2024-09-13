import winston from "winston"
import { saveLog } from "./db-logs.util"
import { Account, LogType } from "@prisma/client"

const ENV = String(process.env.NODE_ENV)

class Logger {
  private logger: winston.Logger

  constructor() {
    const levels = {
      levels: {
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
      },
      colors: {
        debug: "blue",
        info: "blue",
        warn: "yellow",
        error: "red",
      },
    }

    const formatter = winston.format.combine(
      winston.format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.splat(),
      winston.format.prettyPrint(),
      winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
        }`
      })
    )

    const transport = new winston.transports.Console({
      format: formatter,
    })

    const prodTransport = new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })

    this.logger = winston.createLogger({
      level: ENV !== "production" ? "debug" : "info",
      levels: levels.levels,
      transports: [transport, prodTransport],
    })

    if (ENV !== "production") {
      const devTransport = new winston.transports.File({
        filename: "logs/debug.log",
        level: "debug",
      })
      this.logger.add(devTransport)
    }

    winston.addColors(levels.colors)
  }

  debug(msg: any, meta?: any) {
    this.logger.debug(msg, meta)
  }

  info(msg: any, currentAccount?: Account, meta?: any) {
    if(currentAccount)
      saveLog(currentAccount, msg, LogType.INFO)
    this.logger.info(msg, meta)
  }

  admin(msg: any, currentAccount?: Account, meta?: any) {
    if(currentAccount)
      saveLog(currentAccount, msg, LogType.ADMIN)
    this.logger.info(msg, meta)
  }

  warn(msg: any, meta?: any) {
    this.logger.warn(msg, meta)
  }

  error(msg: any, meta?: any) {
    this.logger.error(msg, meta)
  }
}

const logger = new Logger()

export default logger
