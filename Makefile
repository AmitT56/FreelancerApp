.PHONY: up down build logs restart clean

# Start all services
up:
	docker-compose up --build

# Start in detached mode
up-d:
	docker-compose up --build -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Restart services
restart:
	docker-compose restart

# Clean up (remove containers, volumes, networks)
clean:
	docker-compose down -v --remove-orphans

# Rebuild without cache
rebuild:
	docker-compose build --no-cache

# Backend only
backend-logs:
	docker-compose logs -f backend

# Frontend only
frontend-logs:
	docker-compose logs -f frontend

