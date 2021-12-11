const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const host = socketio(server)

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

// On connection callback
host.on('connection', client => {
	client.emit('message', 'Welcome to chat')
	console.log(`${client.id} connected`)


	//Broadcast to everybody else than socket
	client.broadcast.emit('message', `${client.id} joined the chat!`)

	//Client disconnection
	client.on('disconnect', () => {
		host.emit('message', `${client.id} left the chat`)
	})

	//Listen to clien on sendMsg and host emit msgs to users
	client.on('sendMsg', msg => {
		console.log(`Host recieved msg: ${msg}`)
		host.emit('message', msg)
	})

})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
