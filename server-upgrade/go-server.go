package main

import (
    "net"
    "bufio"
    "strconv"
    "fmt"
	"math/rand"
	"time"
)

const PORT = 8000

func main() {
    server, err := net.Listen("tcp", ":" + strconv.Itoa(PORT))
    if server == nil {
        panic("couldn't start listening: " + err.Error())
    }
    conns := clientConns(server)
    for {
        go handleConn(<-conns)
    }
}

func clientConns(listener net.Listener) chan net.Conn {
    ch := make(chan net.Conn)
    go func() {
        for {
            client, err := listener.Accept()
            if client == nil {
                fmt.Printf("couldn't accept: " + err.Error())
                continue
            }
            ch <- client
        }
    }()
    return ch
}

func handleConn(client net.Conn) {
    b := bufio.NewReader(client)
    for {
        _, err := b.ReadBytes('\n')
        if err != nil {
            break
        }
		time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)	// for long lived connection
        client.Write([]byte("Hi!"))
    }
}