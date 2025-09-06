import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/feature/login/login.component')
  },
  {
    path: 'home',
    loadComponent: () => import('./auth/feature/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'error',
    loadComponent: () => import('./auth/feature/error/error.component')
  },
  {
    path: 'home/quiensoy',
    loadComponent: () => import('./auth/feature/quien-soy/quien-soy.component').then(m => m.QuienSoyComponent)
    }
,
];
