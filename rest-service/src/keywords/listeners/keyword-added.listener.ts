import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { KeywordAddedEvent } from '../events/keyword-added-event';
import { ConsistentHash } from '../../consistentHashing/consistentHash';

@Injectable()
export class KeywordAddedListener {
  constructor(
    private readonly logger: Logger,
    private configService: ConfigService,
    private httpService: HttpService,
    private consistentHash: ConsistentHash,
  ) {}

  @OnEvent('keyword.added')
  async sendKeywordToFilteratorService(event: KeywordAddedEvent) {
    const filteratorCluster = this.configService.get<string>(
      'filteratorCluster.services',
    );
    const filteratorClusterList = JSON.parse(filteratorCluster);
    this.logger.log(
      `KeywordAddedEvent emitted. Adding keyword ${event.keyword} to the filterator service.`,
    );

    filteratorClusterList.map((node) => {
      this.consistentHash.AddNode(node);
    });

    const assignedNode = this.consistentHash.Assign(event.keyword);

    // FIXME: hack, so the test doesn't throw an ECONNREFUSED error for the filterator service
    if (process.env.NODE_ENV !== 'test') {
      const axiosResponse = await this.httpService
        .post(`${assignedNode}/keywords/add`, {
          keywords: [event.keyword],
        })
        .toPromise();

      this.logger.log(
        `Keyword ${event.keyword} added to filterator ${assignedNode}. Current cache now: ${axiosResponse.data}`,
      );
    }
  }
}
