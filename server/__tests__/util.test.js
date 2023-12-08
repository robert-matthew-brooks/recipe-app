const { rejectIfNotNumber, rejectIfNotInDb } = require('../util/validate');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');

beforeAll(async () => {
  await seed(data);
});

afterAll(async () => {
  await pool.end();
});

describe('util/validate.js', () => {
  describe('rejectIfNotNumber()', () => {
    it('should not reject if provided with a number', () => {
      expect(() => {
        rejectIfNotNumber({ input: 123 });
      }).not.toThrow();
    });

    it('should not reject if provided with a string of digits', () => {
      expect(() => {
        rejectIfNotNumber({ input: '123' });
      }).not.toThrow();
    });

    it('should reject if not provided with a number', () => {
      expect(() => {
        rejectIfNotNumber({ input: 'abc' });
      }).toThrow();
    });
  });

  describe('rejectIfNotInDb()', () => {
    it('should not reject if the value is in database', async () => {
      let returnedError;

      try {
        await rejectIfNotInDb('recipes', 'name', 'recipe-1');
      } catch (err) {
        returnedError = err;
      }

      expect(returnedError).toBeUndefined();
    });

    it('should reject if the value is not in database', async () => {
      let returnedError;

      try {
        await rejectIfNotInDb('recipes', 'name', 'not-a-recipe');
      } catch (err) {
        returnedError = err;
      }

      expect(returnedError.status).toBe(404);
    });
  });
});
