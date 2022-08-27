import supertest from 'supertest';
import express from '@app';
import { unlinkSync } from 'fs';
import interviewServices from '@services/interview.services';
import { jest } from '@jest/globals';

const app = express.instance();

const validInterviewResult = {
  result: {
    id: '7l8XQ9qnrd',
    interviewer: [
      {
        fullname: 'deen',
        role: 'interviewer',
        id: 'ZidpVhbEUP',
        slots: [2, 5, 6],
        assigned: false,
      },
      {
        fullname: 'fatiu',
        role: 'interviewer',
        id: 'k4QUAoAknw',
        slots: [2],
        assigned: false,
      },
    ],
    candidate: {
      fullname: 'kate',
      role: 'candidate',
      id: '7l8XQ9qnrd',
      slots: [2],
      assigned: true,
    },
  },
  'the following interviewers wont be free during the interview': 0,
};
const validInterviewData = {
  candidate: '7l8XQ9qnrd',
  interviewers: ['k4QUAoAknw', 'ZidpVhbEUP'],
};

jest
  .spyOn(interviewServices, 'schedule')
  .mockReturnValue(<any>validInterviewResult);
jest
  .spyOn(interviewServices, 'getAll')
  .mockReturnValue([validInterviewResult.result]);
jest
  .spyOn(interviewServices, 'getOne')
  .mockReturnValue(<any>validInterviewResult.result);

afterAll(() => {
  unlinkSync('test_db.json');
});
describe('users API', () => {
  describe('POST /interviews', () => {
    describe('given no input data', () => {
      it('should schedule interviews automatically and return 201', async () => {
        const { statusCode, body } = await supertest(app).post(
          '/api/v1/interviews',
        );

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
      });
    });
    describe('given a valid input data', () => {
      it('should schedule a interview and return 201', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/interviews')
          .send(validInterviewData);

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
      });
    });
  });

  describe('GET /interviews', () => {
    describe('given the database is not empty', () => {
      it('should send array of interviews return 200', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/v1/interviews/',
        );

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
      });
    });
  });

  describe('GET /interviews/:id', () => {
    describe('given a the interview exists', () => {
      it('should add the slot return 200 and the user', async () => {
        const { statusCode, body } = await supertest(app).get(
          `/api/v1/interviews/${validInterviewResult.result.id}`,
        );
        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
      });
    });
  });
});
