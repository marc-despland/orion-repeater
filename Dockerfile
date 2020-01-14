FROM node
ADD . /app
WORKDIR /app
RUN npm install
ENTRYPOINT ["node", "index.js"]