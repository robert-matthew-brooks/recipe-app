const { rejectIfFailsRegex, rejectIfNotInDb } = require('../util/validate');
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
  describe('rejectIfFailsRegex()', () => {
    it('should not reject if passes regex', () => {
      expect(() => {
        rejectIfFailsRegex({ input: 123 }, '^[\\d]+$');
      }).not.toThrow();

      expect(() => {
        rejectIfFailsRegex({ input: '123' }, '^[\\d]+$');
      }).not.toThrow();

      expect(() => {
        rejectIfFailsRegex({ input: 'abc' }, '^[\\w]+$');
      }).not.toThrow();
    });

    it('should reject if fails regex', () => {
      expect(() => {
        rejectIfFailsRegex({ input: 'abc' }, '^[\\d]+$');
      }).toThrow();

      expect(() => {
        rejectIfFailsRegex({ input: '!?*' }, '^[\\w]+$');
      }).toThrow();
    });
  });

  describe('rejectIfNotInDb()', () => {
    it('should not reject if the value is in database', async () => {
      let returnedError;

      try {
        await rejectIfNotInDb('recipe-1', 'slug', 'recipes');
      } catch (err) {
        returnedError = err;
      }

      expect(returnedError).toBeUndefined();
    });

    it('should reject if the value is not in database', async () => {
      let returnedError;

      try {
        await rejectIfNotInDb('not-a-recipe', 'slug', 'recipes');
      } catch (err) {
        returnedError = err;
      }

      expect(returnedError.status).toBe(404);
    });
  });

  describe('rejectIfInvalidUsername()', () => {
    // TODO
  });

  describe('rejectIfInvalidPassword()', () => {
    // TODO
  });
});
