package db


import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	dsn := "postgres://pglekshmi:expo123@localhost:5432/fiber-postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	return db, err
}