import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const rutasDirectas = ['/juegos', '/quiensoy'];

  return authService.estaLogueado$().pipe(
    map(isLoggedIn => {

      // 1️⃣ Si no está logueado, siempre al login
      if (!isLoggedIn) {
        return router.createUrlTree(['/']);
      }

      // 2️⃣ Si intenta acceder a rutas directas sin pasar por /home
      if (rutasDirectas.includes(state.url)) {
        return router.createUrlTree(['/']);
      }

      // 3️⃣ Si intenta acceder a cualquier ruta inexistente
      const rutasValidas = ['/', '/registro', '/home', ...rutasDirectas];
      if (!rutasValidas.includes(state.url)) {
        return router.createUrlTree(['/**']);
      }

      // 4️⃣ Está logueado y es una ruta válida
      return true;
    })
  );
};
