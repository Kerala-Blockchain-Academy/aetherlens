package config

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
)

func ConnectNode()(*ethclient.Client,error){
	url := "http://127.0.0.1:8545"

	client,err:= ethclient.Dial(url)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to Ethereum node: %w", err)
	}
	fmt.Println(err)
	_, err = client.BlockNumber(context.Background())
	fmt.Println("client error",err)
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
		fmt.Println("client",err)
		
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