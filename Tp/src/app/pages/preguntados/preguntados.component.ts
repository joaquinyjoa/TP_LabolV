import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenesService } from '../../service/imagenes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PreguntadosComponent {
  imagenHeroe: string = ''; // antes heroImage
  opciones: string[] = [];   // antes options
  respuestaCorrecta: string = ''; // antes correctAnswer
  retroalimentacion: string = ''; // antes feedback
  respuestaSeleccionada: boolean = false; // antes answerSelected

  constructor(private imagenesService: ImagenesService, private router: Router) {
    this.nuevaPregunta();
  }

  nuevaPregunta() {
    this.retroalimentacion = '';
    this.respuestaSeleccionada = false;

    this.imagenesService.getMultipleRandomHeroes(4).subscribe({
      next: (heroes) => {
        const correcto = heroes[0];
        this.imagenHeroe = correcto.image;
        this.respuestaCorrecta = correcto.name;

        const nombres = heroes.map(h => h.name);
        this.opciones = this.barajarArray(nombres);
      },
      error: (err) => console.error('Error cargando héroes:', err)
    });
  }

  verificarRespuesta(seleccionada: string) {
    this.respuestaSeleccionada = true;
    if (seleccionada === this.respuestaCorrecta) {
      this.retroalimentacion = '✅ Correcto!';
    } else {
      this.retroalimentacion = `❌ Incorrecto. Era ${this.respuestaCorrecta}`;
    }
  }

  private barajarArray(array: string[]): string[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  navegarAJuegos() {
    this.router.navigate(['/juegos']); // Redirige al home
  }
}
