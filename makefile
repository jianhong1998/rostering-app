PROJECT_NAME = "rostering-app"


up/build:
	@docker compose \
		-p ${PROJECT_NAME} \
		up --build -w --remove-orphans

down:
	@docker compose \
		-p ${PROJECT_NAME} \
		down
		