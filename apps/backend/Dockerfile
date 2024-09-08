# =======================================================
# Build Stage
# =======================================================
FROM --platform=linux/arm64 node:20.15.1 AS build
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci
# RUN npm i

COPY . .
RUN npm run build:swc

# =======================================================
# Install Stage
# =======================================================
FROM --platform=linux/arm64 node:20.15.1 AS install
WORKDIR /usr/apps/backend

COPY package*.json .
RUN npm ci --omit=dev
# RUN npm i --omit=dev
# RUN npm i serverless-offline

# =======================================================
# Final Stage
# =======================================================
FROM --platform=linux/arm64 public.ecr.aws/lambda/nodejs:20-arm64 AS final
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=install /usr/apps/backend/node_modules ./node_modules
COPY --from=build /usr/apps/backend/dist ./dist
COPY --from=build /usr/apps/backend/config ./config
COPY --from=build /usr/apps/backend/ap-southeast-1-bundle.pem ./
COPY --from=build /usr/apps/backend/nest-cli.json ./
COPY --from=build /usr/apps/backend/.env ./

CMD ["dist/main.handler"]