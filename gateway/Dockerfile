FROM node:18

WORKDIR /app

# Copy package files
COPY gateway/package*.json ./

# Install dependencies
RUN npm install

# Copy proto files
COPY proto /app/proto

# Copy app source
COPY gateway .

EXPOSE 3000

CMD ["node", "index.js"]
