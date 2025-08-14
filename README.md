# Aplicación de chat en tiempo real utilizando WebSockets

**Autores:** Nicol Diaz y Juan Yasig  

## RESUMEN

En este laboratorio se desarrolló una aplicación de notificaciones en tiempo real utilizando la librería Socket.io, integrada sobre un servidor Express en Node.js y un cliente en React. El propósito fue comprender el funcionamiento de la comunicación bidireccional y de baja latencia mediante WebSockets, permitiendo que las acciones realizadas por un usuario (estudiante) se reflejen instantáneamente en la interfaz de otro (docente). El procedimiento incluyó la configuración del servidor, la conexión del cliente, la emisión de eventos, el manejo de retransmisiones y la actualización en tiempo real de la interfaz. Se logró una implementación funcional en la que el registro de un equipo por un estudiante genera automáticamente una notificación visual en el dashboard del docente, sin necesidad de recargar la página. Este trabajo refuerza la importancia de los sistemas reactivos y distribuidos en entornos de monitoreo, comunicación y colaboración en tiempo real.

**Palabras Claves:** WebSockets, Socket.io, Notificaciones en Tiempo Real.

---

## 1. INTRODUCCIÓN
En el desarrollo de aplicaciones modernas, la capacidad de intercambiar información instantáneamente entre cliente y servidor es fundamental. Las tecnologías de comunicación en tiempo real permiten que múltiples usuarios interactúen de forma dinámica sin depender de actualizaciones manuales. En esta práctica se trabajó con Socket.io para implementar un sistema de notificaciones en un entorno cliente-servidor, con el objetivo de reforzar el manejo disciplinado de herramientas y procedimientos en laboratorio, desde la configuración del servidor hasta la interacción de eventos en el frontend.

---

## 2. OBJETIVO(S)
**2.1.** Implementar un sistema de notificaciones en tiempo real utilizando Socket.io, integrando cliente y servidor para permitir la comunicación bidireccional instantánea.  
**2.2.** Comprender los principios básicos de comunicación en tiempo real con WebSockets.  
**2.3.** Configurar un servidor Express con Socket.io en Node.js.  

---

## 3. MARCO TEÓRICO
La comunicación en tiempo real es un modelo de intercambio de datos en el que la información enviada desde un emisor llega al receptor de manera inmediata, sin necesidad de que este último solicite la actualización manualmente. Este tipo de comunicación es esencial en aplicaciones modernas como chats, sistemas de monitoreo, videojuegos multijugador y notificaciones instantáneas (MDN Web Docs, 2024).

El protocolo WebSocket (RFC 6455) proporciona un canal de comunicación bidireccional y persistente entre cliente y servidor, reduciendo la latencia y la sobrecarga generada por las solicitudes HTTP tradicionales. A diferencia del modelo cliente-servidor basado en polling, WebSocket mantiene una conexión abierta en la que ambas partes pueden enviar y recibir datos en cualquier momento (Fette & Melnikov, 2011).

Socket.io es una biblioteca de JavaScript que facilita el uso de WebSockets y agrega características adicionales, como reconexión automática, soporte para navegadores antiguos y envío de eventos personalizados. Funciona mediante un servidor en Node.js y un cliente que puede integrarse en aplicaciones web desarrolladas con diferentes frameworks. La arquitectura de Socket.io se basa en el manejo de eventos, donde un cliente puede emitir eventos que el servidor escucha y, a su vez, este puede retransmitir dichos eventos a otros clientes conectados (Socket.io, 2024).

En el contexto de esta práctica, Socket.io se utilizó para implementar un sistema de notificaciones en tiempo real. Este sistema permite que la acción de registrar un equipo en la interfaz de un estudiante sea transmitida automáticamente al dashboard de un docente, demostrando el principio de broadcasting de eventos: enviar un mensaje a todos los clientes conectados, excepto a quien lo originó.

---

## 4. DESCRIPCIÓN DEL PROCEDIMIENTO
**1. Configuración del Servidor Backend**  
- Se accedió a la carpeta correspondiente al servidor en el proyecto.  
- Se instalaron las dependencias necesarias ejecutando:  
  ```bash
  npm install express socket.io
  ```  
- Se creó un archivo principal (`server.js`) para inicializar el servidor Express y configurar Socket.io con soporte para CORS, permitiendo la conexión desde el frontend.  
- Se definió el evento `connection` para detectar cuando un cliente se conecta y `disconnect` para registrar la salida de un usuario.  

**2. Integración del Cliente Frontend**  
- Desde la carpeta del cliente en React, se instaló la librería cliente de Socket.io:  
  ```bash
  npm install socket.io-client
  ```  
- Se estableció la conexión al servidor desde el archivo principal del frontend (`App.jsx`) utilizando la función `io('http://localhost:3000')`.  
- Se implementó un `useEffect` para escuchar el evento `connect` y confirmar la conexión con el servidor.  

**3. Emisión del Evento desde el Cliente (Estudiante)**  
- En la función que maneja el registro de un equipo, se emitió un evento `equipo:registrado` enviando un objeto con el nombre del estudiante y el equipo asignado.  
- Ejemplo:  
  ```javascript
  socket.emit('equipo:registrado', { nombreEstudiante: "Juan Pérez", equipo: "PC-05" });
  ```  

**4. Manejo y Retransmisión del Evento en el Servidor**  
- Se configuró el servidor para escuchar el evento `equipo:registrado`.  
- Al recibirlo, se retransmitió a los demás clientes conectados utilizando:  
  ```javascript
  socket.broadcast.emit('notificacion:equipoOcupado', data);
  ```  

**5. Recepción y Visualización de la Notificación (Docente)**  
- En el dashboard del docente se implementó un `useEffect` para escuchar el evento `notificacion:equipoOcupado`.  
- Se actualizó un estado local (`setNotificacion`) para mostrar el mensaje en pantalla y se configuró un temporizador para ocultarlo después de 5 segundos.  

**Resultado Final:**  
- Al registrar un equipo desde la interfaz de un estudiante, el dashboard del docente muestra inmediatamente una notificación visual indicando qué equipo fue ocupado y por quién, sin necesidad de recargar la página.  

---

## 5. Imagenes

- Front de login para seleccion de los roles
![Logeo principal (docente)](/imagenes/frontSeleccionDocentes.png)

- Dashboard del docente
![Dashboard del docente](/imagenes/dashboardDocente.png)

- Dashboard del estudiante
![Dashboard del estudiante](/imagenes/dashboardEstudiante.png)

- Registro del equipo desde el Estudiante
![Registro del equipo desde el Estudiante](/imagenes/registroEquipoEstudiante.png)

- Verificacion por parte del docente al seleccionar una pc el estudiante
![Verificacion seleccion de maquina](/imagenes/verificacionFinalOcupacionDocente.png)

- Liberacion de PC del estudiante desde el docente
![Liberacion de PC](/imagenes/liberarPcDelEstudianteDocente.png)

---

## 6. ANÁLISIS DE RESULTADOS
Se comprobó que:  
- La conexión cliente-servidor se mantiene activa durante toda la sesión.  
- Las acciones del estudiante generan eventos que son captados y procesados por el servidor.  
- El broadcasting de eventos funciona correctamente, enviando notificaciones solo a usuarios distintos del emisor.  
- El dashboard del docente refleja inmediatamente la información sin recargar la página.  
- Las consolas muestran mensajes de conexión, desconexión y transmisión de eventos, confirmando el flujo correcto de datos.  

---

## 7. DISCUSIÓN
La práctica evidenció que Socket.io simplifica la comunicación en tiempo real al abstraer detalles complejos de WebSockets, como la compatibilidad entre navegadores y reconexiones automáticas. Los resultados obtenidos coinciden con la teoría, demostrando que un evento emitido por un cliente puede ser retransmitido a otros en milisegundos. Sin embargo, se identificó que en un entorno de producción sería necesario implementar autenticación y control de roles para evitar el envío de notificaciones no autorizadas.

---

## 8. CONCLUSIONES
- Socket.io permite implementar comunicación bidireccional y en tiempo real de forma sencilla.  
- La retransmisión de eventos facilita la sincronización de estados entre múltiples clientes.  
- La arquitectura cliente-servidor con eventos ofrece escalabilidad para aplicaciones más complejas.  
- El laboratorio logró el objetivo planteado: mostrar notificaciones instantáneas en el dashboard del docente tras una acción en la interfaz del estudiante.  

---

## 9. BIBLIOGRAFÍA
- Socket.io. (2024). *Documentation*. Recuperado de: https://socket.io/docs/v4/  
- Mozilla Developer Network. (2024). *Using WebSockets*. Recuperado de: https://developer.mozilla.org/es/docs/Web/API/WebSockets_API  
- Node.js Foundation. (2024). *Node.js Documentation*. Recuperado de: https://nodejs.org/en/docs  
- Fette, I., & Melnikov, A. (2011). *The WebSocket Protocol (RFC 6455)*. Internet Engineering Task Force (IETF). Recuperado de: https://datatracker.ietf.org/doc/html/rfc6455  
