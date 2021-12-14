const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const msgData = require('./utils/messages.js')
const {getUsersByRoom, addUser, findUserById, deleteUser} = require('./utils/state.js')

const app = express()
const server = http.createServer(app)
const host = socketio(server)
const HOST_NAME = 'ChatBot'

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

// On connection callback
host.on('connection', client => {
	//client joining the room
	client.on('joinRoom', ({nick, room}) => {
		//Add user to global user Set
		addUser(client.id, nick, room)
		//Using sockets 'push/join' user to room
		client.join(room)
		//HOST send private welcome message to client
		client.emit('message', msgData(HOST_NAME, `Welcome ${nick}, to chat! You joined ${room}`))
		//Broadcast to everybody else than socket
		//use .to() method to broadcast to specific room
		client.broadcast.to(room).emit('message', msgData(nick, `${nick} joined the chat!`))
		//set list of users in the room
		host.to(room).emit('populateUsersList', {
			room,
			usersInRoom: getUsersByRoom(room)
		})
	})

	//Listen to client on sendMsg after that host emit messages to users
	client.on('sendMsg', msg => {
		const user = findUserById(client.id)
		if (user) {
			const {nick, room} = user
			host.to(room).emit('message', msgData(nick, msg))
		}
	})

	//Client disconnection
	client.on('disconnect', () => {
		const user = findUserById(client.id)
		if (user) {
			const {nick, room} = user
			host.to(room).emit('message', msgData(HOST_NAME, `${nick} left the chat`))
			deleteUser(client.id)
			host.to(room).emit('populateUsersList', {
				room,
				usersInRoom: getUsersByRoom(room)
			})
		}
	})
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on ${PORT}`))
