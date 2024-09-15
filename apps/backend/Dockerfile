# =======================================================
# Build Stage
# =======================================================
FROM node:20.15.1-slim AS build
WORKDIR /usr/apps/backend

# RUN apt-get update && apt-get install -y cmake autoconf libtool m4

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build:swc

# =======================================================
# Install Stage
# =======================================================
FROM node:20.15.1-slim AS install
WORKDIR /usr/apps/backend

# RUN apt-get update && apt-get install -y cmake autoconf libtool m4

COPY package*.json .
RUN npm ci --omit=dev

# =======================================================
# Final Stage
# =======================================================
FROM --platform=linux/arm64 public.ecr.aws/lambda/nodejs:20-arm64 AS final
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=install /usr/apps/backend/node_modules ./node_modules
COPY --from=build /usr/apps/backend/dist ./dist
COPY --from=build /usr/apps/backend/ap-southeast-1-bundle.pem ./
# COPY --from=build /usr/apps/backend/nest-cli.json ./
COPY --from=build /usr/apps/backend/.env ./

CMD ["dist/main.handler"]