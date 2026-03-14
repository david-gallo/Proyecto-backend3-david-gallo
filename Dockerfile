# Etapa de construcción
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Etapa de producción
FROM node:18-alpine

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar node_modules desde la etapa de construcción
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar el código de la aplicación
COPY --chown=nodejs:nodejs . .

# Cambiar al usuario no privilegiado
USER nodejs

# Exponer el puerto
EXPOSE 8080

# Variable de entorno para producción
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/api/users', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]
