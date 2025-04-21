import { capitalizeFirstLetter } from '../string-utils';

describe('string-utils', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle already capitalized string', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    });
  });
});
