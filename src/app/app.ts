import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserRegistration } from './user-registration.model';

type FormField = 'userEmail' | 'userPassword' | 'userFirstName' | 'userLastName' | 'userTel' | 'dateOfBirth';
type Notice = { status: number; message: string; kind: 'success' | 'error' };

const validBirthDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return { dateFormat: true };

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(0);
  parsed.setFullYear(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return { calendarDate: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed > today ? { futureDate: true } : null;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly builder = inject(FormBuilder).nonNullable;

  readonly form = this.builder.group({
    userEmail: ['', [Validators.required, Validators.email]],
    userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]+$/)]],
    userFirstName: ['', Validators.required],
    userLastName: ['', Validators.required],
    userTel: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    dateOfBirth: ['', [Validators.required, validBirthDate]],
  });

  readonly classList = signal<UserRegistration[]>([
    new UserRegistration('daranporn@gmail.com', 'Student001', 'Sira', 'Weerakittana', '0891234567', '2010-05-26'),
    new UserRegistration('boonpoj@gmail.com', 'Student002', 'Rosanan', 'Suvanabhumiwong', '0641825563', '2010-09-14'),
    new UserRegistration('bodin_thai@gmail.com', 'Student003', 'Tankwan', 'Srisuk', '0986345661', '2005-02-03'),
  ]);
  readonly classSize = computed(() => this.classList().length);
  readonly notice = signal<Notice | null>(null);
  readonly attempted = signal(false);

  hasError(field: FormField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.attempted());
  }

  get birthDateHelp(): string {
    const errors = this.form.controls.dateOfBirth.errors;
    if (errors?.['required']) return 'Date of birth is required.';
    if (errors?.['calendarDate']) return 'Enter a real calendar date.';
    if (errors?.['futureDate']) return 'Date of birth cannot be in the future.';
    return 'Enter the date as YYYY-MM-DD (for example, 2012-05-26).';
  }

  submitRegistration(): void {
    this.attempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notice.set({ status: 400, kind: 'error', message: 'Please correct the marked information and try again.' });
      return;
    }

    const details = this.form.getRawValue();
    if (this.classList().some((student) => student.userEmail.toLowerCase() === details.userEmail.toLowerCase())) {
      this.notice.set({ status: 409, kind: 'error', message: 'This email address is already registered for the class.' });
      return;
    }

    this.classList.update((students) => [...students, new UserRegistration(
      details.userEmail, details.userPassword, details.userFirstName.trim(), details.userLastName.trim(), details.userTel, details.dateOfBirth,
    )]);
    this.notice.set({ status: 201, kind: 'success', message: 'Student registration completed successfully.' });
    this.form.reset();
    this.attempted.set(false);
  }

  closeNotice(): void {
    this.notice.set(null);
  }
}
