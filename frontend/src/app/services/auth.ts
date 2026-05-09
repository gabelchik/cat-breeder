import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string, password2: string): Observable<AuthResponse> {
    const body = { username, email, password, password2 };
    return this.http.post<AuthResponse>(`${this.baseUrl}/register/`, body).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    return this.http.post<AuthResponse>(`${this.baseUrl}/token/`, body).pipe(
      tap(response => this.saveTokens(response))
    );
  }

  saveTokens(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('user_id', String(response.id));
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
  }
}