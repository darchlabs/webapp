# load .env file
include .env
export $(shell sed 's/=.*//'.env)

SERVICE_NAME=webapp
DOCKER_USER=darchlabs

build-app:
	@echo "[building webapp]"
	@docker build -t darchlabs/webapp -f ./Dockerfile --progress tty .
	@echo "Build darchlabs-webapp docker image done ✔︎"

compose-up:
	@echo "[webapp compose up]"
	@docker-compose -f docker-compose.yml up

compose-down:
	@echo "[webapp compose up]"
	@docker-compose -f docker-compose.yml down

dev:
	@echo "[dev] Running..."
	@npm run dev

compose-dev:
	@echo "[compose-dev]: Running docker compose dev mode..."
	@docker-compose -f docker-compose.yml up --build

compose-stop:
	@echo "[compose-stop]: Stopping docker compose dev mode..."
	@docker-compose -f docker-compose.yml down

docker-login:
	@echo "[docker] Login to docker..."
	@docker login -u $(DOCKER_USER) -p $(DOCKER_PASS)

docker: docker-login
	@echo "[docker] pushing $(REGISTRY_URL)/$(SERVICE_NAME):$(VERSION)"
	@docker buildx create --use
	@docker buildx build --platform linux/amd64,linux/arm64  --push -t $(DOCKER_USER)/$(SERVICE_NAME):$(VERSION)	.
