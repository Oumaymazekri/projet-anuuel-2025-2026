# Utilise l'image officielle de Node.js
FROM node:16

# Crée un répertoire pour l'application
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tous les fichiers de l'application dans le conteneur
COPY . .

# Expose le port que le service va utiliser
EXPOSE 3002

# Démarre le service
CMD ["npm", "start"]
