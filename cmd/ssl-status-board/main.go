package main

import (
	"flag"
	"github.com/RoboCup-SSL/ssl-status-board/pkg/board"
	"github.com/gobuffalo/packr"
	"log"
	"net/http"
)

func main() {
	var config = board.DefaultConfig()
	var address = flag.String("address", config.ListenAddress, "The address on which the UI and API is served")
	var refereeAddress = flag.String("refereeAddress", config.RefereeConnection.MulticastAddress, "The multicast address of ssl-game-controller")
	flag.Parse()

	config.ListenAddress = *address
	config.RefereeConnection.MulticastAddress = *refereeAddress

	refereeBoard := board.NewBoard(config.RefereeConnection)
	go refereeBoard.HandleIncomingMessages()
	http.HandleFunc(config.RefereeConnection.SubscribePath, refereeBoard.WsHandler)

	setupUi(config.ListenAddress)

	err := http.ListenAndServe(config.ListenAddress, nil)
	if err != nil {
		log.Fatal(err)
	}
}

func setupUi(listenAddress string) {
	box := packr.NewBox("../../dist")
	http.Handle("/", http.FileServer(box))
	if box.Has("index.html") {
		log.Printf("UI is available at http://%v", listenAddress)
	} else {
		log.Print("Backend-only version started. Run the UI separately or get a binary that has the UI included")
	}
}
