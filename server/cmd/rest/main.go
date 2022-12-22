package rest

import (
	"btserver/cmd/btserver"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type set struct {
	Id          int    `json:"id"`
	SessionId   int    `json:"sessionId"`
	ExcerciseId int    `json:"exerciseId"`
	Weight      int    `json:"weight"`
	WeightUnit  string `json:"weightUnit"`
	Reps        int    `json:"reps"`
	Time        int    `json:"time"`
	TimeUnit    string `json:"timeUnit"`
}

func (s *set) toDomain() *btserver.SessionExerciseSet {
	return &btserver.SessionExerciseSet{
		Weight:     s.Weight,
		WeightUnit: s.WeightUnit,
		Reps:       s.Reps,
		Time:       s.Time,
		TimeUnit:   s.TimeUnit,
		Excercise: &btserver.Excercise{
			Id: s.ExcerciseId,
		},
		Session: &btserver.WorkoutSession{
			Id: s.SessionId,
		},
	}
}

type exercise struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func exerciseFromDomain(e *btserver.Excercise) *exercise {
	return &exercise{
		Id:          e.Id,
		Name:        e.Name,
		Description: e.Description,
	}
}

func (e *exercise) toDomain() *btserver.Excercise {
	return &btserver.Excercise{
		Id:          e.Id,
		Name:        e.Name,
		Description: e.Description,
	}
}

type Api struct {
	port            int
	gin             *gin.Engine
	TrainingService btserver.TrainingService
}

func httpError(msg string) gin.H {
	return gin.H{
		"error": msg,
	}
}

/*
TODOs
logging
move handler funcs to files
error messages and formatting?
*/
func BuildApi(port int) *Api {
	api := &Api{port: port}
	api.gin = gin.Default()

	routes := api.gin.Group("/api/v1")

	routes.POST("/exercises", func(ctx *gin.Context) {
		var e exercise
		err := ctx.ShouldBindJSON(&e)
		if err != nil {
			fmt.Println("POST /exercises - body parse", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't parse body"))
			return
		}

		id, err := api.TrainingService.CreateExercise(ctx, e.Name, e.Description)
		if err != nil {
			fmt.Println("POST /exercise - postgres create", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't insert exercise"))
			return
		}

		ctx.JSON(http.StatusCreated, id)
	})

	routes.GET("/exercises", func(ctx *gin.Context) {
		// fill in from q param later 8)
		f := &btserver.Filter{
			Skip:   0,
			Take:   20,
			Search: "",
			Order:  "asc",
		}

		exercises, err := api.TrainingService.Exercises(ctx, f)
		if err != nil {
			fmt.Println("GET /exercises - postgres get", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't get exercises"))
			return
		}

		response := make([]exercise, len(exercises))
		for i := range exercises {
			response[i] = *exerciseFromDomain(&exercises[i])
		}

		ctx.JSON(http.StatusOK, response)
	})

	routes.PUT("/exercises", func(ctx *gin.Context) {
		var e exercise
		err := ctx.ShouldBindJSON(&e)
		if err != nil {
			fmt.Println("PUT /exercises - body parse", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't parse body"))
			return
		}

		err = api.TrainingService.UpdateExercise(ctx, e.toDomain())
		if err != nil {
			fmt.Println("PUT /exercise - postgres update", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't update exercise"))
			return
		}

		ctx.Status(http.StatusOK)
	})

	routes.POST("/sessions", func(ctx *gin.Context) {
		type carrier struct {
			SessionAt time.Time `json:"sessionAt"`
		}
		var s carrier
		err := ctx.ShouldBindJSON(&s)

		if err != nil {
			fmt.Println("POST /sessions - body parse", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't parse body"))
			return
		}

		id, err := api.TrainingService.CreateSession(ctx, s.SessionAt)
		if err != nil {
			fmt.Println("POST /sessions - postgres create", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't create session"))
			return
		}

		ctx.JSON(http.StatusCreated, id)
	})

	routes.POST("/sets", func(ctx *gin.Context) {
		var set set
		err := ctx.ShouldBindJSON(&set)
		if err != nil {
			fmt.Println("POST /sets - body parse", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't parse body"))
			return
		}

		id, err := api.TrainingService.CreateSet(ctx, set.toDomain())
		if err != nil {
			fmt.Println("POST /sets - create set", err.Error())
			ctx.AbortWithStatusJSON(http.StatusBadRequest, httpError("Couldn't create set"))
			return
		}

		ctx.JSON(http.StatusCreated, id)
	})

	return api
}

func (api *Api) Run() {
	api.gin.Run(fmt.Sprintf("127.0.0.1:%d", api.port))
}
