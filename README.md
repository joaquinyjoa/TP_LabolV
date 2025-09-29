🖥️ TP_LabolV

TP_LabolV es una aplicación web desplegada en Firebase que combina sistema de login/registro, información de usuario, chat en tiempo real y juegos interactivos.

🌐 Accede a la aplicación: https://tp-angular-hosting.web.app/

🔑 Acceso

Al ingresar a la página se muestra un login con:

Email y contraseña

Accesos rápidos mediante botones para ingresar sin necesidad de registro.

También se puede registrar un nuevo usuario con:

Nombre y apellido

Nick

Contraseña (y repetir contraseña)

Selección de país

Una vez registrados o logueados, el usuario es redirigido automáticamente al Home.

🏠 Home

El Home incluye tres secciones principales:

Quién Soy

Obtiene información desde la API de GitHub: nombre, repositorios, perfil, etc.

Chat

Conversa en tiempo real con otros usuarios.

Listado

Sección en proceso de desarrollo.

🎮 Juegos

Dentro de la sección de juegos se encuentran cuatro opciones:

Mi juego – En desarrollo.

Preguntados – Consume una API de imágenes para generar preguntas interactivas.

Ahorcado – Utiliza un diccionario para generar palabras.

Mayor y Menor – Juego de cartas donde el usuario adivina si la siguiente carta es mayor o menor.

🛠️ Tecnologías utilizadas

Angular

Firebase Hosting & Firestore

Angular Material (spinners y componentes)

APIs externas: GitHub, diccionarios y APIs de imágenes

CSS/SCSS para estilos, animaciones y contenedores modernos

🚀 Uso

Clonar el repositorio:

git clone <repositorio_url>


Instalar dependencias:

npm install


Ejecutar localmente:

ng serve


Abrir en el navegador: http://localhost:4200

Ya está desplegada en Firebase Hosting: https://tp-angular-hosting.web.app/