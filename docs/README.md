# Documentación del proyecto: Seguimiento Educacional

## 1. Descripción general

Este proyecto es una aplicación web estática para acompañar a estudiantes en la realización de cursos y clases en línea. Su propósito principal es permitir:

- registrar e iniciar sesión de usuarios,
- seleccionar cursos disponibles,
- visualizar contenido de clases embebidas desde Notion,
- marcar lecciones como completadas,
- guardar el progreso del usuario,
- mostrar avance por curso,
- y entregar un diploma de participación al completar el recorrido.

La app se centra en un modelo sencillo de aprendizaje guiado, pensado para educadores o equipos que quieren ofrecer material en formato de curso sin depender de un backend complejo.

---

## 2. Objetivo del proyecto

El objetivo del proyecto es crear una experiencia de aprendizaje clara, progresiva y motivadora, donde el estudiante:

1. accede a un curso desde una interfaz moderna,
2. recorre clases en orden,
3. confirma que completó cada contenido,
4. y mantiene un registro de su avance.

También busca facilitar la administración del progreso sin requerir una base de datos propia para cada curso, usando almacenamiento local y una capa mínima de autenticación con Supabase.

---

## 3. Problema que resuelve

Muchas plataformas educativas requieren una infraestructura completa para registrar avances, proteger contenido y mantener historial de usuarios. En este caso, el proyecto ofrece una solución ligera para cursos con pocos contenidos y un seguimiento básico del progreso.

Su diseño es útil cuando:

- se publican cursos internos o de capacitación,
- el contenido principal vive en Notion,
- se quiere evitar un backend pesado,
- y se necesita una solución simple y rápida de implementar.

---

## 4. Funcionalidades principales

### Autenticación

- Registro e inicio de sesión con email y contraseña.
- Uso de Supabase Auth para manejar sesiones.
- Persistencia de sesión del usuario en el navegador.
- Opción de cerrar sesión y reiniciar progreso.

### Selección de cursos

- Los cursos están definidos en un catálogo central.
- El usuario puede elegir entre varios cursos disponibles.
- Cada curso tiene nombre, nivel, cantidad de clases y URLs de contenido.

### Visualización de lecciones

- Las clases se renderizan dinámicamente en la interfaz.
- Cada una muestra un iframe con una página de Notion.
- La navegación permite avanzar entre lecciones y volver al selector del curso.

### Seguimiento de progreso

- Cada curso puede registrarse como completado en porcentaje.
- El progreso se guarda por usuario y por curso.
- El estado actual se usa para habilitar clases, actualizar barras de avance y activar logros.

### Certificación

- Cuando el curso se completa, la app genera un modal con un diploma simulado.
- El diploma incluye nombre del participante, curso, fecha y correo.
- Existe la opción de descargar el certificado.

---

## 5. Cómo funciona la aplicación

### 5.1 Inicio de la app

La aplicación se inicia desde el archivo principal:

- [index.html](../index.html)
- [javascript.js](../javascript.js)

El flujo es el siguiente:

1. El HTML define la estructura base: pantalla de autenticación, perfil, cursos y modal de diploma.
2. El archivo [javascript.js](../javascript.js) crea la aplicación principal llamando a `createApp()`.
3. La función `createApp()` inicializa el estado, renderiza cursos y lecciones, y conecta eventos de interacción.

### 5.2 Configuración de Supabase

La conexión con Supabase se crea desde [src/config.js](../src/config.js):

- toma la configuración desde `window.SUPABASE_CONFIG`,
- usa `window.supabase.createClient(url, anonKey)`,
- y devuelve un cliente listo para autenticación y almacenamiento.

La configuración se define en [index.html](../index.html) dentro del bloque:

```js
window.SUPABASE_CONFIG = {
  url: 'https://...supabase.co',
  anonKey: '...'
};
```

### 5.3 Autenticación

La capa de autenticación está en [src/services/authService.js](../src/services/authService.js):

- `signIn()` ejecuta el login con email y contraseña.
- `signUp()` registra un usuario nuevo.
- `signOut()` cierra la sesión.
- `getSession()` consulta la sesión actual.

La lógica de la pantalla de login y registro se maneja dentro de [src/app.js](../src/app.js), donde se alterna entre modo registro e inicio de sesión.

### 5.4 Cursos y contenido

Los cursos se definen en [src/courseData.js](../src/courseData.js):

- cada curso tiene un identificador, nombre, nivel, total de lecciones y una lista de clases,
- cada clase incluye el enlace a una página de Notion.

La función `availableCourses` exporta el catálogo para ser usado en la interfaz y la lógica de cálculo de progreso.

### 5.5 Progreso del usuario

La lógica de progreso se concentra en:

- [src/services/progressService.js](../src/services/progressService.js)
- [src/domain/courseLogic.js](../src/domain/courseLogic.js)
- [src/state.js](../src/state.js)

El flujo es:

1. al seleccionar un curso, la app obtiene el curso actual,
2. lee el progreso almacenado en `localStorage` para ese usuario y ese curso,
3. actualiza el estado de `completedLessons`,
4. recalcula el porcentaje total,
5. habilita o deshabilita lecciones según el progreso,
6. y guarda el nuevo estado al marcar una clase como completada.

La información se guarda en claves del tipo:

```text
aula-course-progress:<userId>:<courseId>
```

Esto permite tener un progreso diferenciado por usuario y por curso.

### 5.6 Certificado

Cuando el usuario completa todas las lecciones del curso, la app muestra el diploma en un modal. La lógica se encuentra en [src/app.js](../src/app.js). La función `populateCertificate()` completa los campos con:

- nombre completo,
- email,
- nombre del curso,
- fecha de emisión.

---

## 6. Estructura del proyecto

```text
.
├── docs/
│   └── README.md
├── src/
│   ├── app.js
│   ├── config.js
│   ├── courseData.js
│   ├── courses.js
│   ├── progress.js
│   ├── state.js
│   ├── ui.js
│   ├── domain/
│   │   └── courseLogic.js
│   ├── services/
│   │   ├── authService.js
│   │   └── progressService.js
│   └── ui/
│       ├── bindEvents.js
│       ├── renderContent.js
│       └── renderCourseList.js
├── styles/
│   └── ...
├── index.html
├── javascript.js
├── package.json
├── README.md
├── style.css
└── ...
```

### Descripción breve por carpeta

- `src/`: lógica principal de la aplicación.
- `src/services/`: servicios de autenticación y progreso.
- `src/domain/`: reglas de negocio del curso y cálculo de progreso.
- `src/ui/`: renderizado y eventos de la interfaz.
- `styles/`: estilos de la aplicación.
- `docs/`: documentación técnica y de producto.

---

## 7. Tecnologías usadas

- HTML5: estructura base de la aplicación.
- CSS: diseño y responsividad.
- JavaScript ES modules: lógica de la app.
- Supabase: autenticación y gestión de sesión.
- localStorage: guardado del progreso del usuario en navegador.
- Notion: contenido de clases embebidas mediante `iframe`.

---

## 8. Cómo ejecutar el proyecto

Como es una aplicación estática, no requiere compilación ni un framework de frontend. Puedes correrla de dos formas:

### Opción 1: abrir directamente

- abre `index.html` en el navegador.

### Opción 2: servirlo localmente

Desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

---

## 9. Configuración de Supabase

El proyecto usa Supabase para autenticación. En [README.md](../README.md) ya hay una guía de configuración inicial. Los pasos principales son:

1. crear un proyecto en Supabase,
2. habilitar autenticación por email,
3. crear la tabla `public.lesson_progress`,
4. definir políticas RLS para que cada usuario solo pueda leer/editar su propio progreso,
5. copiar la URL del proyecto y la clave pública `anon` en `window.SUPABASE_CONFIG`.

> Importante: la clave `anon` puede usarse en el frontend si RLS está habilitado correctamente. Nunca se debe exponer la `service_role`.

---

## 10. Seguridad y consideraciones

- El contenido de Notion se embebe en un iframe, por lo que la protección de ese contenido debe manejarse en Notion y no solo en la app.
- El acceso al progreso queda protegido por Supabase y reglas de acceso.
- Los datos de progreso del curso en navegador se guardan localmente y pueden variar si el usuario limpia almacenamiento.
- La app asume que la configuración de Supabase y la sesión del usuario son correctas antes de acceder al contenido privado.

---

## 11. Personalización

Es fácil adaptar el proyecto para otros contenidos:

- agregar cursos en [src/courseData.js](../src/courseData.js),
- cambiar textos y estructura de la UI en [index.html](../index.html),
- ajustar estilos en la carpeta [styles](../styles/),
- modificar flujos de progreso en [src/app.js](../src/app.js).

---

## 12. Resumen ejecutivo

Este proyecto es una solución ligera para cursos en línea con seguimiento de avance. Combina autenticación con Supabase, contenido embebido desde Notion, persistencia del progreso en navegador, y una lógica simple para completar cursos y generar certificados. Está pensado para equipos que necesitan una plataforma educativa funcional sin armar un sistema complejo de backend.
