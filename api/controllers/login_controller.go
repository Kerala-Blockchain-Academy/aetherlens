package controllers

import (
	"fmt"
	"net/http"
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gofiber/fiber/v2"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"gorm.io/gorm"
	"time"
)

type LoginD struct {
	UserName string `gorm:"column:UserName"`
	Password string     `gorm:"column:Password"`
}

var secretKey = []byte("aether-lens")

func Register(c *fiber.Ctx, DB *gorm.DB)error{
	var newOne models.Register

	fmt.Println(c)
	err := c.BodyParser(&newOne)
	fmt.Println(newOne.Password)
	

	if(err!=nil){
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse request body",
		})
	}else{
		byt, err := bcrypt.GenerateFromPassword([]byte(newOne.Password), 14)
		if err!=nil{
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Bcrypt failed",
			})
		}
		newOne.Password = string(byt)
	}

	err1:= DB.Create(&newOne).Error
	if err1!=nil{
		return err1
	}else{
		return c.Status(http.StatusOK).JSON(fiber.Map{
			"message": "Registered successfully",
		})
	}	
}

func Login(c *fiber.Ctx, DB *gorm.DB)error{
	var login LoginD
	var register models.Register
	err1 := c.BodyParser(&login)

	if(err1!=nil){
		return c.Status(http.StatusBadRequest).JSON("Check the input")
	}

	err:= DB.Where("user_name=?",login.UserName).First(&register).Error
	if(err!=nil){
		return err
	}else{
		err := bcrypt.CompareHashAndPassword([]byte(register.Password), []byte(login.Password))
		if err != nil{
			return c.Status(http.StatusBadRequest).JSON("Check username or password")
		}else{
			token:=jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
				"username":register.UserName,
				"exp": time.Now().Add(time.Hour * 2).Unix(),
			})

			tokenString,err := token.SignedString(secretKey)
			if err!=nil{
				return c.Status(http.StatusForbidden).JSON("Something went wrong while token creation")
			}
			c.Cookie(&fiber.Cookie{
				Name:     "AuthToken",
				Value:    tokenString,
				Expires:  time.Now().Add(2 * time.Hour),
				HTTPOnly: true,
			})
			return c.Status(http.StatusOK).JSON("Successfully loggedin")
		}
	}
	

	
}