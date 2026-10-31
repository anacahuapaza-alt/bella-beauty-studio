# Bella Beauty Studio — Sistema de citas

Aplicación web para reservas y administración de un salón de belleza, construida con React, Vite y Firebase Firestore.

## Funciones de esta versión
- Panel administrativo con resumen de reservas, pendientes y confirmadas.
- Catálogo de seis servicios con duración y precios de demostración en soles.
- Selección de especialista.
- Formulario de reserva con datos de cliente, servicio, especialista, fecha, hora y notas.
- Listado de citas con búsqueda y cambio de estado.
- Cinco reservas ficticias para probar el panel.
- Diseño adaptable a móviles y escritorio.
- Modo demostración local si Firebase aún no está configurado.

## Ejecutar
Requiere Node.js 20 o superior.
```bash
npm install
npm run dev
```

## Conectar el proyecto Firebase existente
1. Abre Firebase Console y selecciona tu proyecto existente.
2. En Configuración del proyecto > Tus aplicaciones, registra o selecciona una aplicación web.
3. Copia los valores de configuración al archivo `.env.local` (usa `.env.example` como plantilla).
4. Activa Cloud Firestore y crea la base de datos.
5. No publiques las reglas de demostración en un sistema real. Configura Firebase Authentication y reglas por rol antes de habilitar los datos de clientes.

## Publicar en Firebase Hosting
Instala Firebase CLI y autentícate:
```bash
npm install -g firebase-tools
firebase login
```
Crea `.firebaserc` con el ID de tu proyecto Firebase, luego:
```bash
npm run build
firebase deploy --only hosting
```

## Datos ficticios
Los nombres, teléfonos, correos y reservas incluidos son datos inventados para pruebas. Los precios también son referenciales y deben ajustarse a los precios reales del salón.

## Pendientes de seguridad antes de producción
Esta entrega es una base funcional para pruebas. Antes de recibir reservas reales:
- Implementar inicio de sesión de administrador con Firebase Authentication.
- Restringir lectura y modificación de citas a personal autorizado.
- Validar reservas y evitar doble reserva de forma atómica en backend (transacción o Cloud Function).
- Definir la política de privacidad y consentimiento para datos personales.
- Revisar zona horaria, horarios de atención, descansos y duración real de cada servicio.