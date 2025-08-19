# Usa una imagen de Node para construir la aplicación
FROM node:20.14.0 AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto necesarios para las dependencias
COPY package*.json ./

# Define los argumentos para ser pasados en el momento de construcción
ARG VITE_BACKEND_URL

# Exporta los argumentos como variables de entorno
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Instala las dependencias, incluyendo devDependencies
RUN npm install

# Copia todos los archivos al contenedor
COPY . .

# Ejecuta el build de Vite
RUN npm run build

# Usa una imagen ligera de Nginx para servir la aplicación
FROM nginx:stable-alpine

# Instala gettext para usar envsubst
RUN apk add --no-cache gettext

# Establece la variable de entorno PORT
ENV NODE_ENV=production
ENV PORT 8080

# Elimina la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia la plantilla de configuración de Nginx
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copia el resultado de la construcción de Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto que usa Nginx
EXPOSE 8080

# Comando para iniciar Nginx con la configuración actualizada
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
