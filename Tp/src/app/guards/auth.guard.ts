import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.estaLogueado$().pipe(
    map(isLoggedIn => {
      if (!isLoggedIn) {
        // Si no está logueado, siempre al login
        return router.createUrlTree(['/']);
      }

      const rutasValidas = ['/', '/registro', '/home', '/juegos', '/quiensoy'];
      
      if (!rutasValidas.includes(state.url)) {
        return router.createUrlTree(['/**']); // cualquier ruta inválida
      }

      // Está logueado y es una ruta válida
      return true;
    })
  );
};

