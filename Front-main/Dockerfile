# Étape 1 : Construction de l'application
FROM node:18 AS build

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Exécution de l'application en production
FROM node:18 AS production

WORKDIR /app

# Copier les fichiers construits depuis l'étape build
COPY --from=build /app ./

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application Next.js en mode production
CMD ["npm", "start"]
