const msgForm = document.querySelector('.msg-container')
const msgInput = document.querySelector('#msg-input')


const client = io()

client.on('message', msg => {
	console.log(`Client reciving msg: ${msg}`)
})

msgForm.addEventListener('submit', (e) => {
	e.preventDefault()

	const msg = msgInput.value
	console.log(`Client sending msg: ${msg}`)
	client.emit('sendMsg', msg)
})
