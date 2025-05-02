package models

type TransCount struct {
	Timestamp     uint64 `json:"Timestamp"`
	BlockNumber   uint64 `json:"Number"`
	Count         int64  `json:"Count"`
	ContractCount int    `json:"ContractCount"`
}
