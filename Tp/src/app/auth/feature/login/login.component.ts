import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { esEmailValido, esRequerido } from '../utils/validators';
import { AuthService } from '../../data-access/auth.service';


interface FormLogin
{
  email : FormControl<string | null>;
  contraseña : FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  
  private _formBuilder = inject(FormBuilder);

  //inyeccion del servicio
  private _authService = inject(AuthService);
  

  esEmailValido()
  {
    return esEmailValido(this.form);
  }

  esRequerido(field: 'contraseña' | 'email')
  {
    return esRequerido(field, this.form);
  }

  form = this._formBuilder.group<FormLogin>({
    email: this._formBuilder.control('', [
      Validators.required, Validators.email
    ]),
    contraseña:  this._formBuilder.control('', Validators.required),
  });

  async submit()
  {
    if (this.form.valid) return;
    try{
    const email = this.form.value.email;
    const contraseña = this.form.value.contraseña;

    if (!email || !contraseña ) return;
    
    console.log({ email, contraseña });
    
      await this._authService.singUp({ email: email!, password: contraseña! });
    } 
    catch(error){
      console.log(error);
    }
  
  }
    
}
