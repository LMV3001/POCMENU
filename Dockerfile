# Étape 1 : On utilise Node.js pour compiler le TypeScript
FROM node:20-alpine AS build
WORKDIR /app

# On installe les dépendances
COPY package*.json ./
RUN npm install

# On copie le reste du code et on lance la compilation
COPY . .
RUN npm run build

# Étape 2 : On utilise Nginx pour servir le résultat final (plus léger)
FROM nginx:alpine
# On récupère seulement le dossier 'dist' créé par Vite à l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]