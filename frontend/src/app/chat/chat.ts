import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatService, Message, UserInfo } from '../services/chat';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  users: UserInfo[] = [];
  selectedUser: UserInfo | null = null;
  messages: Message[] = [];
  newMessage = '';
  currentUserId: number;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUserId = Number(localStorage.getItem('user_id'));
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe({
      next: (users) => {
        console.log('Получены пользователи:', users);
        this.users = users;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Ошибка загрузки пользователей:', err)
    });

    this.chatService.messages$.subscribe(msg => {
      this.messages.push(msg);
      this.cdr.detectChanges();
    });
  }

  selectUser(user: UserInfo): void {
    this.selectedUser = user;
    this.messages = [];

    this.chatService.getHistory(user.id).subscribe({
      next: (history) => {
        this.messages = history;
        this.cdr.detectChanges();
      },
      error: () => console.log('История не загружена или пуста')
    });

    this.chatService.connect(user.id);
  }

  send(): void {
    if (this.newMessage.trim()) {
      this.chatService.send(this.newMessage);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}