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

down/clean:
	@docker compose \
		-p ${PROJECT_NAME} \
		down -v

db/data/up:
	@cd apps/backend && \
		npm run build && \
		npm run seed:run