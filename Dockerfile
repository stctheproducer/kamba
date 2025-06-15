FROM node:22-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Enable and prepare pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Install dotenvx CLI globally
RUN curl -fsSL https://dotenvx.com/install.sh | bash

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Create and set proper permissions for tmp directory
RUN mkdir -p /app/tmp && chmod 777 /app/tmp

# Set up volume for SQLite database
VOLUME ["/app/tmp"]

# Expose the application port
EXPOSE 3000

# Start the application using dotenvx
CMD ["dotenvx", "run", "-f", ".env.production", "--quiet", "--", "pnpm", "start"]

