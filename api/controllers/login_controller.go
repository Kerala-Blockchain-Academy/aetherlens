package controllers

import (
	"net/http"
	"time"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/pglekshmi/explorerGoPostgreSQL/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type LoginD struct {
	UserName string `gorm:"column:UserName"`
	Password string `gorm:"column:Password"`
}

var secretKey = []byte("aether-lens")

func Register(c *fiber.Ctx, DB *gorm.DB) error {
	newOne := []models.Register{
		{Name: "Lekshmi", UserName: "Admin", Password: "123"},
		{Name: "Anju", UserName: "Admin1", Password: "456"},
		{Name: "Sumi", UserName: "Admin2", Password: "789"},
	}

	for _, admin := range newOne {
		byt, err1 := bcrypt.GenerateFromPassword([]byte(admin.Password), 14)
		if err1 != nil {
			continue
		}
		fmt.Println(byt)
		admin.Password = string(byt)

		var existing models.Register
		err := DB.First(&existing, "user_name = ?", admin.UserName).Error
		if err == gorm.ErrRecordNotFound {
			if err := DB.Create(&admin).Error; err != nil {
				// log.Println("Error inserting user:", u.UserName, err)
				c.Status(http.StatusBadRequest).JSON("Error inserting user")
			} else {
				c.Status(http.StatusOK).JSON("User inserted")
			}
		} else {
			c.Status(http.StatusBadRequest).JSON("User already exist")
		}
	}
	return nil
}

func Login(c *fiber.Ctx, DB *gorm.DB) error {
	fmt.Println("Welcome to login");
	var login LoginD
	var register models.Register
	err1 := c.BodyParser(&login)

	if err1 != nil {
		return c.Status(http.StatusBadRequest).JSON("Check the input")
	}

	err := DB.Where("user_name=?", login.UserName).First(&register).Error
	fmt.Println(register)
	if err != nil {
		return err
	} else {
		err := bcrypt.CompareHashAndPassword([]byte(register.Password), []byte(login.Password))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON("Check username or password")
		} else {
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"username": register.UserName,
				"exp":      time.Now().Add(time.Hour * 2).Unix(),
			})

			tokenString, err := token.SignedString(secretKey)
			fmt.Println("Token Generated",tokenString)
			if err != nil {
				return c.Status(http.StatusForbidden).JSON("Something went wrong while token creation")
			}
			c.Cookie(&fiber.Cookie{
				Name:     "AetherToken",
				Value:    tokenString,
				Expires:  time.Now().Add(2 * time.Hour),
				HTTPOnly: true,
				Secure: false,
				SameSite: "None",             // explicitly allow cross-site use
  			    Path:     "/",  
			})
			return c.Status(http.StatusOK).JSON("Successfully loggedin")
		}
	}

}

func Logout(c *fiber.Ctx,DB *gorm.DB) error{
	c.Cookie(&fiber.Cookie{
        Name:     "AetherToken",     // <-- match the original cookie name
        Value:    "",
        Expires:  time.Now().Add(-1 * time.Hour),
        HTTPOnly: true,
        Secure:   false,             // only if you're using HTTPS
        SameSite: "None",
        Path:     "/",              // must match how it was set
    })

	return c.Status(http.StatusOK).JSON("Succesfully Loggedout")
}
