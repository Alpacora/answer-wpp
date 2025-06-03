# Usa imagem oficial do Node.js
FROM node:22

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos de dependência para aproveitar o cache
COPY package*.json ./

# Instala dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Se o projeto usa TypeScript, descomente a linha abaixo:
RUN npm run build && curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash

# Expõe as portas:
# - 3000 para sua aplicação Node e filebrowser
EXPOSE 3000 

# Inicia o Node e o Filebrowser no mesmo container
CMD ["sh", "-c", "npm start & ./filebrowser --port 3000 --root /data"]
