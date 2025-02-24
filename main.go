package main

import (
	"fmt"
	"log"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/pglekshmi/explorerGoPostgreSQL/controllers"
	"github.com/pglekshmi/explorerGoPostgreSQL/db"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"github.com/pglekshmi/explorerGoPostgreSQL/threads"
)

func main() {
	DB,err := db.Connect()
	if err!= nil{
		fmt.Println("Cannot connect to DB")
	}
	
	if err := DB.AutoMigrate(&models.Block{},&models.Transaction{},&models.TransCount{},models.Contract_call{}); err != nil {
		fmt.Println("Error in AutoMigrate:", err)
		log.Fatal(err)
	} else {
		fmt.Println("AutoMigrate successful!")
	}

	controllers.BlockDetails(DB)
	
	
	go threads.Task(DB)
	// go threads.BlockQuery(DB)
	app := fiber.New()
	app.Use(logger.New())

	app.Get("/today",func(c *fiber.Ctx)error {
		return controllers.GetdailyCount(c,DB)
	})

	app.Get("/tenday",func(c *fiber.Ctx)error {
		return controllers.GetlasttenCount(c,DB)
	})
	
	app.Get("/blocks",func(c *fiber.Ctx)error{
		return controllers.Get20Blocks(c,DB)
	})

	app.Get("/block/:id",func(c *fiber.Ctx)error{
		return controllers.GetBlockbyNymber(c,DB)
	})

	app.Get("/trans",func(c *fiber.Ctx)error{
		return controllers.Get20Transactions(c,DB)
	})

	app.Get("/trans/:id",func(c *fiber.Ctx)error{
		return controllers.GetTransbyHash(c,DB)
	})

	app.Get("/transCount",func(c *fiber.Ctx)error{
		return controllers.GetTotalTransactions(c,DB)
	})

	app.Get("/contractCount",func(c *fiber.Ctx)error{
		return controllers.GetContractCount(c,DB)
	})
	// fmt.Println(blocks.Body().Transactions[0].Hash())
	// var lastBlock models.Block
	// if err := DB.Last(&lastBlock).Error; err!=nil{
	// 	log.Fatalln("No entry on Block DB")
	// }
	// fmt.Println("Latest Block",lastBlock.Number)
	
	
	

	
	
	app.Listen(":8080")

}
