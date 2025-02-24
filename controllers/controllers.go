package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
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

func Get20Blocks(c *fiber.Ctx,DB *gorm.DB)error{
	var blocks []models.Block
    result := DB.Order("Number DESC").Limit(20).Find(&blocks) // SELECT * FROM blocks;
    
    if err:=result.Error;err != nil {
        return err
    }
    return c.Status(http.StatusOK).JSON(&blocks)
    
}

func GetBlockbyNymber(c *fiber.Ctx ,DB *gorm.DB)error{
	var block []models.Block
	blockNumberStr :=c.Params("id")
	blockNumber, err := strconv.ParseUint(blockNumberStr, 10, 64)//Converting String to Uint64
if err != nil {
	fmt.Println("Error converting block number:", err)
	
}
	fmt.Println("BlockNumber",blockNumber)
    result := DB.Where("Number = ?", blockNumber).Find(&block) // SELECT * FROM bloc WHERE block_number = ?;
    
    if err:=result.Error;err != nil {
        return err
    }
    return c.Status(http.StatusOK).JSON(&block)
}

func Get20Transactions(c *fiber.Ctx ,DB *gorm.DB)error{
	var trans []models.Transaction
    result := DB.Order("Block_Number DESC").Limit(20).Find(&trans) // SELECT * FROM blocks;
    
    if err:=result.Error;err != nil {
        return err
    }
    return c.Status(http.StatusOK).JSON(&trans)
}

func GetTransbyHash(c *fiber.Ctx ,DB *gorm.DB) error{
	var tbyhash []models.Transaction
	transHash := c.Params("id")
	fmt.Println("transaction Hash",transHash)
    result := DB.Where("Thash = ?", transHash).Find(&tbyhash) // SELECT * FROM bloc WHERE block_number = ?;
    
    if err:=result.Error;err != nil {
        return err
    }
    return c.Status(http.StatusOK).JSON(&tbyhash)
}

func GetTotalTransactions(c *fiber.Ctx ,DB *gorm.DB)error{
	var totalCount int64

	err:=DB.Table("trans_counts").Select("SUM(Count)").Scan(&totalCount).Error
	if err!=nil{
		fmt.Println("Cannot get total count from trans_count table")
		return err
	}
    return c.Status(http.StatusOK).JSON(totalCount)
}

func GetContractCount(c *fiber.Ctx ,DB *gorm.DB)error{
	var totalEntries int64
	err:=DB.Table("contract_calls").Count(&totalEntries).Error
	if err!=nil{
		return err
	}
	return c.Status(http.StatusOK).JSON(&totalEntries)
}