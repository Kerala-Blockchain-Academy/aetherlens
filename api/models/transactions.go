package models

import (
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	Thash       string `json:"Hash"`
	ToAddress   string `json:"To"`
	FromAddress string `json:"From"`
	Type        uint8  `json:"Type"`
	Gas         uint64 `json:"Gas"`
	Value       string `json:"Value"`
	BlockNumber uint64 `json:"BlockNumber"`
	Time        uint64 `json:"Time"`
}
