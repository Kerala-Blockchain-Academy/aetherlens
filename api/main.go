package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	
	latestBlockNumber, err := Client.BlockNumber(context.Background()) // Get the latest block number
	if err != nil {
		fmt.Println("Something wrong getting data", err)
	}
		i:=uint64(0)
		n:=uint64(10000)
		// Getting initial details from Block 0 to current Block
		go controllers.BlockDetails(i,i+n,DB,Client)
		go controllers.BlockDetails(i+n+1,i+(2*n),DB,Client)
		go controllers.BlockDetails(i+(2*n)+1,i+(3*n),DB,Client)
		go controllers.BlockDetails(i+(3*n)+1,i+(4*n),DB,Client)
		go controllers.BlockDetails(i+(4*n)+1,i+(5*n),DB,Client)
		go controllers.BlockDetails(i+(5*n)+1,i+(6*n),DB,Client)
		go controllers.BlockDetails(i+(6*n)+1,i+(7*n),DB,Client)
		go controllers.BlockDetails(i+(7*n)+1,i+(8*n),DB,Client)
		go controllers.BlockDetails(i+(8*n)+1,i+(9*n),DB,Client)
		go controllers.BlockDetails(i+(9*n)+1,i+(10*n),DB,Client)
		go controllers.BlockDetails(i+(10*n)+1,i+(11*n),DB,Client)
		go controllers.BlockDetails(i+(11*n)+1,i+(12*n),DB,Client)
		go controllers.BlockDetails(i+(12*n)+1,i+(13*n),DB,Client)
		go controllers.BlockDetails(i+(13*n)+1,i+(14*n),DB,Client)
		go controllers.BlockDetails(i+(14*n)+1,i+(15*n),DB,Client)
		go controllers.BlockDetails(i+(15*n)+1,i+(16*n),DB,Client)
		go controllers.BlockDetails(i+(16*n)+1,i+(17*n),DB,Client)
		go controllers.BlockDetails(i+(17*n)+1,i+(18*n),DB,Client)
		go controllers.BlockDetails(i+(18*n)+1,i+(19*n),DB,Client)
		go controllers.BlockDetails(i+(19*n)+1,i+(20*n),DB,Client)
		go controllers.BlockDetails(i+(20*n)+1,i+(21*n),DB,Client)
		go controllers.BlockDetails(i+(21*n)+1,i+(22*n),DB,Client)
		go controllers.BlockDetails(i+(22*n)+1,i+(23*n),DB,Client)
		go controllers.BlockDetails(i+(23*n)+1,i+(24*n),DB,Client)
		go controllers.BlockDetails(i+(24*n)+1,i+(25*n),DB,Client)
		go controllers.BlockDetails(i+(25*n)+1,i+(26*n),DB,Client)
		go controllers.BlockDetails(i+(26*n)+1,i+(27*n),DB,Client)
		go controllers.BlockDetails(i+(27*n)+1,i+(28*n),DB,Client)
		go controllers.BlockDetails(i+(28*n)+1,i+(29*n),DB,Client)
		go controllers.BlockDetails(i+(29*n)+1,i+(30*n),DB,Client)
		go controllers.BlockDetails(i+(30*n)+1,latestBlockNumber,DB,Client)


		go threads.Task(DB) // Running a parallel thread to get the updates
	}
	
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())

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

	app.Get("/transBlock/:id", func(c *fiber.Ctx) error { // Transaction details of queried block number
		return controllers.GetTransbyBlock(c, DB)
	})

	app.Get("/transCount", func(c *fiber.Ctx) error { // Total Transaction count
		return controllers.GetTotalTransactions(c, DB)
	})

	app.Get("/contractCount", func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GetContractCount(c, DB)
	})

	app.Get("/blockDetails", func(c *fiber.Ctx) error { // Total Contract Created
		return controllers.GettenBlockDetails(c, DB)
	})
	


	app.Listen(":" + os.Getenv("API_PORT"))

}
