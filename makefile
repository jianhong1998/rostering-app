PROJECT_NAME = "rostering-app"

up:
	@docker compose \
		-p ${PROJECT_NAME} \
		up -w

up/build:
	@docker compose \
		-p ${PROJECT_NAME} \
		up --build -w --remove-orphans

down:
	@docker compose \
		-p ${PROJECT_NAME} \
		down
	@$(MAKE) docker/image/clean

down/clean:
	@docker compose \
		-p ${PROJECT_NAME} \
		down -v
	@rm -rf postgres-data
	@$(MAKE) docker/image/clean

docker/image/clean:
	@docker image prune -f

db/data/up:
	@cd apps/backend && \
		npm run build && \
		npm run seed:run

db/data/generate:
	@cd apps/backend && \
		npm run seed:create --name=${name}
	@$(MAKE) format

# ======================================================================
# example: make db/migration/generate name=init
# ======================================================================
db/migration/generate:
	@cd apps/backend && \
		npm run build && \
		npm run migration:generate --name=${name}
	@$(MAKE) format


format:
	@cd apps/frontend && \
		npm run format
	@cd apps/backend && \
		npm run format
	
install:
	@cd apps/frontend && \
		rm -rf node_module && \
		npm ci
	@cd apps/backend && \
		rm -rf node_module && \
		npm ci