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
	
	if err := DB.AutoMigrate(&models.Block{},&models.Transaction{},&models.TransCount{}); err != nil {
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
	

	
	// fmt.Println(blocks.Body().Transactions[0].Hash())
	// var lastBlock models.Block
	// if err := DB.Last(&lastBlock).Error; err!=nil{
	// 	log.Fatalln("No entry on Block DB")
	// }
	// fmt.Println("Latest Block",lastBlock.Number)
	
	
	

	
	
	app.Listen(":8080")

}
