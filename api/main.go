package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/pglekshmi/explorerGoPostgreSQL/config"
	"github.com/pglekshmi/explorerGoPostgreSQL/controllers"
	"github.com/pglekshmi/explorerGoPostgreSQL/db"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"github.com/pglekshmi/explorerGoPostgreSQL/threads"
)

func main() {
	DB, err := db.RetryConnectDB(10, 2*time.Second) // Connecting with DB
	if err != nil {
		fmt.Println("Cannot connect to DB")
	}

	if err := DB.AutoMigrate(&models.Block{}, &models.Transaction{}, &models.TransCount{}, models.Contract_call{}); err != nil {
		fmt.Println("Error in AutoMigrate:", err) // Creating tables if not there
		log.Fatal(err)
	} else {
		fmt.Println("AutoMigrate successful!")
	}
	Client, _ := config.RetryConnectNode(5, 2*time.Second) // Connecting with Node

	if Client != nil {

		controllers.BlockDetails(DB) // Getting initial details from Block 0 to current Block

		go threads.Task(DB) // Running a parallel thread to get the updates
	}
	
	app := fiber.New()
	app.Use(logger.New())

	app.Get("/today", func(c *fiber.Ctx) error { // Today's hourly Transaction count
		return controllers.GetdailyCount(c, DB)
	})

	app.Get("/tenday", func(c *fiber.Ctx) error { // Last Ten day's Transaction Count
		return controllers.GetlasttenCount(c, DB)
	})

	app.Get("/blocks", func(c *fiber.Ctx) error { // Last 20 block Details
		return controllers.Get20Blocks(c, DB)
	})

	app.Get("/block/:id", func(c *fiber.Ctx) error { // Block Details of queried number
		return controllers.GetBlockbyNymber(c, DB)
	})

	app.Get("/trans", func(c *fiber.Ctx) error { // Last 20 Transaction details
		return controllers.Get20Transactions(c, DB)
	})

	app.Get("/trans/:id", func(c *fiber.Ctx) error { // Transaction details of queried transaction hash
		return controllers.GetTransbyHash(c, DB)
	})

	app.Get("/transCount", func(c *fiber.Ctx) error { // Total Transaction count
		return controllers.GetTotalTransactions(c, DB)
	})

	app.Get("/contractCount", func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GetContractCount(c, DB)
	})
	

	app.Listen(":8080")

}
