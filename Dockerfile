# Start from the official Node.js image
FROM node:latest

# Update system and install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy all other source code to work directory
ADD . /app

# TypeScript
RUN npm run build

# Start server
CMD [ "node", "build"]