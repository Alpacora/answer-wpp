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
# - 3000 para sua aplicação Node
# - 8080 para o painel Filebrowser
EXPOSE 3000 8080

# Inicia o Node e o Filebrowser no mesmo container
CMD ["sh", "-c", "npm start & ./filebrowser --port 8080 --root /data"]
