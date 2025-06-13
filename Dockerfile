# Use uma imagem oficial Node.js LTS (alpine é mais leve)
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (cache otimizado)
COPY package.json yarn.lock ./

# Instala dependências
RUN yarn install

# Copia o restante do código
COPY . .

# Build do projeto
RUN yarn build

# Expõe a porta 8080
EXPOSE 8080

# Comando de start
CMD ["yarn", "start"]
