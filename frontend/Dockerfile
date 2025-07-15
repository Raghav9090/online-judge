# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Fix: Ensure clean install for optional deps like rollup
RUN rm -rf node_modules package-lock.json && npm install --legacy-peer-deps

# Build the app
RUN npm run build

# Use `serve` to serve static files
RUN npm install -g serve

# Expose the port for production
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]


