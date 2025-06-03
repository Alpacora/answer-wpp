# Etapa 1: build do projeto
FROM node:22 AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Etapa 2: app final + filebrowser
FROM node:22
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.env .env

# Instala o File Browser corretamente
RUN curl -fsSL https://github.com/filebrowser/filebrowser/releases/latest/download/linux-amd64-filebrowser.tar.gz \
  | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/filebrowser

# Copia o entrypoint customizado
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

VOLUME ["/usr/src/app/auth_info_baileys"]
EXPOSE 3000 8080

CMD ["/usr/src/app/entrypoint.sh"]
