dev:
	@echo "[dev] Running..."
	@npm run dev

compose-dev:
	@echo "[compose-dev]: Running docker compose dev mode..."
	@docker-compose -f docker-compose.yml up --build

compose-stop:
	@echo "[compose-stop]: Stopping docker compose dev mode..."
	@docker-compose -f docker-compose.yml down
