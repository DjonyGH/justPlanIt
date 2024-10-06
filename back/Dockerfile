FROM node:16.13

WORKDIR /app

EXPOSE 3001

COPY package*.json ./

RUN npm install --force

COPY ./ ./

CMD ["npm", "run", "start:dev"]
