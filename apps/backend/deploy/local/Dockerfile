# =======================================================
# Build Stage
# =======================================================
FROM node:20.15.1-slim AS backend-build
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build:swc
COPY ./src/emails/templates ./dist/emails/templates

# =======================================================
# Install Stage
# =======================================================
FROM node:20.15.1-slim AS install
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci --omit=dev
RUN npm i serverless-offline serverless-offline-sqs

# =======================================================
# Backend Final Stage
# =======================================================
FROM node:20.15.1-slim AS backend
WORKDIR /usr/apps/backend

COPY --from=install /usr/apps/backend/node_modules ./node_modules
COPY --from=backend-build /usr/apps/backend/dist ./dist
# COPY --from=backend-build /usr/apps/backend/config ./config
COPY --from=backend-build /usr/apps/backend/ap-southeast-1-bundle.pem ./
# COPY --from=backend-build /usr/apps/backend/nest-cli.json ./
COPY --from=backend-build /usr/apps/backend/serverless.backend.local.yml ./
COPY --from=backend-build /usr/apps/backend/.env ./
COPY --from=backend-build /usr/apps/backend/package*.json ./

CMD ["sh", "-c", "npx serverless offline start -c serverless.backend.local.yml --httpPort 3001"]

# =======================================================
# DB Migrate Build Stage
# =======================================================
FROM node:20.15.1-slim AS db-migrate-build
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

# =======================================================
# DB Migrate Final Stage
# =======================================================
FROM node:20.15.1-slim AS db-migrate
WORKDIR /usr/apps/backend

COPY --from=install /usr/apps/backend/node_modules ./node_modules
COPY --from=db-migrate-build /usr/apps/backend/dist ./dist
COPY --from=db-migrate-build /usr/apps/backend/ap-southeast-1-bundle.pem ./
COPY --from=db-migrate-build /usr/apps/backend/.env ./
COPY --from=db-migrate-build /usr/apps/backend/package*.json ./

CMD ["npm", "run", "migration:run"]

# =======================================================
# Delay Job Build Stage
# =======================================================
FROM node:20.15.1-slim AS delay-job-build
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build:swc
COPY ./src/emails/templates ./dist/emails/templates

# =======================================================
# DB Migrate Final Stage
# =======================================================
FROM node:20.15.1-slim AS delay-job
WORKDIR /usr/apps/backend

COPY --from=install /usr/apps/backend/node_modules ./node_modules
COPY --from=delay-job-build /usr/apps/backend/dist ./dist
COPY --from=delay-job-build /usr/apps/backend/ap-southeast-1-bundle.pem ./
COPY --from=delay-job-build /usr/apps/backend/serverless.delay-job.local.yml ./
COPY --from=delay-job-build /usr/apps/backend/.env ./
COPY --from=delay-job-build /usr/apps/backend/package*.json ./

CMD ["sh", "-c", "npx serverless offline start -c serverless.delay-job.local.yml --lambdaPort 3004"]