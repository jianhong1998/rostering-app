PROJECT_NAME = "rostering-app"


up/build:
	@docker compose \
		-p ${PROJECT_NAME} \
		up --build -d --remove-orphans

down:
	@docker compose \
		-p ${PROJECT_NAME} \
		down
		