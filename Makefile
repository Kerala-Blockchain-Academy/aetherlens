CURRENT_DIR = $(shell pwd)

run:
	@cd api/ && go run .

build:
	@cd api/ && go build main.go

air:
	@mkdir -p api/bin
	@GOBIN=$(CURRENT_DIR)/api/bin go install github.com/air-verse/air@latest

dev:
	$(CURRENT_DIR)/api/bin/air 

up:
	docker compose up -d

down:
	docker compose down


enter:
	@psql -h localhost -U pglekshmi -d fiber-postgres

fmt:
	@gofmt -s -w ./..