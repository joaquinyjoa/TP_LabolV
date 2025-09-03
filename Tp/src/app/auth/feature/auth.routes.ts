import { Routes } from "@angular/router";

export default [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component')
    },
    {
        path: 'error',
        loadComponent: () => import('./error/error.component')
    },
    {
        path: 'bienvenido',
        loadComponent: () => import('./error/error.component')
    }
] as Routes