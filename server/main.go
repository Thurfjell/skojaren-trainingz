package main

import (
	"btserver/cmd/postgres"
	"btserver/cmd/rest"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln(err.Error())
	}

	pool, err := postgres.Pool(os.Getenv("POSTGRES_URL"))
	if err != nil {
		log.Fatalln(err.Error())
	}

	trainingService := postgres.BuildTrainingService(pool)

	api := rest.BuildApi(1337)
	api.TrainingService = trainingService

	api.Run()
}
