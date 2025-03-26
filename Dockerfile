
# Build stage
FROM node:lts-alpine3.18 AS build
WORKDIR /app

# Install build dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy project files
COPY . .

# Use build arguments for build-time configuration
ARG VITE_ANYBILL_USERNAME
ARG VITE_ANYBILL_PASSWORD
ARG VITE_ANYBILL_VCID

# Pass as environment variables during build
ENV VITE_ANYBILL_USERNAME=$VITE_ANYBILL_USERNAME
ENV VITE_ANYBILL_PASSWORD=$VITE_ANYBILL_PASSWORD
ENV VITE_ANYBILL_VCID=$VITE_ANYBILL_VCID

# Fix TypeScript errors and build
RUN yarn build

# Production stage
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html

# Copy built files from build stage
COPY --from=build /app/dist .

# Optional: Custom Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/.htpasswd /etc/nginx/htpasswd


# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]