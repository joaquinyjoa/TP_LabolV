import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../service/usuarios';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent {

  cartas: number[] = Array.from({ length: 13 }, (_, i) => i + 1); // 1 a 13
  cartaActual: number = 0;
  cartaSiguiente: number = 0;
  puntaje: number = 0;
  mensaje: string = '';

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.nuevaCarta();
  }

  // Selecciona una carta aleatoria
  nuevaCarta() {
    const indice = Math.floor(Math.random() * this.cartas.length);
    this.cartaActual = this.cartas[indice];
    this.mensaje = '';
  }

  jugar(eleccion: 'mayor' | 'menor') {
    // Generar siguiente carta
    const indice = Math.floor(Math.random() * this.cartas.length);
    this.cartaSiguiente = this.cartas[indice];

    if ((eleccion === 'mayor' && this.cartaSiguiente > this.cartaActual) ||
        (eleccion === 'menor' && this.cartaSiguiente < this.cartaActual)) {
      // Acertó
      this.puntaje++;
      this.mensaje = `¡Acertaste! Carta siguiente: ${this.cartaSiguiente}`;
    } else {
      // Falló
      this.mensaje = `Fallaste 😢 Carta siguiente: ${this.cartaSiguiente}. Puntaje final: ${this.puntaje}`;
      // Guardar puntaje
      this.usuariosService.agregarPuntajeMayorMenor(this.puntaje);
      this.puntaje = 0;
    }

    // La carta siguiente ahora es la actual
    this.cartaActual = this.cartaSiguiente;
  }

  reiniciar() {
    this.puntaje = 0;
    this.nuevaCarta();
  }

  // Navegar al home
  navegarAJuegos() {
    this.router.navigate(['/juegos']);
  }
}
