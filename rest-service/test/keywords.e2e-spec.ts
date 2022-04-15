import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { KeywordsModule } from '../src/keywords/keywords.module';
import { KeywordStringResponses } from '../src/keywords/keywords.string-responses';

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
  let keywordId1: string;
  const epoch_start:string = '1632429927';
 
  describe('POST /create', () => {
    it('POST /create should add a keyword to the watch list', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/create`)
        .send({ keywords: [keyword1, keyword2] })
        .expect(201)
        .expect(({ body }) => {
          const secondReturnedKeyword = body.keywords[1].keyword;
          keywordId1 = body.keywords[0].id;
          expect(body).toHaveProperty('keywords');
          expect(body.keywords).toHaveLength(2);
          expect(body.keywords[0]).toHaveProperty('id');
          expect(
              secondReturnedKeyword === keyword1.toLowerCase() ||
              secondReturnedKeyword === keyword2.toLowerCase(),
          ).toBeTruthy();
        });
    });

    
    it('POST /create should throw a 400 error with a numeric/alphanumeric input', () => {
      const testInput = '12w3x45w6';
      return request(app.getHttpServer())
        .post(`/${endpoint}/create`)
        .send({ keywords: [testInput] })
        .expect(400)
        .expect(({ body }) => {
          expect(body.errors).toEqual(
            KeywordStringResponses.badInputResponse(testInput.toLowerCase()),
          );
          expect(body.status).toBeFalsy();
        });
    });

    it('POST /create should throw a 400 error with special characters in the input', () => {
      const testInput = 'wxw//$&^';
      return request(app.getHttpServer())
        .post(`/${endpoint}/create`)
        .send({ keywords: [testInput] })
        .expect(400)
        .expect(({ body }) => {
          expect(body.errors).toEqual(
            KeywordStringResponses.badInputResponse(testInput.toLowerCase()),
          );
          expect(body.status).toBeFalsy();
        });
    });

    it('POST /create should throw a 400 error with already tracked keyword in the input', () => {
      return request(app.getHttpServer())
        .post(`/${endpoint}/create`)
        .send({ keywords: [keyword1] })
        .expect(400)
        .expect(({ body }) => {
          expect(body.errors).toEqual(
            KeywordStringResponses.existingKeywordResponse(
              keyword1.toLowerCase(),
            ),
          );
          expect(body.status).toBeFalsy();
        });
    });
  });

  const epoch_end:string = String(new Date().getTime());

  describe('GET /fetch', () => {

    it('GET /fetch should retrieve all the keywords on the watchlist.', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}/fetch`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveProperty('keywords');
          expect(body.keywords.length).toBeGreaterThanOrEqual(2);
          expect(body.keywords[0]).toHaveProperty('id');
        });
    });

    it('should return error that the keywords does exist.', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}/timeseries?from_time=${epoch_start}&to_time=${epoch_end}&keyword=${keyword2.toLowerCase()+'abcd'}`)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBe(`Validation failed: ${keyword2.toLowerCase()+'abcd'} does not match a keyword.`);
        });
    });

    it('should throw an error when from_time is greather than or equal to to_time.', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}/timeseries?from_time=${epoch_end}&to_time=${epoch_start}&keyword=${keyword2.toLowerCase()}`)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBe('Validation failed: from_time cannot be greater than to_time');
        });
    });

    it('should throw an error when from_time is not a valide epoch..', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}/timeseries?from_time=${epoch_start+"9999"}&to_time=${epoch_end}&keyword=${keyword2}`)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toStrictEqual(['from_time must be shorter than or equal to 13 characters']);
        });
    });

    it('should throw an error when to_time is not a valide epoch.', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}/timeseries?from_time=${epoch_start}&to_time=${epoch_end+"9999"}&keyword=${keyword2.toLowerCase()}`)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toStrictEqual(["to_time must be shorter than or equal to 13 characters"]);
        });
    });

    it('should throw an error when keyword has not been tracked for over 30days.', () => {
      return request(app.getHttpServer())
        .get(`/${endpoint}/timeseries?from_time=${epoch_start}&to_time=${epoch_end}&keyword=${keyword2.toLowerCase()}`)
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBe(`Validation failed: ${keyword2.toLowerCase()} has no occurrence`);
        });
    });
  });

  describe('Delete /delete', () => {
    it('should delete keywords by id', () => {
      return request(app.getHttpServer())
        .delete(`/${endpoint}/delete/${keywordId1.toLowerCase()}`)
        .expect(200)
        .expect(({ body }) => {  
          expect(body.keywords.status).toBe('deleted');
        });
    });

    it('should throw an error that keywords does not match a keyword', () => {
      return request(app.getHttpServer())
        .delete(`/${endpoint}/delete/${keywordId1.toLowerCase()}`)
        .expect(400)
        .expect(({ body }) => {  
          expect(body.message).toBe(`Keyword with id:${keywordId1.toLowerCase()} does not match a keyword.`);
        });
    });
  });
 

  afterAll(async () => {
    await app.close();
  });
});
