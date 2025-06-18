const { validateEmail, validatePassword, sanitizeString, sanitizeObject } = require('../middleware/validation');

describe('Validation Middleware', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user name@example.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecure@Pass2023',
        'Complex#Password1',
        'Secure123$Password'
      ];

      strongPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '123456',
        'password',
        'PASSWORD',
        'Pass123',
        'weak',
        'onlylowercase',
        'ONLYUPPERCASE',
        '1234567890'
      ];

      weakPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false);
      });
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should remove potentially dangerous attributes', () => {
      const input = '<img src="x" onerror="alert(1)">Test';
      const result = sanitizeString(input);
      expect(result).toBe('Test');
    });

    it('should trim whitespace', () => {
      const input = '   Hello World   ';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeString(123)).toBe(123);
      expect(sanitizeString(null)).toBe(null);
      expect(sanitizeString(undefined)).toBe(undefined);
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize all string properties in an object', () => {
      const input = {
        name: '<script>alert("xss")</script>John',
        email: 'john@example.com',
        age: 25,
        bio: '<img src="x" onerror="alert(1)">Developer'
      };

      const result = sanitizeObject(input);
      
      expect(result.name).toBe('John');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(25);
      expect(result.bio).toBe('Developer');
    });

    it('should handle nested objects', () => {
      const input = {
        user: {
          name: '<script>alert("xss")</script>John',
          profile: {
            bio: '<img src="x" onerror="alert(1)">Developer'
          }
        }
      };

      const result = sanitizeObject(input);
      
      expect(result.user.name).toBe('John');
      expect(result.user.profile.bio).toBe('Developer');
    });

    it('should handle arrays', () => {
      const input = {
        tags: ['<script>alert("xss")</script>javascript', 'react', '<img src="x">vue']
      };

      const result = sanitizeObject(input);
      
      expect(result.tags[0]).toBe('javascript');
      expect(result.tags[1]).toBe('react');
      expect(result.tags[2]).toBe('vue');
    });
  });
});
