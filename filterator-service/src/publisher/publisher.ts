import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { IPublisher } from './publisher.interface';

@Injectable()
export class Publisher implements IPublisher {
  constructor(
    private httpService: HttpService,
    private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  async Publish(keyword: { keyword: string; epoch: number }) {
    const aggregatorUrl = this.configService.get<string>('app.aggregatorURL');

    await this.httpService
      .post(`${aggregatorUrl}/keywords/message`, keyword)
      .toPromise();

    this.logger.log(
      `Keyword ${keyword.keyword} publish to the aggregator service at ${aggregatorUrl}.`,
    );
  }
}
