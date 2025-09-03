import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'juacotp-bedab',
        appId: '1:369713091350:web:4dfbbaa7a7a8fb582ab637',
        storageBucket: 'juacotp-bedab.firebasestorage.app',
        apiKey: 'AIzaSyAGiBudv8_Zx4vOInqzGBlId0wJPfxWydY',
        authDomain: 'juacotp-bedab.firebaseapp.com',
        messagingSenderId: '369713091350',
        measurementId: 'G-MYVFTYWZTY',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
