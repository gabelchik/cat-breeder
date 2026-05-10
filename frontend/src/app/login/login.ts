import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    if (this.loginForm?.invalid) {
      this.loginForm.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/cats']);
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage = 'Неверное имя пользователя или пароль';
          } else {
            this.errorMessage = err.error?.detail || 'Ошибка входа';
          }
          this.cdr.detectChanges();
        }
      });
  }
}