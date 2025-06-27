FROM golang:1.24.0-alpine AS builder

WORKDIR /api

COPY go.mod go.sum /

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main

#FROM scratch AS runner

FROM alpine:latest AS runner

# Install CA certificates
RUN apk --no-cache add ca-certificates

COPY --from=builder /api/main /