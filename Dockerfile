FROM node:20-alpine

WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if exists)
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production


# Expose the port the app runs on
EXPOSE 1111

# Start the application
CMD ["pnpm", "start"]
