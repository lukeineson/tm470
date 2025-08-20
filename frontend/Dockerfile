FROM node:18

WORKDIR /app

COPY package*.json ./

# Install project dependencies, ignoring peer dep conflicts
RUN npm install --legacy-peer-deps

RUN npm install --save-dev babel-preset-expo

COPY . .

EXPOSE 19006

CMD ["npm", "run", "web"]

