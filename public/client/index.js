const msgForm = document.querySelector('.msg-container')
const msgInput = document.querySelector('#msg-input')
const msgOutput = document.getElementById('messages-output')

const params = new URLSearchParams(window.location.search)

const username = params.get('username')
const room = params.get('chat-room')

console.log(username, room)

const client = io()

client.emit('joinRoom', {username, room})

client.on('message', msg => {
	displayMessage(msg)
	const container = document.getElementById('messsages-container')
	container.scrollTop = container.scrollHeight
})

msgForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const msg = msgInput.value
	//send message to the host
	client.emit('sendMsg', msg)
	//clear message
	msgInput.value = ''
})



const displayMessage = (msg) => {
	let msgElement = document.createElement('li')
	msgElement.innerHTML = Message(msg)
	msgOutput.appendChild(msgElement)
}


const Message = (msg) => {
	const {user, time, message} = msg
	return (
		`
	<p><b>${user}</b> ${time}</p>
	<p>${message}</p>
	`
	)
}
