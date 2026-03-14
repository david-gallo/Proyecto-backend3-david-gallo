# 🐾 AdoptMe - Sistema de Adopción de Mascotas

API REST para gestionar un sistema de adopción de mascotas con Node.js, Express y MongoDB.

**Autor:** David Gallo
**Comisión:** 85625 Backend

## 🚀 Características

- API RESTful con CRUD completo
- Documentación Swagger interactiva
- Tests funcionales con Mocha y Chai
- Dockerización con Docker Compose
- Validación de datos y manejo de errores
- Rate limiting y CORS configurado

## 🛠️ Stack Tecnológico

Node.js | Express | MongoDB | Mongoose | Swagger | Docker | Mocha + Chai

## 📦 Instalación y Uso

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar MongoDB en .env (copiar de .env.example)
MONGO_URL=mongodb://localhost:27017/adoptme

# Iniciar servidor
npm start              # Producción
npm run dev            # Desarrollo con nodemon

# Ejecutar tests
npm test               # Todos los tests
npm run test:adoptions # Tests de adopciones
```

Servidor disponible en: `http://localhost:8080`  
Documentación Swagger: `http://localhost:8080/api-docs`

## 🐳 Docker

### Docker Hub

**🔗 Imagen:** [davidjgallop/adoptme-backend](https://hub.docker.com/r/davidjgallop/adoptme-backend)

### Comandos Docker

```bash
# Construir imagen
docker build -t adoptme-backend .

# Ejecutar con Docker Compose (incluye MongoDB)
docker-compose up -d

# Usar imagen de Docker Hub
docker pull davidjgallop/adoptme-backend:latest
docker run -d -p 8080:8080 davidjgallop/adoptme-backend:latest
```

📄 Ver [DOCKER_INSTRUCTIONS.md](DOCKER_INSTRUCTIONS.md) para guía detallada.

## 📚 API Endpoints

Documentación Swagger completa en: **http://localhost:8080/api-docs**

### Módulos

**Users** - Gestión de usuarios (CRUD completo, documentado con Swagger)  
**Pets** - Gestión de mascotas (CRUD + carga de imágenes)  
**Adoptions** - Sistema de adopciones (con tests completos)  
**Sessions** - Autenticación y registro  
**Mocks** - Generación de datos de prueba  

## 🧪 Testing

Tests funcionales para todos los endpoints del módulo de adopciones:

```bash
npm test               # Todos los tests
npm run test:adoptions # Solo adopciones
```

**Cobertura:** Casos de éxito, errores 404/400, validaciones e integración completa.

## 🏗️ Estructura

```
src/
├── app.js              # Configuración principal (Swagger, CORS, Rate Limit)
├── controllers/        # Lógica de controladores con try-catch
├── routes/             # Rutas con validaciones
├── middlewares/        # Validadores de datos
├── dao/models/         # Modelos Mongoose
├── services/           # Servicios de negocio
└── repository/         # Patrón Repository

test/
└── adoptions.test.js   # Tests funcionales completos

Dockerfile              # Imagen optimizada multi-stage
docker-compose.yml      # Orquestación con MongoDB
```

## ⚙️ Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```env
PORT=8080
MONGO_URL=mongodb://localhost:27017/adoptme
CORS_ORIGIN=*
```
```

## � Entrega Final - Comisión 85625

### ✅ Requisitos Completados

- [x] **Swagger Users** - Todos los endpoints documentados
- [x] **Tests Adoptions** - Casos de éxito y error cubiertos
- [x] **Dockerfile** - Imagen optimizada con multi-stage build
- [x] **README.md** - Documentación e instrucciones de Docker Hub

### 📌 Mejoras Implementadas

- Try-catch en todos los controladores
- Validación de datos con middlewares
- CORS y Rate Limiting configurados
- .gitignore y estructura profesional

---

**Desarrollado por:** David  
**Curso:** Backend - Comisión 85625  
**Repositorio de referencia:** [github.com/diegopolverelli/comision-85625-backend](https://github.com/diegopolverelli/comision-85625-backend)
