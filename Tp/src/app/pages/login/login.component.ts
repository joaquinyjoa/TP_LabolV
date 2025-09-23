import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { esEmailValido, esRequerido } from '../utils/validators';
import { AuthService } from '../../service/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface FormLogin {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
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
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private _messageService = inject(MessageService);
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  loading = false;

  form = this._formBuilder.group<FormLogin>({
    email: this._formBuilder.control('', [Validators.required, Validators.email]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).+$/)
    ]),
  });

  // 🔹 Usuarios de acceso rápido (solo para llenar campos)
  usuariosRapidos = [
    { email: 'test1@email.com', password: '123456Aa', label: 'Usuario Test 1' },
    { email: 'test2@email.com', password: '123456Ab', label: 'Usuario Test 2' }
  ];

  ngOnInit() { }

  esEmailValido() {
    return esEmailValido(this.form);
  }

  esRequerido(field: 'password' | 'email') {
    return esRequerido(field, this.form);
  }

  irRegistro(event: Event) {
    event.preventDefault();
    this.loading = true;
    setTimeout(() => {
      this._router.navigate(['/registro']).finally(() => this.loading = false);
    }, 500);
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

    const email = this.form.value.email!;
    const password = this.form.value.password!;

    this.loading = true;
    try {
      await this._authService.logear({ email, password });

      this._messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Bienvenido ✅'
      });

      this._router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error completo:', error);

      let mensaje = 'El usuario o la contraseña son incorrectos';
      const codigo = error?.code || error?.message?.match(/\(auth\/[^\)]+\)/)?.[0].replace(/[()]/g, '');

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

  loginRapido(usuario: { email: string; password: string }) {
    this.form.setValue({
      email: usuario.email,
      password: usuario.password
    });
  }
}
