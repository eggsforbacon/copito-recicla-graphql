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
FROM node:20-alpine AS runner
WORKDIR /app

# Instala libs para Prisma en runtime
RUN apk add --no-cache openssl libc6-compat

# Solo deps de producción
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia artefactos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3000

# Aplica migraciones y lanza
RUN npx prisma migrate deploy
CMD ["npm", "start"]