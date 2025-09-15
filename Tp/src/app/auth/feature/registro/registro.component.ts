import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface FormRegistro {
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  email: FormControl<string | null>;
  contrasena: FormControl<string | null>;
  nick: FormControl<string | null>;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);

  loading = false;

  form = this._fb.group<FormRegistro>({
    nombre: this._fb.control('', Validators.required),
    apellido: this._fb.control('', Validators.required),
    email: this._fb.control('', [Validators.required, Validators.email]),
    contrasena: this._fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]),
    nick: this._fb.control('', Validators.required)
  });

  esEmailValido() {
    const email = this.form.value.email;
    return email && (!email.includes('@') || !email.endsWith('.com'));
  }

  esContrasenaValida() {
    const c = this.form.value.contrasena || '';
    return !/^(?=.*[A-Z])(?=.*\d).{6,10}$/.test(c);
  }

  esRequerido(field: keyof FormRegistro) {
    return this.form.get(field)?.hasError('required') && this.form.get(field)?.touched;
  }

  async submit() {
    if (!this.form.valid || this.esEmailValido() || this.esContrasenaValida()) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos correctamente'
      });
      return;
    }

    this.loading = true;

    try {
      const { email, contrasena } = this.form.value;
      await this._authService.registrar({ email: email!, password: contrasena! });

      this._messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: 'Usuario creado correctamente ✅'
      });

      setTimeout(() => this._router.navigate(['/login']), 1000);
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar el usuario'
      });
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  irLogin(event: Event) {
    event.preventDefault();
    this.loading = true;
    setTimeout(() => {
      this._router.navigate(['/']);
      this.loading = false;
    }, 3000);
  }
}
