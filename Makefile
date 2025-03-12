CURRENT_DIR = $(shell pwd)

run:
	@go run .

build:
	@go build main.go

air:
	@mkdir -p bin
	@GOBIN=$(CURRENT_DIR)/bin go install github.com/air-verse/air@latest

dev:
	$(CURRENT_DIR)/bin/air 

up:
	docker compose up -d

down:
	docker compose down


enter:
	@psql -h localhost -U pglekshmi -d fiber-postgres

fmt:
	@gofmt -s -w ./..