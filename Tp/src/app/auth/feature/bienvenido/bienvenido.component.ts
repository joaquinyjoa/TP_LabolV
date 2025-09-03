import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  imports: [],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export default class BienvenidoComponent {
  private router = inject(Router);

  login()
  {
     this.router.navigate(['/login']);
  }
}
