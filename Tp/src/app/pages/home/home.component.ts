import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { AuthService, FullUser } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgIf,
    AsyncPipe,
    ToastModule,
    ButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService],
})
export class HomeComponent {
  user$: Observable<FullUser | null>;
  loading = false; // control del spinner

  constructor(private authService: AuthService, public router: Router) {
    this.user$ = this.authService.currentUserFull$;
  }

  logout() {
    this.loading = true;
    this.authService.logout()
      .then(() => this.router.navigate(['/']))
      .finally(() => this.loading = false);
  }

  NavegarJuegos() {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['/juegos']).finally(() => this.loading = false);
    }, 3000); // duración de 3 segundos
  }

  NavegarQuienSoy() {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['/quiensoy']).finally(() => this.loading = false);
    }, 3000);
  }

  NavegarListados() {
    this.loading = true;
    setTimeout(() => {
      this.router.navigate(['/listados']).finally(() => this.loading = false);
    }, 3000);
  }
}
