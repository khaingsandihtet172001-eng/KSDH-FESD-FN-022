import { describe, expect, it } from 'vitest';
import { UserRegistration } from './user-registration.model';

const referenceDate = new Date(2024, 4, 20);
const userFor = (dateOfBirth: string | null | undefined) =>
  new UserRegistration('test@example.com', 'test1234', 'Test', 'User', '0891234567', dateOfBirth as string);

describe('UserRegistration.getAge', () => {
  it('TC-01: calculates age when the birthday has passed this year', () => {
    expect(userFor('1990-01-01').getAge(referenceDate)).toBe(34);
  });

  it('TC-02: increments age on the birthday', () => {
    expect(userFor('1990-05-20').getAge(referenceDate)).toBe(34);
  });

  it('TC-03: does not round up before the birthday', () => {
    expect(userFor('1990-12-31').getAge(referenceDate)).toBe(33);
  });

  it('TC-04: returns zero for a person born today', () => {
    expect(userFor('2024-05-20').getAge(referenceDate)).toBe(0);
  });

  it('TC-05: handles a leap-day birthday in a non-leap year', () => {
    expect(userFor('2000-02-29').getAge(referenceDate)).toBe(24);
    expect(userFor('2000-02-29').getAge(new Date(2025, 1, 28))).toBe(24);
    expect(userFor('2000-02-29').getAge(new Date(2025, 2, 1))).toBe(25);
  });

  it('TC-06: rejects a future date of birth', () => {
    expect(() => userFor('2025-01-01').getAge(referenceDate)).toThrow();
  });

  it('TC-07: rejects an incorrect format and a nonexistent calendar date', () => {
    expect(() => userFor('31/02/1990').getAge(referenceDate)).toThrow();
    expect(() => userFor('1990-02-31').getAge(referenceDate)).toThrow();
  });

  it('TC-08: rejects null or undefined date values', () => {
    expect(() => userFor(null).getAge(referenceDate)).toThrow();
    expect(() => userFor(undefined).getAge(referenceDate)).toThrow();
  });

  it('TC-09: calculates age for a long historical date', () => {
    expect(userFor('1900-01-01').getAge(referenceDate)).toBe(124);
  });

  it('TC-10: stays one year lower on the day before the birthday', () => {
    expect(userFor('1990-05-21').getAge(referenceDate)).toBe(33);
  });
});
