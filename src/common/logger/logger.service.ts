// src/common/logger/logger.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';

@Injectable()
export class LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  log(msg: string, ctx?: string) {
    this.logger.info(msg, { ctx });
  }

  warn(msg: string, ctx?: string) {
    this.logger.warn(msg, { ctx });
  }

  error(msg: string, trace?: string, ctx?: string) {
    this.logger.error(msg, { trace, ctx });
  }
}
