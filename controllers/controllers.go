package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type DailyCount struct {
	Hour       time.Time `gorm:"column:hour"`
	TotalCount int64     `gorm:"column:trans_count"`
}

type TenCount struct {
	Day        time.Time `gorm:"column:day"`
	TransCount int64     `gorm:"column:transd_count"`
}

func GetdailyCount(c *fiber.Ctx, DB *gorm.DB) error {
	var results []DailyCount

	tx := DB.Table("trans_counts").
		Select(" date_trunc('hour', to_timestamp(timestamp)) AS hour,SUM(Count) AS trans_count").
		Where("to_timestamp(timestamp) >= ? AND to_timestamp(timestamp) < ?",
			time.Now().Truncate(24*time.Hour),
			time.Now().Add(24*time.Hour).Truncate(24*time.Hour)).
		Group("date_trunc('hour', to_timestamp(timestamp))").
		Order("date_trunc('hour', to_timestamp(timestamp))").
		Scan(&results)

	if err := tx.Error; err != nil {
		return err
	}

	fmt.Println(results)
	if len(results) == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"msg": "No Transactions today"})
	}
	return c.Status(http.StatusOK).JSON(&results)

}

func GetlasttenCount(c *fiber.Ctx ,DB *gorm.DB) error{
	var tendays []TenCount

	tx:= DB.Table("trans_counts").
		Select("date_trunc('day', to_timestamp(timestamp)) AS day, SUM(Count) AS transd_count").
		Where("to_timestamp(timestamp) >= CURRENT_DATE - INTERVAL '10 days'").
		Group(" date_trunc('day', to_timestamp(timestamp))").
		Order("date_trunc('day', to_timestamp(timestamp))").
		Scan(&tendays)

	fmt.Println("days", tendays)

    if err := tx.Error; err != nil {
		return err
	}

    fmt.Println(tendays)
	if len(tendays) == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"msg": "No Transactions happening"})
	}
	return c.Status(http.StatusOK).JSON(&tendays)

}

func GetallTransactions(){
    
}
