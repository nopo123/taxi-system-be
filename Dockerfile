FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npm run typeorm:migration:run && npm run start:dev"]