FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Expose port (internal only)
EXPOSE 8000

CMD ["node", "server.js"]
