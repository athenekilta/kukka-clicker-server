# Docker multistage build

# Stage 1 Build the code
FROM node as builder
WORKDIR /usr/src/app
# Copy package first
COPY package*.json ./
# Install dependencies
RUN npm install
# Then copy all else
COPY . ./
# Build
RUN npm run build

# Stage 2
FROM node
WORKDIR /usr/src/app
# Copy package first
COPY package*.json ./
# Install prod dependencies
RUN npm install --production
# Then copy from Stage 1
COPY --from=builder /usr/src/app/build ./build
# Expose
# EXPOSE $PORT
# Start
CMD node build/index.js --bind:0.0.0.0:$PORT
