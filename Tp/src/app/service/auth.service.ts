import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';

export interface User {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  nick: string;
}

export interface AuthUser {
  email: string;
  password: string;
}

export interface FullUser extends AuthUser {
  email: string;
  nick: string;
  nombre: string;
  apellido: string;
  fechaRegistro: any;
  pais: string;
  paisFlag: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  currentUser$: Observable<FirebaseUser | null> = user(this._auth);

  currentUserFull$: Observable<FullUser | null> = this.currentUser$.pipe(
    switchMap(u => {
      if (!u) return of(null);
      const userDoc = doc(this._firestore, `usuarios/${u.uid}`);
      return docData(userDoc) as Observable<FullUser>;
    })
  );

  async registrar(user: User, pais: string, paisFlag: string) {
    const cred = await createUserWithEmailAndPassword(this._auth, user.email, user.password);

    // ✅ Guardamos fecha de registro
    const fechaRegistro = new Date();

    await setDoc(doc(this._firestore, 'usuarios', cred.user.uid), {
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      nick: user.nick,
      fechaRegistro,
      pais,
      paisFlag,
      // Campos de puntajes inicializados vacíos
      puntosAhorcado: 0,
      puntosPreguntados: 0,
      puntosMayorMenor: 0,
      puntosJuegoPropio: 0
    });

    return cred;
  }

  estaLogueado$(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  logear(user: AuthUser) {
    return signInWithEmailAndPassword(this._auth, user.email, user.password);
  }

  logout() {
    return signOut(this._auth);
  }
}
