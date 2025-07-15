package middleware

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func VerifyAdmin(c *fiber.Ctx) error {
	username := c.Locals("username").(string)

	if username == "Admin" || username == "Admin1" || username == "Admin2" {
		return c.Next()
	}
	return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"msg": "Unauthorized User"})
}
