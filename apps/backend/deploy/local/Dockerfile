# =======================================================
# Backend Final Stage
# =======================================================
FROM node:20.15.1-slim AS backend
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci
RUN npm i serverless-offline serverless-offline-sqs
COPY . .
CMD [ "sh", "-c", "npm run build:swc && npm run dev" ]

# =======================================================
# Install Stage
# =======================================================
FROM node:20.15.1-slim AS install
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci --omit=dev

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
# Delay Job Final Stage
# =======================================================
FROM node:20.15.1-slim AS delay-job
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci
RUN npm i serverless-offline serverless-offline-sqs
COPY . .

CMD ["sh", "-c", "npm run build:swc && npm run delayjob:dev"]