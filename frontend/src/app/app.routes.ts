import { Routes, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { CatsComponent } from './cats/cats';
import { ChatComponent } from './chat/chat';
import { authGuard } from './guards/auth-guard';

function homeRedirect(): UrlTree {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn()
    ? router.createUrlTree(['/cats'])
    : router.createUrlTree(['/login']);
}

export const routes: Routes = [
  { path: '', canActivate: [() => homeRedirect()], children: [] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cats', component: CatsComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];