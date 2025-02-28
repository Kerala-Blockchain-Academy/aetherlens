package controllers

import (
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

func TransAddressCheck(k *types.Transaction) string {

	if k.To() == nil {
		return "0x0"
	}

	return k.To().Hex()

}

func TransHashCheck(k *types.Transaction) string {
	if k.Hash() == (common.Hash{}) {
		return "0x0"
	}

	return k.Hash().Hex()
}

func TransTypeCheck(k *types.Transaction) uint8 {
	if k.Type() == 0 {
		return uint8(0)
	}

	return k.Type()
}

func TransValueCheck(k *types.Transaction) string {
	if k.Value() == nil {
		return "0x0"
	}
	return k.Value().String()
}
