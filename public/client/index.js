const msgForm = document.querySelector('.msg-container')
const msgInput = document.querySelector('#msg-input')
const msgOutput = document.getElementById('messages-output')
const usersListEl = document.getElementById('users-list')
const roomName = document.getElementById('room-name')

const params = new URLSearchParams(window.location.search)

const nick = params.get('username')
const room = params.get('chat-room')

const client = io()

client.emit('joinRoom', {nick, room})

client.on('message', msg => {
	displayMessage(msg)
	const container = document.getElementById('messsages-container')
	container.scrollTop = container.scrollHeight
})

client.on('populateUsersList', ({room, usersInRoom}) => {
	setRoomName(room)
	populateList(usersInRoom)
})

msgForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const msg = msgInput.value
	//send message to the host
	client.emit('sendMsg', msg)
	//clear message
	msgInput.value = ''
})

const setRoomName = room => roomName.innerText = `Room: ${room}`


const populateList = (list) => {
	usersListEl.innerHTML = `
	${list.map(user => `<li>${user.nick}</li>`).join('')}
	`
}

const displayMessage = (msg) => {
	let msgElement = document.createElement('li')
	msgElement.innerHTML = Message(msg)
	msgOutput.appendChild(msgElement)
}


const Message = (msg) => {
	const {user, time, message} = msg
	return (
		`
		<div class='msg'>
		<p><b>${user}</b> ${time}</p>
		<p class='msg-text'>${message}</p>
		</div>
	`
	)
}
