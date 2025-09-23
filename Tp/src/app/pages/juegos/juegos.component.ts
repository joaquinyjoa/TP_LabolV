import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css']
})
export class JuegosComponent implements OnInit {
  preguntadosImg: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarImagen();
  }

  volverHome() {
    this.router.navigate(['/home']);
  }

  navegarPreguntados() {
    this.router.navigate(['/preguntados']);
  }

  cargarImagen() {
    // Suponiendo que tu API devuelve un objeto { url: 'https://...' }
    this.http.get<{url: string}>('https://miapi.com/preguntados-img')
      .subscribe(res => {
        this.preguntadosImg = res.url;
      }, err => {
        console.error('Error cargando imagen', err);
        // fallback en caso de error
        this.preguntadosImg = 'assets/preguntados.png';
      });
  }
}
