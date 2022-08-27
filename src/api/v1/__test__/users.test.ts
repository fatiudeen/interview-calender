import supertest from 'supertest';
import express from '@app';
import { unlinkSync } from 'fs';

const app = express.instance();

const validUserData = {
  fullname: 'fatiudeen',
  role: 'interviewer',
};

const inValidUserData = {
  fullname: '',
  role: '',
};
const validSlotData = {
  id: '',
  slot: '5',
};
const inValidSlotData = {
  id: 'fgvggs',
  slot: '0',
};

beforeAll(async () => {
  await supertest(app).post('/api/v1/users').send({
    fullname: 'shehu',
    role: 'candidate',
  });
});

afterAll(() => {
  unlinkSync('test_db.json');
});

describe('users API', () => {
  let validUserId: string;

  describe('POST /users', () => {
    describe('given a valid user input data', () => {
      it('should return 201', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/users')
          .send(validUserData);
        validUserId = body.data.id;

        expect(statusCode).toBe(201);
        expect(body.success).toEqual(true);
      });
    });
    describe('given an invalid user input data', () => {
      it('should return 400', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/users')
          .send(inValidUserData);

        expect(statusCode).toBe(400);
        expect(body.success).toEqual(false);
      });
    });
  });

  describe('GET /users', () => {
    describe('given the database is not empty', () => {
      it('should send array of users return 200', async () => {
        const { statusCode, body } = await supertest(app).get('/api/v1/users/');

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
      });
    });
  });

  describe('PUT /users', () => {
    describe('given a the user exists', () => {
      it('should add the slot return 200 and the user', async () => {
        validSlotData.id = validUserId;
        const { statusCode, body } = await supertest(app)
          .put('/api/v1/users')
          .send(validSlotData);

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.objectContaining({
            slots: [parseInt(validSlotData.slot, 10)],
          }),
        );
      });
    });

    describe('given an invalid slot', () => {
      it('should return 500', async () => {
        inValidSlotData.id = validUserId;
        inValidSlotData.slot = 'boy';
        const { statusCode, body } = await supertest(app)
          .put('/api/v1/users')
          .send(inValidSlotData);

        expect(statusCode).toBe(500);
        expect(body.success).toEqual(false);
      });
    });

    describe('given a the user does not exists', () => {
      it('should return 500', async () => {
        inValidSlotData.id = 'dfgh';
        inValidSlotData.slot = '0';
        const { statusCode, body } = await supertest(app)
          .put('/api/v1/users')
          .send(inValidSlotData);

        expect(statusCode).toBe(500);
        expect(body.success).toEqual(false);
        expect(body.error).toEqual(
          expect.objectContaining({ message: 'cannot find user with that id' }),
        );
      });
    });
  });

  describe('GET /users/slots', () => {
    describe('given user have slots', () => {
      it('should 200 and slots', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/v1/users/slots',
        );
        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(expect.arrayContaining([expect.any(Object)]));
      });
    });
  });

  describe('GET /users/interviewers', () => {
    describe('given interviewers exists', () => {
      it('should return 200 and array', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/v1/users/interviewers',
        );

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ role: 'interviewer' }),
          ]),
        );
      });
    });
  });

  describe('GET /users/candidates', () => {
    describe('given interviewers exists', () => {
      it('should return 200 and array', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/v1/users/candidates',
        );

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ role: 'candidate' }),
          ]),
        );
      });
    });
  });

  describe('GET /users/:id', () => {
    describe('given the user exists', () => {
      it('should add the slot return 200 and the user', async () => {
        const { statusCode, body } = await supertest(app).get(
          `/api/v1/users/${validUserId}`,
        );

        expect(statusCode).toBe(200);
        expect(body.success).toEqual(true);
        expect(body.data).toEqual(expect.objectContaining(validUserData));
      });
    });

    describe('given the user does not exists', () => {
      it('should add the slot return 500 and error message', async () => {
        const { statusCode, body } = await supertest(app).get(
          '/api/v1/users/sdfgh',
        );
        expect(statusCode).toBe(500);
        expect(body.success).toEqual(false);
        expect(body.error).toEqual(
          expect.objectContaining({ message: 'cannot find user with that id' }),
        );
      });
    });
  });
});
