# 1. Node image
FROM node:20

# 2. Ish papkasi
WORKDIR /app

# 3. package copy va dependencies
COPY package*.json ./
RUN npm install

# 4. Loyiha fayllarini copy
COPY . .

# 5. NestJS build
RUN npm run build

# 6. Portni ochish
EXPOSE 4000

# 7. Production start
CMD ["node", "dist/src/main.js"]
