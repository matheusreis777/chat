import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // ⚠️ Adicione HttpClientModule aqui
  template: `
    <div class="chat-container">
      <div class="messages">
        <div
          *ngFor="let msg of messages"
          [ngClass]="{ 'user-msg': msg.fromUser, 'agent-msg': !msg.fromUser }"
        >
          {{ msg.text }}
        </div>
      </div>
      <form (submit)="sendMessage()" class="chat-form">
        <input [(ngModel)]="newMessage" name="message" placeholder="Digite sua mensagem" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  `,
  styles: [
    `
      .chat-container {
        width: 400px;
        border: 1px solid #ccc;
        padding: 10px;
      }
      .messages {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 10px;
      }
      .user-msg {
        text-align: right;
        color: blue;
        margin: 5px 0;
      }
      .agent-msg {
        text-align: left;
        color: green;
        margin: 5px 0;
      }
      .chat-form {
        display: flex;
      }
      .chat-form input {
        flex: 1;
        padding: 5px;
      }
      .chat-form button {
        padding: 5px 10px;
      }
    `,
  ],
})
export class ChatComponent implements OnInit {
  private http = inject(HttpClient);

  messages: { text: string; fromUser: boolean }[] = [];
  newMessage = '';

  apiUrl = 'http://localhost:8080/instance/Teste/message';
  apiKey = '3FFB5C508FF9-4658-9031-43735BA8C06D';

  ngOnInit() {
    interval(2000).subscribe(() => this.loadMessages());
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const payload = { message: this.newMessage };

    this.http
      .post(this.apiUrl, payload, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }),
      })
      .subscribe({
        next: () => {
          this.messages.push({ text: this.newMessage, fromUser: true });
          this.newMessage = '';
          this.loadMessages();
        },
        error: (err) => console.error('Erro ao enviar mensagem', err),
      });
  }

  loadMessages() {
    this.http
      .get(this.apiUrl, {
        headers: new HttpHeaders({ Authorization: `Bearer ${this.apiKey}` }),
      })
      .subscribe({
        next: (res: any) => {
          if (res.messages) {
            res.messages.forEach((m: any) => {
              if (!this.messages.find((msg) => msg.text === m.text)) {
                this.messages.push({ text: m.text, fromUser: false });
              }
            });
          }
        },
        error: (err) => console.error('Erro ao buscar mensagens', err),
      });
  }
}
