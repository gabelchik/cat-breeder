import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cat {
  id?: number;
  name: string;
  age: number;
  breed: string;
  fur_length: string;
  fur_length_display?: string; 
  owner?: number;
  owner_info?: string;
}

@Injectable({ providedIn: 'root' })
export class CatService {
  private baseUrl = '/api/cats/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cat> {
    return this.http.get<Cat>(`${this.baseUrl}${id}/`);
  }

  create(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>(this.baseUrl, cat);
  }

  update(id: number, cat: Cat): Observable<Cat> {
    return this.http.put<Cat>(`${this.baseUrl}${id}/`, cat);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}