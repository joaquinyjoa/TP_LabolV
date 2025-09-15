import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../data-access/auth.service'; 
import { Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user$: Observable<FirebaseUser | null>;

  constructor(private authService: AuthService, public  router: Router) {
    this.user$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
}
