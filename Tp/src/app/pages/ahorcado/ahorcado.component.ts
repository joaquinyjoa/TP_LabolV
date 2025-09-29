import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { firstValueFrom } from 'rxjs'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {

  palabras: string[] = ['ANGULAR', 'POKEMON', 'PROGRAMAR', 'AHORCADO'];
  palabraSecreta: string = '';
  palabraMostrar: string[] = [];
  letrasUsadas: string[] = [];
  letrasAcertadas: number = 0;
  intentos: number = 6;
  intentosMaximos: number = 6; 
  puntaje: number = 0;         
  mensaje: string = '';

  partesMuñeco: string[] = ['cabeza', 'cuerpo', 'brazo-izq', 'brazo-der', 'pierna-izq', 'pierna-der'];

  constructor(private http: HttpClient, private router: Router) {
    this.nuevaPalabra();
  }

  navegarAJuegos() {
    this.router.navigate(['/juegos']);
  }

  async nuevaPalabra() {
    this.letrasUsadas = [];
    this.letrasAcertadas = 0;
    this.puntaje = 0;
    this.intentos = this.intentosMaximos;
    this.mensaje = '';

    // Selección aleatoria de palabra local
    const indice = Math.floor(Math.random() * this.palabras.length);
    this.palabraSecreta = this.palabras[indice];
    this.palabraMostrar = Array(this.palabraSecreta.length).fill('_');

    try {
      // Generar palabra random en español desde lista ejemplo
      const randomWord = await this.obtenerPalabraRandom();
      this.palabraSecreta = randomWord.toUpperCase();
      this.palabraMostrar = Array(this.palabraSecreta.length).fill('_');
    } catch (error) {
      console.error('Error al obtener palabra de la API, usando palabra default');
      this.palabraSecreta = 'AHORCADO';
      this.palabraMostrar = Array(this.palabraSecreta.length).fill('_');
    }
  }

  async obtenerPalabraRandom(): Promise<string> {
    const palabrasEjemplo = [
      'PERRO','GATO','CASA','ARBOL','ESCUELA','PROGRAMAR','COMPUTADORA','AHORCADO',
      'TECLADO','JUEGO','CIUDAD','FAMILIA','AMISTAD','LIBRO','VACACIONES',
      'ESCRITORIO','ENTRENADOR','AVION','MUSICA','COLORES'
    ];

    const indice = Math.floor(Math.random() * palabrasEjemplo.length);
    const palabra = palabrasEjemplo[indice];

    // Ejemplo de API (en inglés), solo para práctica
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`;

    const response: any = await firstValueFrom(this.http.get(url));
    return response[0].word || palabra;
  }

  jugar(letra: string) {
    letra = letra.toUpperCase();
    if (this.letrasUsadas.includes(letra) || this.intentos === 0 || !this.palabraMostrar.includes('_')) return;

    this.letrasUsadas.push(letra);

    if (this.palabraSecreta.includes(letra)) {
      for (let i = 0; i < this.palabraSecreta.length; i++) {
        if (this.palabraSecreta[i] === letra) {
          if (this.palabraMostrar[i] === '_') {
            this.palabraMostrar[i] = letra;
            this.letrasAcertadas++;
          }
        }
      }
    } else {
      this.intentos--;
    }

    // Puntaje por letras acertadas
    const puntajePorLetras = Math.round((this.letrasAcertadas / this.palabraSecreta.length) * 100);

    // Ajuste por intentos restantes (solo suma, nunca resta)
    const porcentajeIntentos = this.intentos / this.intentosMaximos;
    const puntajeIntentos = Math.round(puntajePorLetras * porcentajeIntentos);

    // Tomamos el mayor entre puntaje por letras y puntaje ajustado por intentos
    this.puntaje = Math.max(puntajePorLetras, puntajeIntentos);

    if (!this.palabraMostrar.includes('_')) {
      this.mensaje = `¡Ganaste! 🎉 Puntaje: ${this.puntaje} puntos`;
    } else if (this.intentos === 0) {
      this.mensaje = `Perdiste 😢 La palabra era: ${this.palabraSecreta}`;
    }
  }

}
