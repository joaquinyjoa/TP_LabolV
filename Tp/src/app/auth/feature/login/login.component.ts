import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { esEmailValido, esRequerido } from '../utils/validators';
import { AuthService } from '../../data-access/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
export class LoginComponent implements OnInit {
  private _messageService = inject(MessageService);
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  loading = false;

  form = this._formBuilder.group<FormLogin>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    contraseña: this._formBuilder.control('', Validators.required),
  });

  // 🔹 Usuarios de acceso rápido (solo para llenar campos)
  usuariosRapidos = [
    { email: 'test1@email.com', password: '123456Aa', label: 'Usuario Test 1' },
    { email: 'test2@email.com', password: '123456Ab', label: 'Usuario Test 2' }
  ];

  ngOnInit() {
    // Cargar último usuario guardado
    const ultimo = localStorage.getItem('ultimoUsuario');
    if (ultimo) {
      const { email, password } = JSON.parse(ultimo);
      this.form.setValue({ email, contraseña: password });
    }
  }

  esEmailValido() {
    return esEmailValido(this.form);
  }

  esRequerido(field: 'contraseña' | 'email') {
    return esRequerido(field, this.form);
  }

  irRegistro(event: Event) {
    event.preventDefault();
    this.loading = true;

    setTimeout(() => {
      this._router.navigate(['/registro']).finally(() => {
        this.loading = false;
      });
    }, 2000);
  }

  // 🔹 Login normal
  async submit() {
    if (!this.form.valid) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos correctamente'
      });
      return;
    }

    this.loading = true;

    try {
      const email = this.form.value.email!;
      const contraseña = this.form.value.contraseña!;

      await this._authService.logear({ email, password: contraseña });

      // Guardar en localStorage
      localStorage.setItem('ultimoUsuario', JSON.stringify({ email, password: contraseña }));

      this._messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Bienvenido ✅'
      });

      this._router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error completo:', error);

      let mensaje = 'Ocurrió un error inesperado';
      let codigo = error.code || '';

      if (!codigo && error.message) {
        const match = error.message.match(/\(auth\/[^\)]+\)/);
        if (match) {
          codigo = match[0].replace(/[()]/g, '');
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
    } finally {
      this.loading = false;
    }
  }

  // 🔹 Login rápido: solo llena los campos
  loginRapido(usuario: { email: string; password: string }) {
    this.form.setValue({
      email: usuario.email,
      contraseña: usuario.password
    });
  }
}
