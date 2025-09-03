import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  public usuarioActual : string;
  
  constructor() 
  {
    this.usuarioActual = "Nadie";
   }

  logear(user:string, clave:string)
  {
    if (user == 'admin' && clave == 'admin') {
      this.usuarioActual = user.toString();
    }    
    return true
  }

  private obtenerUsuarioActual():String
  {
    return this.usuarioActual
  }
}
