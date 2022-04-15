import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { KeywordDeletedEvent } from '../events/keyword-deleted.event';
import { KeywordRepository } from '../keywords.repository';
import { ConsistentHash } from '../../consistentHashing/consistentHash';

@Injectable()
export class KeywordDeletedListener {
  constructor(
    @InjectRepository(KeywordRepository)
    private readonly keywordRepository: KeywordRepository,
    private readonly logger: Logger,
    private configService: ConfigService,
    private httpService: HttpService,
    private consistentHash: ConsistentHash,
  ) {}

  @OnEvent('keyword.deleted')
  async deleteKeywordFromDatabase(event: KeywordDeletedEvent) {
    this.logger.log(
      'KeywordDeletedEvent emitted. Deleting keywords from DB...',
    );
    await this.keywordRepository.delete({ status: 'deleted' });
  }

  @OnEvent('keyword.deleted')
  async removeKeywordFromFilteratorService(event: KeywordDeletedEvent) {
    const filteratorCluster = this.configService.get<string>(
      'filteratorCluster.services',
    );
    const filteratorClusterList = JSON.parse(filteratorCluster);
    this.logger.log(
      `KeywordDeletedEvent emitted. Removing keyword ${event.keyword} from the filterator service`,
    );

    filteratorClusterList.map((node) => {
      this.consistentHash.AddNode(node);
    });

    const assignedNode = this.consistentHash.Assign(event.keyword);

    // FIXME: hack, so the test doesn't throw an ECONNREFUSED error for the filterator service
    if (process.env.NODE_ENV !== 'test') {
      const axiosResponse = await this.httpService
        .delete(`${assignedNode}/keywords/${event.keyword}`)
        .toPromise();

      this.logger.log(
        `Keyword ${event.keyword} removed from filterator ${assignedNode}. Current cache now: ${axiosResponse.data}`,
      );
    }
  }
}
