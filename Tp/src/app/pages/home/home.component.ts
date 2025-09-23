import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // <-- importá RouterModule
import { CommonModule, NgIf, AsyncPipe } from '@angular/common';
import { AuthService, FullUser } from '../../service/auth.service'; 
import { Observable } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    RouterModule,  // <-- necesario para <router-outlet> y navegación de rutas hijas
    CommonModule,
    NgIf,       
    AsyncPipe,  
    ToastModule,
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService],
})
export class HomeComponent {
  user$: Observable<FullUser | null>;
  menuOpen: any;

  constructor(private authService: AuthService, public router: Router) {
    this.user$ = this.authService.currentUserFull$;
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }

  NavegarJuegos() {
    this.router.navigate(['home/juegos']);
  }

  NavegarQuienSoy() {
    this.router.navigate(['/home/quiensoy']);
  }
}
