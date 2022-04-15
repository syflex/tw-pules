import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { KeywordsModule } from '../src/keywords/keywords.module';

let app: INestApplication;

const createRandomWord = (wordLength: number): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < wordLength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

describe('/keywords', () => {
  const endpoint = 'keywords';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, KeywordsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const keyword1 = createRandomWord(6);
  const keyword2 = createRandomWord(6);

  describe('POST /message', () => {
    it('fails with a 400 if body is empty', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/message`)
        .send({})
        .expect(400);
    });

    it('fails with a 400 if epoch is empty', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/message`)
        .send({ keyword: keyword1 })
        .expect(400);
    });

    it('fails with a 400 if keyword is empty', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/message`)
        .send({ epoch: 4334333 })
        .expect(400);
    });

    it('can send keyword message', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/message`)
        .send({ keyword: keyword2, epoch: 344232 })
        .expect(201)
        .expect(({ body }) => {
          expect(body.success).toEqual(true);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
