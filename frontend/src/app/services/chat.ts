import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth';

export interface Message {
  id?: number;
  sender: number;
  receiver: number;
  text: string;
  created_at?: string;
  sender_username: string;
  receiver_username: string;
}

export interface UserInfo {
  id: number;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = '/api';
  private socket: WebSocket | null = null;
  public messages$ = new Subject<Message>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<UserInfo[]> {
    return this.http.get<UserInfo[]>(`${this.baseUrl}/users/`);
  }

  getHistory(receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/${receiverId}/`);
  }

  connect(receiverId: number): void {
    this.disconnect();
    const token = this.authService.getAccessToken();
    const url = `ws://${window.location.host}/ws/chat/${receiverId}/?token=${token}`;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log('WebSocket connected');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message: Message = {
        sender: data.sender_id,
        receiver: receiverId,
        text: data.message,
        sender_username: data.sender_username,
        receiver_username: ''
      };
      this.messages$.next(message);
    };
    this.socket.onerror = (error) => console.error('WebSocket error:', error);
    this.socket.onclose = () => this.socket = null;
  }

  send(text: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ message: text }));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}