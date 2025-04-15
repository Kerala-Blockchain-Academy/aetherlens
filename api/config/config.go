package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
	
)

func ConnectNode() (*ethclient.Client, error) {
	// if err:=godotenv.Load(); err!=nil{
	// 	fmt.Println("Cannot get the env file")
	// }
	
	url := os.Getenv("CHAIN_URL")
	
	fmt.Println(url)
	client, err := ethclient.Dial(url)
	fmt.Println(err)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to Ethereum node: %w", err)
	}
	_, err = client.BlockNumber(context.Background())
	
	if err != nil {
		return nil, fmt.Errorf("ethereum node is unreachable: %w", err)
	}

	return client, nil

}

func RetryConnectNode(maxRetries int, delay time.Duration) (*ethclient.Client, error) {
	var client *ethclient.Client
	var err error

	for i := 1; i <= maxRetries; i++ {
		client, err = ConnectNode()
		
		if client != nil {
			fmt.Println("Successfully connected to node!")
			return client, nil
		}

		log.Printf("Attempt %d: Failed to connect. Retrying in %v...\n", i, delay)
		time.Sleep(delay) // Wait before retrying
		delay *= 2        // Exponential backoff (double the delay)
	}

	return nil, fmt.Errorf("failed to connect after %d attempts: %v", maxRetries, err)
}
