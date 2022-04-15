import { Injectable } from '@nestjs/common';
import { IStatusMessage } from './response.interface';

@Injectable()
export class AppService {
  getStatus(): IStatusMessage {
    return { status: true, message: 'REST Service is alive!' };
  }
}
