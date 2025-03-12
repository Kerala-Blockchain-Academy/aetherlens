ifneq (,$(wildcard ./.env))
    include .env
    export
endif

up:
	@docker compose up --build -d

up-v:
	@docker compose up --build

down:
	@docker compose down

enter:
	@docker exec -it aetherlens-db psql -U $(PG_USER) -d $(PG_DB)

prune:
	@docker system prune

tidy:
	@cd api/ && go mod tidy

fmt:
	@cd api/ && gofmt -s -w ./..
	@cd ui/ && npm run fmt