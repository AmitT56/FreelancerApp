FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application code (will be overridden by volume mounts in development)
COPY . .

# Expose port
EXPOSE 5173

# Run dev server with hot reload - watches for file changes
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

