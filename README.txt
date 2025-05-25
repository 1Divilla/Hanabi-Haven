# Hanabi-Haven
## Hanabi-Haven es una aplicación web full-stack desarrollada con tecnologías modernas. El proyecto está construido utilizando Strapi como backend y Qwik como framework frontend, ofreciendo una experiencia de usuario rápida y eficiente con una arquitectura robusta.
## Descripción
## Hanabi-Haven es una plataforma web que proporciona una experiencia de usuario optimizada con un backend potente y un frontend reactivo. La aplicación combina la flexibilidad de Strapi como CMS headless con la velocidad y eficiencia de Qwik para crear una solución web moderna.
## Características
- Backend : Strapi (CMS Headless)
- Frontend : Qwik Framework
- Base de datos : SQLite (desarrollo)
- Estilo : Componentes modulares y diseño responsive
- API : RESTful con gestión de permisos integrada
## Estructura del Proyecto
El repositorio está organizado de la siguiente manera:

/Backend :

- Implementación de Strapi con API personalizada
- Sistema de gestión de contenidos
- Configuración de permisos y roles
- Modelos de datos y relaciones
/Frontend :

- Aplicación Qwik con componentes reutilizables
- Rutas y layouts para la navegación
- Integración con la API de Strapi
- Estilos y recursos multimedia
.gitattributes :

- Configuración de atributos para Git
README.txt :

- Este archivo de documentación
## Requisitos del Sistema
Para ejecutar el proyecto, necesitas tener instalado:

- Node.js (versión recomendada: >=18.17.0)
- npm o yarn
- Git
## Cómo Ejecutar el Proyecto
### Clona este repositorio en tu máquina local:
```
git clone https://github.com/1Divilla/Hanabi-Haven.git
cd Hanabi-Haven
```
### Configuración del Backend (Strapi):
```
cd Backend
npm install
npm run develop
```
El panel de administración de Strapi estará disponible en: http://localhost:1337/admin

### Configuración del Frontend (Qwik):
```
cd Frontend
npm install
npm start
```
La aplicación frontend estará disponible en: http://localhost:3000

## Desarrollo
### Backend (Strapi)
```
cd Backend
npm run develop  # Modo desarrollo con recarga automática
```
### Frontend (Qwik)
```
cd Frontend
npm run dev  # Modo desarrollo con SSR
```
## Despliegue
### Backend
```
cd Backend
npm run build
npm run start
```
### Frontend
```
cd Frontend
npm run build
# Sigue las instrucciones para desplegar en tu plataforma preferida
```
## Licencia
Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo LICENSE para más información.

## Contacto
Para consultas, sugerencias o contribuciones, puedes contactar al autor a través de GitHub.