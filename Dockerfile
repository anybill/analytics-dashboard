# Build stage
FROM node:lts-alpine3.18 AS base

FROM base AS build
WORKDIR /src

# Add build arguments
ARG VITE_ANYBILL_USERNAME
ARG VITE_ANYBILL_PASSWORD
ARG VITE_ANYBILL_VCID

# Set environment variables
ENV VITE_ANYBILL_USERNAME=$VITE_ANYBILL_USERNAME
ENV VITE_ANYBILL_PASSWORD=$VITE_ANYBILL_PASSWORD
ENV VITE_ANYBILL_VCID=$VITE_ANYBILL_VCID

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

### FINAL
FROM base AS final
WORKDIR /app
COPY --from=build /src/.output .output

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000
EXPOSE 3000
ENTRYPOINT ["node", ".output/server/index.mjs"]
