package controllers

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"time"
)

type DailyCount struct {
	Hour       string `gorm:"column:hour"`
	TotalCount int64  `gorm:"column:tx_count"`
}

type TenCount struct {
	Day        time.Time `gorm:"column:day"`
	TransCount int64     `gorm:"column:transd_count"`
}

func GetdailyCount(c *fiber.Ctx, DB *gorm.DB) error {
	var results []DailyCount

	// loc, err := time.LoadLocation("Asia/Kolkata")
	// if err!=nil{
	// 	fmt.Println("Failed to load location")
	// }
	// fmt.Println(loc)
	// now := time.Now().In(loc)
	// fmt.Println(now)

	// // Get start and end of the day
	// startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	// fmt.Println("satart",startOfDay)
	// endOfDay := startOfDay.Add(24 * time.Hour)

	tx := DB.Table("trans_counts").
		Select(`TO_CHAR(TO_TIMESTAMP(timestamp)  AT TIME ZONE 'Asia/Kolkata', 'HH24') AS hour, SUM(count) AS tx_count`).
		Where(`TO_TIMESTAMP(timestamp) AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' >= (CURRENT_DATE AT TIME ZONE 'Asia/Kolkata') - INTERVAL '1 day'`).
		Group("hour").
		Order("hour").
		Scan(&results)

	fmt.Println("today",results)

	if err := tx.Error; err != nil {
		return err
	}

	if len(results) == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"msg": "No Transactions today"})
	}
	return c.Status(http.StatusOK).JSON(&results)

}

func GetlasttenCount(c *fiber.Ctx, DB *gorm.DB) error {
	var tendays []TenCount

	tx := DB.Table("trans_counts").
		Select("date_trunc('day', to_timestamp(timestamp)) AS day, SUM(Count) AS transd_count").
		Where("to_timestamp(timestamp) >= CURRENT_DATE - INTERVAL '10 days'").
		Group(" date_trunc('day', to_timestamp(timestamp))").
		Order("date_trunc('day', to_timestamp(timestamp))").
		Scan(&tendays)

	if err := tx.Error; err != nil {
		return err
	}

	fmt.Println(tendays)
	if len(tendays) == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"msg": "No Transactions happening"})
	}
	return c.Status(http.StatusOK).JSON(&tendays)

}

func Get20Blocks(c *fiber.Ctx, DB *gorm.DB) error {
	var blocks []models.Block
	result := DB.Order("Number DESC").Limit(20).Find(&blocks) // SELECT * FROM blocks;

	if err := result.Error; err != nil {
		return err
	}
	return c.Status(http.StatusOK).JSON(&blocks)

}

func GetBlockbyNymber(c *fiber.Ctx, DB *gorm.DB) error {
	var block models.Block
	blockNumberStr := c.Params("id")
	fmt.Println(blockNumberStr)
	blockNumber, err := strconv.ParseUint(blockNumberStr, 10, 64) //Converting String to Uint64
	if err != nil {
		fmt.Println("Error converting block number:", err)

	}

	result := DB.Where("Number = ?", blockNumber).Find(&block) // SELECT * FROM bloc WHERE block_number = ?;

	if err := result.Error; err != nil {
		return err
	}
	fmt.Println(block)
	return c.Status(http.StatusOK).JSON(&block)
}

func Get20Transactions(c *fiber.Ctx, DB *gorm.DB) error {
	var trans []models.Transaction
	result := DB.Order("Block_Number DESC").Limit(20).Find(&trans) // SELECT * FROM blocks;

	if err := result.Error; err != nil {
		return err
	}
	return c.Status(http.StatusOK).JSON(&trans)
}

func GetTransbyHash(c *fiber.Ctx, DB *gorm.DB) error {
	var tbyhash []models.Transaction
	transHash := c.Params("id")
	result := DB.Where("Thash = ?", transHash).Find(&tbyhash) // SELECT * FROM bloc WHERE block_number = ?;

	if err := result.Error; err != nil {
		return err
	}
	return c.Status(http.StatusOK).JSON(&tbyhash)
}

func GetTransbyBlock(c *fiber.Ctx, DB *gorm.DB) error {
	var tbyblock []models.Transaction
	blockNumber := c.Params("id")
	result := DB.Where("BlockNumber = ?", blockNumber).Find(&tbyblock) // SELECT * FROM bloc WHERE block_number = ?;

	if err := result.Error; err != nil {
		return err
	}
	return c.Status(http.StatusOK).JSON(&tbyblock)

}

func GetTotalTransactions(c *fiber.Ctx, DB *gorm.DB) error {
	var totalCount int64

	err := DB.Table("trans_counts").Select("SUM(Count)").Scan(&totalCount).Error
	if err != nil {
		fmt.Println("Cannot get total count from trans_count table")
		return err
	}
	return c.Status(http.StatusOK).JSON(totalCount)
}

func GetContractCount(c *fiber.Ctx, DB *gorm.DB) error {
	var totalEntries int64
	err := DB.Table("contract_calls").Count(&totalEntries).Error
	if err != nil {
		return err
	}
	return c.Status(http.StatusOK).JSON(&totalEntries)
}

func GettenBlockDetails(c *fiber.Ctx, DB *gorm.DB) error {
	var blocks []models.Block
	result := DB.Order("number DESC").Limit(10).Find(&blocks)

	if result.Error != nil {
		return result.Error
	} else {
		return c.Status(http.StatusOK).JSON(&blocks)
	}
}

func TxCountbyNumber(c *fiber.Ctx, DB *gorm.DB) error {
	blockNumber := c.Params("id")
	var txCount int64

	result := DB.Table("trans_counts").Select("count").Where("block_number = ?", blockNumber).Scan(&txCount)
	fmt.Printf("Count %d", txCount)

	if result.Error != nil {
		return result.Error
	} else {
		return c.Status(http.StatusOK).JSON(&txCount)
	}

}

func TxByNumber(c *fiber.Ctx, DB *gorm.DB) error {
	blockNumber := c.Params("id")
	fmt.Printf("block%v", blockNumber)
	var txDetails []models.Transaction

	result := DB.Table("transactions").Select("*").Where("block_number = ?", blockNumber).Scan(&txDetails)
	fmt.Printf("tx %v", txDetails)

	if result.Error != nil {
		return result.Error
	} else {
		return c.Status(http.StatusOK).JSON(&txDetails)
	}

}

func GetLatestBlock(c *fiber.Ctx, DB *gorm.DB) error {
	var maxBlockNumber uint64
	result := DB.Table("blocks").Select("MAX(Number)").Scan(&maxBlockNumber)
	if result.Error != nil {
		return result.Error
	} else {
		return c.Status(http.StatusOK).JSON(&maxBlockNumber)
	}
}

func GetTxPresent(c *fiber.Ctx, DB *gorm.DB) error {
	txHash := c.Params("id")
	var count int64
	err := DB.Table("transactions").Where("thash = ?", txHash).Count(&count).Error

	if err != nil {
		return err
	} else if count > 0 {
		return c.Status(http.StatusOK).JSON(&count)
	} else {
		return c.Status(http.StatusNotFound).JSON(&count)
	}
}

func GetAllContracts(c *fiber.Ctx, DB *gorm.DB) error {
	var contracts []models.Contract_call
	result := DB.Find(&contracts)

	if result.Error != nil {
		return result.Error
	} else {
		return c.Status(http.StatusOK).JSON(&contracts)
	}
}

func GetAllContractTx(c *fiber.Ctx, DB *gorm.DB) error {
	cAddr := c.Params("id")
	fmt.Println(cAddr)
	var contractTx []models.Transaction
	result := DB.Where("to_address = ?", cAddr).Order("time DESC").Limit(100).Find(&contractTx)
	// result := DB.Table("transactions").Select("*").Where("to=?", cAddr).Scan(&contractTx)
	fmt.Println(contractTx)

	if result.Error != nil {
		return result.Error
	} else {
		return c.Status(http.StatusOK).JSON(&contractTx)
	}
}
