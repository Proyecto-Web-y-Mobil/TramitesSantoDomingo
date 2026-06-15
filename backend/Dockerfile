# ---------------------------------------
# ETAPA 1: BUILDER (La Cocina)
# ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos el package.json e instalamos TODAS las dependencias
COPY package*.json ./
RUN npm install

# Copiamos todo el contenido de tu carpeta backend actual
COPY . .

# ---------------------------------------
# ETAPA 2: RUNNER (El Plato Servido)
# ---------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# 1. Copiamos los package.json
COPY --from=builder /app/package*.json ./

# 2. Instalamos SOLO dependencias de producción (más ligero)
RUN npm install --omit=dev

# 3. Copiamos tus archivos y carpetas reales al contenedor final
COPY --from=builder /app/config ./config
COPY --from=builder /app/db.js ./
COPY --from=builder /app/index.js ./

# 4. Exponemos el puerto
EXPOSE 3000

# 5. Comando para encender el servidor
CMD ["npm", "start"]