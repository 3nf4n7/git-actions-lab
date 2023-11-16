FROM node

RUN mkdir -p /app
WORKDIR /app

COPY backendNew/package*.json ./
RUN npm install

COPY backendNew/ .

EXPOSE 8000

CMD [ "npm", "start" ]

