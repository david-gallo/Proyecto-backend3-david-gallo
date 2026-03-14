# 🐳 Instrucciones para Dockerizar y Subir a Docker Hub

Este documento contiene los pasos exactos para construir, probar y subir la imagen Docker a Docker Hub.

## 📋 Prerrequisitos

- Docker Desktop instalado y funcionando
- Cuenta en Docker Hub (https://hub.docker.com/)
- Terminal/PowerShell abierta

## 🔧 Paso 1: Construir la Imagen Docker

Desde el directorio raíz del proyecto, ejecuta:

```powershell
docker build -t adoptme-backend .
```

Verifica que la imagen se creó correctamente:

```powershell
docker images | Select-String "adoptme-backend"
```

## 🧪 Paso 2: Probar la Imagen Localmente

### Opción A: Solo la aplicación (necesitas MongoDB externo)

```powershell
docker run -d -p 8080:8080 --name adoptme-test adoptme-backend
```

### Opción B: Con Docker Compose (Aplicación + MongoDB)

```powershell
docker-compose up -d
```

Esto iniciará:
- MongoDB en el puerto 27017
- La aplicación en el puerto 8080

### Verificar que funciona

1. Abre tu navegador en: http://localhost:8080/api-docs
2. Deberías ver la documentación de Swagger
3. Prueba el endpoint: http://localhost:8080/api/users

### Detener el contenedor de prueba

```powershell
# Si usaste la Opción A:
docker stop adoptme-test
docker rm adoptme-test

# Si usaste la Opción B:
docker-compose down
```

## 🚀 Paso 3: Subir a Docker Hub

### 3.1. Iniciar sesión en Docker Hub

```powershell
docker login
```

Te pedirá tu usuario y contraseña de Docker Hub.

### 3.2. Etiquetar la imagen

Reemplaza `TU-USUARIO` con tu nombre de usuario de Docker Hub:

```powershell
docker tag adoptme-backend TU-USUARIO/adoptme-backend:latest
docker tag adoptme-backend TU-USUARIO/adoptme-backend:v1.0.0
```

Ejemplo si tu usuario es "juanperez":
```powershell
docker tag adoptme-backend juanperez/adoptme-backend:latest
docker tag adoptme-backend juanperez/adoptme-backend:v1.0.0
```

### 3.3. Subir la imagen

```powershell
docker push TU-USUARIO/adoptme-backend:latest
docker push TU-USUARIO/adoptme-backend:v1.0.0
```

Esto puede tomar algunos minutos dependiendo de tu conexión a internet.

### 3.4. Verificar en Docker Hub

1. Ve a https://hub.docker.com/
2. Inicia sesión con tu cuenta
3. Deberías ver tu imagen `adoptme-backend` en tus repositorios
4. Copia el comando de pull que Docker Hub te muestra

## 📝 Paso 4: Actualizar el README

Una vez que subas la imagen, actualiza el README.md:

1. Abre el archivo `README.md`
2. Busca todas las instancias de `TU-USUARIO`
3. Reemplázalas con tu nombre de usuario real de Docker Hub
4. Guarda los cambios

Ejemplo:
```markdown
# Antes:
**🔗 [TU-USUARIO/adoptme-backend](https://hub.docker.com/r/TU-USUARIO/adoptme-backend)**

# Después:
**🔗 [juanperez/adoptme-backend](https://hub.docker.com/r/juanperez/adoptme-backend)**
```

## ✅ Paso 5: Verificación Final

Prueba descargar y ejecutar tu imagen desde Docker Hub:

```powershell
# Eliminar la imagen local
docker rmi TU-USUARIO/adoptme-backend:latest

# Descargar desde Docker Hub
docker pull TU-USUARIO/adoptme-backend:latest

# Ejecutar
docker run -d -p 8080:8080 TU-USUARIO/adoptme-backend:latest
```

## 📊 Comandos Útiles de Docker

```powershell
# Ver todas las imágenes
docker images

# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores
docker ps -a

# Ver logs de un contenedor
docker logs adoptme-app

# Ver logs en tiempo real
docker logs -f adoptme-app

# Entrar a un contenedor en ejecución
docker exec -it adoptme-app /bin/sh

# Eliminar una imagen
docker rmi nombre-imagen

# Eliminar un contenedor
docker rm nombre-contenedor

# Eliminar todo (¡CUIDADO!)
docker system prune -a
```

## 🎯 Resumen de lo que debes entregar

1. ✅ Código con documentación Swagger del módulo Users
2. ✅ Tests funcionales del router de adopciones
3. ✅ Dockerfile funcional
4. ✅ README.md actualizado con tu link de Docker Hub
5. ✅ Imagen subida públicamente en Docker Hub

## 💡 Consejos

- **Nombre de imagen**: Usa nombres descriptivos en minúsculas y sin espacios
- **Tags**: Usa tags descriptivos como `v1.0.0`, `latest`, `stable`
- **Descripción**: En Docker Hub, agrega una buena descripción de tu proyecto
- **README**: Docker Hub puede mostrar tu README.md automáticamente
- **Variables de entorno**: No subas archivos `.env` con datos sensibles

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Asegúrate de que MongoDB esté corriendo
- Verifica la variable de entorno `MONGO_URL`
- Si usas Docker Compose, verifica que ambos contenedores estén en la misma red

### Error: "Port already in use"
- El puerto 8080 ya está siendo usado
- Detén el proceso que lo usa o cambia el puerto: `docker run -p 3000:8080 ...`

### Error: "Push failed"
- Verifica que hayas hecho login: `docker login`
- Verifica que el nombre de la imagen incluya tu usuario de Docker Hub
- Verifica tu conexión a internet

## 📞 Ayuda

Si tienes problemas:
1. Revisa los logs: `docker logs nombre-contenedor`
2. Verifica que Docker Desktop esté ejecutándose
3. Revisa la documentación oficial: https://docs.docker.com/

---

**¡Éxito con tu entrega! 🎉**
