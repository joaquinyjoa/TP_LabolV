import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/feature/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./auth/feature/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'quiensoy',
    loadComponent: () =>
      import('./auth/feature/quien-soy/quien-soy.component').then(m => m.QuienSoyComponent)
  },
];
