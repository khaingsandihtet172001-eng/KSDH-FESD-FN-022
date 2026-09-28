/** Class-based user model required by the final lab specification. */
export class UserRegistration {
  constructor(
    public userEmail: string,
    public userPassword: string,
    public userFirstName: string,
    public userLastName: string,
    public userTel: string,
    public dateOfBirth: string,
  ) {}

  /** Returns age in completed years. An optional date makes boundary tests deterministic. */
  getAge(asOf: Date = new Date()): number {
    if (!this.dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(this.dateOfBirth)) {
      throw new Error('Date of birth must use YYYY-MM-DD format.');
    }

    const [year, month, day] = this.dateOfBirth.split('-').map(Number);
    const birthDate = new Date(Date.UTC(year, month - 1, day));
    if (
      birthDate.getUTCFullYear() !== year ||
      birthDate.getUTCMonth() !== month - 1 ||
      birthDate.getUTCDate() !== day
    ) {
      throw new Error('Date of birth must be a real calendar date.');
    }

    const today = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate());
    const birth = new Date(year, month - 1, day);
    if (birth > today) throw new Error('Date of birth cannot be in the future.');

    let age = today.getFullYear() - year;
    const birthdayHasPassed =
      today.getMonth() > month - 1 ||
      (today.getMonth() === month - 1 && today.getDate() >= day);
    if (!birthdayHasPassed) age -= 1;
    return age;
  }
}
