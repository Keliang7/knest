// winston.config.ts
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities } from 'nest-winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: '%DATE%.log',
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
