PROJECT_NAME = "rostering-app"

up:
	@make docker/up && \
		make backend/up

down:
	@make docker/down

docker/up:
	@docker compose \
		-p ${PROJECT_NAME} \
		up --build -d --remove-orphans

docker/down:
	@docker compose \
		-p ${PROJECT_NAME} \
		down

backend/up:
	@cd apps/backend && \
		bash dev.sh

