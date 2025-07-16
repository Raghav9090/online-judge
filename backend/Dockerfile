FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Ensure the temp directory exists and is writable
RUN mkdir -p /app/temp && chown -R 1000:1000 /app/temp

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production

EXPOSE 5000
CMD ["node", "server.js"]
