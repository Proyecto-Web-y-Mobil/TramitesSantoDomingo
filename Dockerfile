# ---------------------------------------
# ETAPA 1: BUILDER (Compilación de React)
# ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos inventario e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente del frontend
COPY . .

# Compilamos la aplicación (esto crea la carpeta 'dist')
RUN npm run build

# ---------------------------------------
# ETAPA 2: RUNNER (Servidor Web Nginx)
# ---------------------------------------
FROM nginx:alpine

# Copiamos la aplicación ya compilada desde la etapa 1 hacia el servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (puerto web estándar)
EXPOSE 80

# Arrancamos el servidor
CMD ["nginx", "-g", "daemon off;"]