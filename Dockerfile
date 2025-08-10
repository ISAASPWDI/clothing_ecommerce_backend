# Dockerfile

FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia archivos necesarios
COPY package.json ./
COPY tsconfig.json ./
COPY ./src ./src

# Copia archivos opcionales
COPY .env .env

# Instala dependencias
RUN npm install

# Compila el código TypeScript
RUN npm run build

# Expone el puerto en el que corre tu app (ajústalo si es otro)
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "run", "start"]
