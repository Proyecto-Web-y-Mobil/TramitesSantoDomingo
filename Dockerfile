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
# Etapa de Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Sobrescribir la configuración por defecto de Nginx con la nuestra
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]