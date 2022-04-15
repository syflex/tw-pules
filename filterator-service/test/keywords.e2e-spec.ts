import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { KeywordsModule } from '../src/keywords/keywords.module';
import { KeywordsService } from '../src/keywords/keywords.service';

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

    const keywordsService = app.get<KeywordsService>(KeywordsService);
    const testUrl = 'http://localhost:4000';
    await keywordsService.addKeywordToCacheFromDatabase(testUrl);

    await app.init();
  });

  const keyword1 = createRandomWord(6);
  const keyword2 = createRandomWord(6);

  describe('GET /', () => {
    it('GET / should return the keywords added from the database', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body.length).toBeGreaterThanOrEqual(0);
        });
    });
  });

  describe('POST /add', () => {
    it('POST /add should add keywords to the cache', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/add`)
        .send({ keywords: [keyword1, keyword2] })
        .expect(201)
        .expect(({ body }) => {
          expect(body.length).toBeGreaterThanOrEqual(2);
          expect(body).toContain(keyword1);
          expect(body).toContain(keyword2);
        });
    });
  });

  describe('DELETE /:keyword', () => {
    it('DELETE /:keyword should delete keywords from the cache', () => {
      return request(app.getHttpServer())
        .delete(`/${endpoint}/${keyword1}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.length).toBeGreaterThanOrEqual(1);
          expect(body).not.toContain(keyword1);
          expect(body).toContain(keyword2);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
