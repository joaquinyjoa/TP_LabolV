import { Routes } from '@angular/router';
// import { BienvenidoComponent } from './auth/feature/bienvenido/bienvenido.component';
// import { LoginComponent } from './auth/feature/login/login.component';

export const routes: Routes = [
    { 
        path: 'auth',
        loadChildren: () => import('./auth/feature/auth.routes')
    },
    // {
    //     path: 'tasks',
    // }
];
