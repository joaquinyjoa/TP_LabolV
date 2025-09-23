import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf, AsyncPipe, NgForOf } from '@angular/common';
import { AuthService, FullUser } from '../../service/auth.service';
import { ChatService, ChatMessage } from '../../service/chat.service';
import { Observable } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    ToastModule,
    ButtonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService],
})
export class HomeComponent {
  user$: Observable<FullUser | null>;
  chatMessages$: Observable<ChatMessage[]>;
  newMessage: string = '';
  loadingChat: boolean = true;

  loading: boolean = false; // Spinner global para navegación
  chatWidth: number = 300;
  chatHeight: number = 350;

  constructor(
    private authService: AuthService,
    public router: Router,
    private chatService: ChatService
  ) {
    this.user$ = this.authService.currentUserFull$;
    this.chatMessages$ = this.chatService.getMessages();
    this.chatMessages$.subscribe(() => this.loadingChat = false);
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/']));
  }

  // Navegación con spinner de 3 segundos
  async navegarConSpinner(path: string) {
    this.loading = true;
    await new Promise(res => setTimeout(res, 3000)); // 3 segundos
    this.router.navigate([path]);
    this.loading = false;
  }

  // Métodos de navegación que usan el spinner
  NavegarJuegos() {
    this.navegarConSpinner('/juegos');
  }

  NavegarQuienSoy() {
    this.navegarConSpinner('/quiensoy');
  }

  navegarListados() {
    this.navegarConSpinner('/listados');
  }

  enviarMensaje(user: FullUser | null) {
    if (!this.newMessage.trim() || !user) return;

    const message: ChatMessage = {
      user: user.nick,
      time: new Date().toISOString(),
      message: this.newMessage.trim()
    };

    this.chatService.sendMessage(message);
    this.newMessage = '';
  }
}
