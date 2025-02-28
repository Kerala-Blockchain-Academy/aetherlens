package db

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"time"
)

func Connect() (*gorm.DB, error) {
	dsn := "postgres://pglekshmi:expo123@localhost:5432/fiber-postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to DB: %w", err)
	}

	err = db.Raw("SELECT 1").Error

	if err != nil {
		return nil, fmt.Errorf("failed to connect to DB: %w", err)
	}

	return db, nil
}

func RetryConnectDB(maxRetries int, delay time.Duration) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	for i := 1; i <= maxRetries; i++ {
		db, err = Connect()

		if db != nil {
			fmt.Println("Successfully connected to node!")
			return db, nil
		}

		log.Printf("Attempt %d: Failed to connect. Retrying in %v...\n", i, delay)
		time.Sleep(delay) // Wait before retrying
		delay *= 2        // Exponential backoff (double the delay)
	}

	return nil, fmt.Errorf("failed to connect after %d attempts: %v", maxRetries, err)
}
