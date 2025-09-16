import { FormGroup } from "@angular/forms";

/// Validador personalizado para campos requeridos
export const esRequerido = (field: 'email' | 'contraseña', form  : FormGroup) => {
  const constrol = form.get(field);//obtenemos el control del formulario

  //hace que los controles tengan required
    return constrol && constrol.touched && constrol.hasError('required');
}

export const esEmailValido = (form  : FormGroup) => {
    const control = form.get('email');//obtenemos el control del formulario
    return control && control.touched && control.hasError('email');
}