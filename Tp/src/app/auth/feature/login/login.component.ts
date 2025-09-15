import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { esEmailValido, esRequerido } from '../utils/validators';
import { AuthService } from '../../data-access/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

interface FormLogin {
  email: FormControl<string | null>;
  contraseña: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
    MatProgressSpinnerModule
  ],

  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  private _messageService = inject(MessageService);
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  loading = false; // variable para el loader

  form = this._formBuilder.group<FormLogin>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email
    ]),
    contraseña: this._formBuilder.control('', Validators.required),
  });

  esEmailValido() {
    return esEmailValido(this.form);
  }

  esRequerido(field: 'contraseña' | 'email') {
    return esRequerido(field, this.form);
  }

  irRegistro(event: Event) {
    event.preventDefault(); // evita recarga
    this.loading = true;

    // Mostrar spinner durante 3 segundos antes de navegar
    setTimeout(() => {
      this._router.navigate(['/registro']).finally(() => {
        this.loading = false; // desactiva el spinner después de la navegación
      });
    }, 3000); 
  }


  async submit() {
    if (!this.form.valid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos correctamente'
      });
      return;
    }

    this.loading = true; // activa spinner

    try {
      const email = this.form.value.email!;
      const contraseña = this.form.value.contraseña!;

      await this._authService.logear({ email, password: contraseña });

      this._messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Bienvenido ✅'
      });

      this._router.navigate(['/home']);
    } 
    catch (error: any) {
      console.error('Error completo:', error);

      let mensaje = 'Ocurrió un error inesperado';
      let codigo = error.code || '';

      // Si no hay code, extraemos auth/... del mensaje
      if (!codigo && error.message) {
        const match = error.message.match(/\(auth\/[^\)]+\)/);
        if (match) {
          codigo = match[0].replace(/[()]/g, ''); // ej: auth/invalid-credential
        }
      }

      switch (codigo) {
        case 'auth/user-not-found':
          mensaje = 'El usuario no existe';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          mensaje = 'Correo no válido';
          break;
        case 'auth/invalid-credential':
          mensaje = 'Credenciales inválidas';
          break;
      }

      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: mensaje
      });
    }finally {
      this.loading = false; // desactiva spinner
    }

  }
}
