import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IStatusMessage } from './response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): IStatusMessage {
    return this.appService.getStatus();
  }
}
