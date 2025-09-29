import { Injectable, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

export interface Usuario {
  nombre: string;
  puntosAhorcado?: number;
  puntosPreguntados?: number;
  puntosMayorMenor?: number;
  puntosJuegoPropio?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  public usuarioActual: Usuario | null = null;

  constructor() {
    // Usuario inicial por defecto
    this.usuarioActual = { 
      nombre: 'Nadie', 
      puntosAhorcado: 0,
      puntosPreguntados: 0,
      puntosMayorMenor: 0,
      puntosJuegoPropio: 0
    };
  }

  logear(user: string, clave: string) {
    // Login de prueba
    if (user === 'admin' && clave === 'admin') {
      this.usuarioActual = { 
        nombre: user, 
        puntosAhorcado: 0,
        puntosPreguntados: 0,
        puntosMayorMenor: 0,
        puntosJuegoPropio: 0
      };
      return true;
    }
    return false;
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  // Suma puntos al puntaje existente
  async agregarPuntajeAhorcado(puntos: number) {
    if (!this.usuarioActual) return;

    if (!this.usuarioActual.puntosAhorcado) this.usuarioActual.puntosAhorcado = 0;
    this.usuarioActual.puntosAhorcado += puntos;

    console.log(`Puntaje local Ahorcado: ${this.usuarioActual.puntosAhorcado}`);

    // Obtener UID del usuario logueado
    const currentUser = await firstValueFrom(user(this._auth));
    if (!currentUser) return;

    const usuarioRef = doc(this._firestore, `usuarios/${currentUser.uid}`);
    await updateDoc(usuarioRef, { puntosAhorcado: this.usuarioActual.puntosAhorcado });
  }

  agregarPuntajePreguntados(puntos: number) {
    if (!this.usuarioActual) return;
    if (!this.usuarioActual.puntosPreguntados) this.usuarioActual.puntosPreguntados = 0;
    this.usuarioActual.puntosPreguntados += puntos;
  }

  agregarPuntajeMayorMenor(puntos: number) {
    if (!this.usuarioActual) return;
    if (!this.usuarioActual.puntosMayorMenor) this.usuarioActual.puntosMayorMenor = 0;
    this.usuarioActual.puntosMayorMenor += puntos;
  }

  agregarPuntajeJuegoPropio(puntos: number) {
    if (!this.usuarioActual) return;
    if (!this.usuarioActual.puntosJuegoPropio) this.usuarioActual.puntosJuegoPropio = 0;
    this.usuarioActual.puntosJuegoPropio += puntos;
  }
}
