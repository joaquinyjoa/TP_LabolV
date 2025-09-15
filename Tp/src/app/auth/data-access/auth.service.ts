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
import { Observable, of, switchMap } from 'rxjs';

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

  // Observable solo con Firebase Auth
  currentUser$: Observable<FirebaseUser | null> = user(this._auth);

  // Nuevo observable que incluye los datos de Firestore (FullUser)
  currentUserFull$: Observable<FullUser | null> = this.currentUser$.pipe(
    switchMap(u => {
      if (!u) return of(null);
      const userDoc = doc(this._firestore, `users/${u.uid}`);
      return docData(userDoc) as Observable<FullUser>;
    })
  );

  async registrar(user: User) {
    const cred = await createUserWithEmailAndPassword(this._auth, user.email, user.password);
    await setDoc(doc(this._firestore, 'users', cred.user.uid), {
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      nick: user.nick
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
