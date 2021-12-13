const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const msgData = require('./utils/messages.js')

const app = express()
const server = http.createServer(app)
const host = socketio(server)
const HOST_NAME = 'ChatBot'

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

// On connection callback
host.on('connection', client => {
	//client joining the room
	client.on('joinRoom', ({username, room}) => {
		//HOST send private welcome message to client
		client.emit('message', msgData(HOST_NAME, `Welcome to chat! You joined ${room}`))
		//Broadcast to everybody else than socket
		client.broadcast.emit('message', msgData(username, `${username} joined the chat!`))

	})

	//Listen to client on sendMsg after that host emit messages to users
	client.on('sendMsg', msg => {
		host.emit('message', msgData(client.id, msg))
	})

	//Client disconnection
	client.on('disconnect', () => {
		host.emit('message', msgData(HOST_NAME, `${client.id} left the chat`))
	})
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
