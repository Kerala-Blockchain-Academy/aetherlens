package models

import (
	
	"gorm.io/gorm"
)

type Transaction struct{
	gorm.Model
	Thash string `json:"Hash" gorm:"primaryKey"`
	To string `json:"To"`
	Type uint8 `json:"Type"`
	Gas uint64 `json:"Gas"`
	Value string `json:"Value"`
	Data string `json:"Data"`
	BlockNumber uint64 `json:"BlockNumber"`
	Time uint64 `json:"Time"`
}