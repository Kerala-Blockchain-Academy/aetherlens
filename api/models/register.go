package models

import (
	"gorm.io/gorm"
)

type Register struct {
	gorm.Model
	Name     string `json:"Name"`
	UserName string `gorm:"primaryKey" json:"UserName"`
	Password string `json:"Password"`
}
