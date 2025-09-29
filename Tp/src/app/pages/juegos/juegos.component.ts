import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css'],
  imports: [
    CommonModule,
    NgIf,
    MatProgressSpinnerModule
  ],
})
export class JuegosComponent {

  loading: boolean = false; // Spinner global

  constructor(private router: Router) {}

  // Spinner de 3 segundos y luego navegar
  async navegarConSpinner(path: string) {
    this.loading = true;
    await new Promise(res => setTimeout(res, 3000));
    this.router.navigate([path]);
    this.loading = false;
  }

  volverHome() {
    this.navegarConSpinner('/home');
  }

  navegarPreguntados() {
    this.navegarConSpinner('/preguntados');
  }

  navegarAhorcado() {
    this.navegarConSpinner('/ahorcado');
  }

  navegarMayorOMenor() {
    this.navegarConSpinner('/mayor-menor');
  }
}
