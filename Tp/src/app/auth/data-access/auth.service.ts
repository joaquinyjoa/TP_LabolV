//uso de firebase authentication
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

export interface User{
  email: string;
  password: string;
} 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth);

  registrar(User: User){
    /// Nos devuelve una promesa 
    return createUserWithEmailAndPassword(this._auth, User.email, User.password);
  }

  logear(User: User){
    /// Nos devuelve una promesa 
    return signInWithEmailAndPassword(this._auth, User.email, User.password);
  }

  constructor() { }
}
