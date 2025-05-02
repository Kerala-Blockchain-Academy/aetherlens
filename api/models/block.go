package models

import (
	"gorm.io/gorm"
)

type Block struct {
	gorm.Model
	Number     uint64 `json:"Number"`
	Hash       string `gorm:"primaryKey" json:"Hash"`
	ParentHash string `json:"ParentHash"`
	GasLimit   uint64 `json:"GasLimit"`
	Time       uint64 `json:"Time"`
	Size       uint64 `json:"Size"`
}
