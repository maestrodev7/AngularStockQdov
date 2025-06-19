# Étape 1 : Construction de l'application Angular
FROM node:22-alpine AS build
# Utilise une image Node.js légère basée sur Alpine pour construire l'application.

WORKDIR /app
# Définit le répertoire de travail à /app à l'intérieur du conteneur.

COPY package*.json ./
# Copie les fichiers package.json et package-lock.json dans le conteneur.

RUN npm ci --legacy-peer-deps
# Installe les dépendances du projet, en contournant les problèmes de dépendance si nécessaire.

COPY . .
# Copie tous les fichiers du répertoire courant dans le conteneur.

RUN npm run build --configuration=production
# Exécute la commande Angular pour construire l'application en mode production.

# Étape 2 : Servir l'application avec Nginx
FROM nginx:stable-alpine AS production
# Utilise une image stable de Nginx basée sur Alpine pour servir l'application.

# Supprime les fichiers par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers générés depuis la construction Angular
COPY --from=build /app/dist/fuse/browser /usr/share/nginx/html
# Copie les fichiers construits à partir de l'étape de construction vers le répertoire de Nginx.

COPY ./nginx/app.conf /etc/nginx/conf.d/default.conf
# Copie le fichier de configuration Nginx personnalisé dans le conteneur.

EXPOSE 80
# Ouvre le port 80 pour les requêtes HTTP.

CMD ["nginx", "-g", "daemon off;"]
# Démarre Nginx en mode non-démon, ce qui permet de garder le conteneur en cours d'exécution.
