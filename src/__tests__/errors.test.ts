import { CustomError } from '../errors';

describe('Errors', () => {
  test('should throw error with instanceof CustomError', () => {
    expect(() => {
      throw new CustomError('This is an error');
    }).toThrowError();
  });
});
