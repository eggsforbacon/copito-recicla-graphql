# Establece la imagen base
FROM node:20-alpine AS builder

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo de dependencias y las instala
COPY package.json package-lock.json ./
RUN npm ci

# Copia el código fuente y construye el proyecto
COPY . .
RUN npm run docker:start
RUN npm run build

ARG NEXTAUTH_URL=https://copitorecicla.com
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Configura el entorno de producción
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]