import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // 🔹 Importa HttpClientModule

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyDzPnhcqvGPrOPqgyAxmLPtZnt9MyuPsrU",
        authDomain: "tp-angular-hosting.firebaseapp.com",
        projectId: "tp-angular-hosting",
        storageBucket: "tp-angular-hosting.firebasestorage.app",
        messagingSenderId: "130154356667",
        appId: "1:130154356667:web:eeb7028fdba7368e00ee9e"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(ToastModule, BrowserAnimationsModule, HttpClientModule), // 🔹 Aca agregamos HttpClientModule
    MessageService
  ],
};
