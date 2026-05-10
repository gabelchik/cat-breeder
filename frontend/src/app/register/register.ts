import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  @ViewChild('regForm') regForm!: NgForm;

  username = '';
  email = '';
  password = '';
  password2 = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (this.regForm?.invalid) {
      this.regForm.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.register(this.username, this.email, this.password, this.password2)
      .subscribe({
        next: () => {
          this.router.navigate(['/cats']);
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error) {
            const messages: string[] = [];
            if (err.error.detail) {
              messages.push(err.error.detail);
            } else {
              Object.keys(err.error).forEach(key => {
                const fieldErrors = err.error[key];
                if (Array.isArray(fieldErrors)) {
                  messages.push(...fieldErrors);
                } else if (typeof fieldErrors === 'string') {
                  messages.push(fieldErrors);
                }
              });
            }
            this.errorMessage = messages.join(' ') || 'Ошибка регистрации.';
          } else {
            this.errorMessage = 'Ошибка регистрации. Попробуйте снова.';
          }
          this.cdr.detectChanges();
        }
      });
  }
}