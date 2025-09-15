import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user, 
  User as FirebaseUser 
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface User {
  email: string;
  password: string;
} 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth);

  // observable del usuario actual (null si no hay nadie logueado)
  currentUser$: Observable<FirebaseUser | null> = user(this._auth);

  registrar(User: User) {
    return createUserWithEmailAndPassword(this._auth, User.email, User.password);
  }

  logear(User: User) {
    return signInWithEmailAndPassword(this._auth, User.email, User.password);
  }

  logout() {
    return signOut(this._auth);
  }
}
