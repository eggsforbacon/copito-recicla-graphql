# Establece la imagen base
FROM node:20-alpine AS builder
WORKDIR /app

# Instala libs para Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copia deps e instala
COPY package.json package-lock.json ./
RUN npm ci

# Copia todo el código
COPY . .

# Build (incluye prisma generate a través de prebuild)
RUN npm run build

ARG NEXTAUTH_URL=https://copitorecicla.com
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Etapa de producción
FROM node:20-alpine

# Instala libs para Prisma en runtime
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# Solo deps de producción
COPY --from=builder /app ./
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]