FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY app/ ./app/
COPY server.js ./

EXPOSE 3000

CMD ["npm", "run", "prod"]