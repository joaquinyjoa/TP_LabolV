import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) },
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'juegos', canActivate: [authGuard], loadComponent: () => import('./pages/juegos/juegos.component').then(m => m.JuegosComponent) },
  { path: 'mayor-menor', canActivate: [authGuard], loadComponent: () => import('./pages/mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent) },
  { path: 'ahorcado', canActivate: [authGuard], loadComponent: () => import('./pages/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent) },
  { path: 'preguntados', canActivate: [authGuard], loadComponent: () => import('./pages/preguntados/preguntados.component').then(m => m.PreguntadosComponent) },
  { path: 'quiensoy', canActivate: [authGuard], loadComponent: () => import('./pages/quien-soy/quien-soy.component').then(m => m.QuienSoyComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
// Nota: Las rutas hijas de 'home' se manejan dentro de HomeComponent con <router-outlet>