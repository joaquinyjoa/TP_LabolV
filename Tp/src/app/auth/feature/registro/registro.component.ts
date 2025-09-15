import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Firestore, collection, getDocs, query, where, addDoc } from '@angular/fire/firestore';
import * as bcrypt from 'bcryptjs';

interface FormRegistro {
  nombre: FormControl<string | null>;
  apellido: FormControl<string | null>;
  email: FormControl<string | null>;
  contrasena: FormControl<string | null>;
  repetirContrasena: FormControl<string | null>;
  nick: FormControl<string | null>;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);
  private _firestore = inject(Firestore);

  loading = false;

  form = this._fb.group<FormRegistro>({
    nombre: this._fb.control('', Validators.required),
    apellido: this._fb.control('', Validators.required),
    email: this._fb.control('', [Validators.required, Validators.email]),
    contrasena: this._fb.control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(10),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
    ]),
    repetirContrasena: this._fb.control('', Validators.required),
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

    const { email, contrasena, repetirContrasena, nick, nombre, apellido } = this.form.value;

    if (contrasena !== repetirContrasena) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña repetida no coincide'
      });
      return;
    }

    this.loading = true;

    try {
      const usuariosRef = collection(this._firestore, 'usuarios');
      const mensajes: string[] = [];

      // Verificar email duplicado
      const qEmail = query(usuariosRef, where('email', '==', email));
      const emailSnapshot = await getDocs(qEmail);
      if (!emailSnapshot.empty) mensajes.push('El email ya está registrado');

      // Verificar nick duplicado
      const qNick = query(usuariosRef, where('nick', '==', nick));
      const nickSnapshot = await getDocs(qNick);
      if (!nickSnapshot.empty) mensajes.push('El nick ya está en uso');

      // Verificar contraseña duplicada usando bcrypt
      const allUsuarios = await getDocs(usuariosRef);
      for (const doc of allUsuarios.docs) {
        const data: any = doc.data();
        const hash = data.passwordHash;
        if (hash && bcrypt.compareSync(contrasena!, hash)) {
          mensajes.push('La contraseña ya está en uso por otro usuario');
          break;
        }
      }

      if (mensajes.length > 0) {
        mensajes.forEach(msg => this._messageService.add({ severity: 'error', summary: 'Error', detail: msg }));
        return;
      }

      // Generar hash de la contraseña
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(contrasena!, salt);

      // Registrar usuario usando AuthService
      await this._authService.registrar({
        email: email!,
        password: contrasena!, // Firebase Auth usa la contraseña real para login
        nombre: nombre!,
        apellido: apellido!,
        nick: nick!
      });

      // Guardar hash en Firestore
      await addDoc(usuariosRef, { email, nick, passwordHash, nombre, apellido });

      // ✅ Mostrar toast de éxito antes de redirigir
      this._messageService.add({ 
        severity: 'success', 
        summary: 'Registro exitoso', 
        detail: `El usuario ${nick} se registró correctamente ✅` 
      });
      setTimeout(() => this._router.navigate(['/home']), 1500);

    } catch (error: any) {
      console.error('Firebase error:', error.code, error.message);
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el usuario' });
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
    }, 1500);
  }
}
