import { FormGroup } from "@angular/forms";

/// Validador personalizado para campos requeridos
export const esRequerido = (field: 'email' | 'password', form: FormGroup) => {
  const control = form.get(field); // obtenemos el control del formulario
  return control && control.touched && control.hasError('required');
}

/// Validador para email
export const esEmailValido = (form: FormGroup) => {
  const control = form.get('email'); // obtenemos el control del formulario
  return control && control.touched && control.hasError('email');
}

/// Validador de contraseña
export const esContrasenaValida = (form: FormGroup) => {
  const control = form.get('password');
  if (!control) return false;

  const value = control.value || '';
  // mínimo 6 caracteres, al menos una mayúscula y una minúscula
  return !/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value);
}
