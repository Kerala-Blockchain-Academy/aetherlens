package middleware

import (
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("aether-lens")

func VerifyToken(c *fiber.Ctx) error {
	tokenString := c.Cookies("AetherToken")
	fmt.Println("token", tokenString)

	if tokenString == "" {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"msg": "No Token Found"})
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return secretKey, nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
	if err != nil {
		fmt.Println(err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		fmt.Println(claims)
		c.Locals("username", claims["username"].(string))
		return c.Next()
	} else {
		fmt.Println(err)
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"msg": "Unauthorized access"})
	}

	
}
