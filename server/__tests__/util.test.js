const validate = require('../util/validate');
const pool = require('../db/pool');
const seed = require('../db/seed');
const data = require('../db/data/test');
const { makeSlug } = require('../util/sql-functions');

const recipe1 = makeSlug(data.recipes[0].name);

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
        validate.rejectIfFailsRegex({ input: 123 }, '^[\\d]+$');
      }).not.toThrow();

      expect(() => {
        validate.rejectIfFailsRegex({ input: '123' }, '^[\\d]+$');
      }).not.toThrow();

      expect(() => {
        validate.rejectIfFailsRegex({ input: 'abc' }, '^[\\w]+$');
      }).not.toThrow();
    });

    it('should reject if fails regex', () => {
      expect(() => {
        validate.rejectIfFailsRegex({ input: 'abc' }, '^[\\d]+$');
      }).toThrow();

      expect(() => {
        validate.rejectIfFailsRegex({ input: '!?*' }, '^[\\w]+$');
      }).toThrow();
    });
  });

  describe('rejectIfNotInDb()', () => {
    it('should not reject if the value is in database', async () => {
      let returnedError;

      try {
        await validate.rejectIfNotInDb(recipe1, 'slug', 'recipes');
      } catch (err) {
        returnedError = err;
      }

      expect(returnedError).toBeUndefined();
    });

    it('should reject if the value is not in database', async () => {
      let returnedError;

      try {
        await validate.rejectIfNotInDb('not-a-recipe', 'slug', 'recipes');
      } catch (err) {
        returnedError = err;
      }

      expect(returnedError.status).toBe(404);
    });
  });

  describe('rejectIfInvalidUsername()', () => {
    it('should reject if the string is too small', () => {
      expect(() => {
        validate.rejectIfInvalidUsername('x');
      }).toThrow();
    });

    it('should reject if the string is too long', () => {
      expect(() => {
        validate.rejectIfInvalidUsername('123456789012345678901234567890');
      }).toThrow();
    });

    it('should reject if the string contains invalid symbols', () => {
      expect(() => {
        validate.rejectIfInvalidUsername('i*n*v*a*l*i*d');
      }).toThrow();
    });

    it('should reject if the string does not start with a letter', () => {
      expect(() => {
        validate.rejectIfInvalidUsername('1abcde');
      }).toThrow();
    });
  });

  describe('rejectIfInvalidPassword()', () => {
    it('should reject if the string is too small', () => {
      expect(() => {
        validate.rejectIfInvalidPassword('a1');
      }).toThrow();
    });

    it('should reject if the string is too long', () => {
      expect(() => {
        validate.rejectIfInvalidPassword('abcde12345abcde12345abcde12345');
      }).toThrow();
    });

    it('should reject if the string has no letters', () => {
      expect(() => {
        validate.rejectIfInvalidPassword('12345');
      }).toThrow();
    });

    it('should reject if the string has no numbers', () => {
      expect(() => {
        validate.rejectIfInvalidPassword('abcde');
      }).toThrow();
    });
  });
});
