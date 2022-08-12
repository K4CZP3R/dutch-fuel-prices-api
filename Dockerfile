FROM node:16 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build

CMD [ "ENVIRONMENT=production","node", "dist/index.js" ]