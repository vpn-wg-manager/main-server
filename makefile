db_up:
	docker compose -f db.compose.yml up -d
db_down:
	docker compose -f db.compose.yml down

full_restart: down up
	docker compose up -d

down:
	docker compose down && docker image rm highserver-api && docker system prune -f

up:
	docker compose up -d
