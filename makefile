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
		