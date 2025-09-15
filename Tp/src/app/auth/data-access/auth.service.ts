import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  nombre: string;
  apellido: string;
  nick: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  currentUser$: Observable<FirebaseUser | null> = user(this._auth);

  async registrar(user: User) {
    // Paso 1: Crear en Auth
    const cred = await createUserWithEmailAndPassword(this._auth, user.email, user.password);

    // Paso 2: Guardar datos extras en Firestore
    await setDoc(doc(this._firestore, 'users', cred.user.uid), {
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      nick: user.nick,
      // ⚠️ NO guardes la contraseña en Firestore por seguridad
    });

    return cred;
  }

  logear(user: AuthUser) {
    return signInWithEmailAndPassword(this._auth, user.email, user.password);
  }

  logout() {
    return signOut(this._auth);
  }
}
