import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  standalone: true, 
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.css']
})
export class QuienSoyComponent implements OnInit {
  githubData: any = null;
  cargando: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerDatosGitHub();
  }

  obtenerDatosGitHub() {
    const username = 'joaquinyjoa';
    this.http.get(`https://api.github.com/users/${username}`)
      .subscribe({
        next: (data) => {
          this.githubData = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al obtener datos', err);
          this.githubData = null;
          this.cargando = false;
        }
      });
  }
}
