
let activeUsers = {}

const addUser = (id, nick, room) => {
	activeUsers[id] = {nick, room}
}

const deleteUser = (id) => delete activeUsers[id]

const findUserById = (id) => activeUsers[id]

const getUsersByRoom = (room) => {
	let usersFromRoom = []
	for (let key in activeUsers) {
		const user = activeUsers[key]
		if (user.room === room) usersFromRoom.push(user)
	}
	return usersFromRoom
}

module.exports = {
	addUser,
	deleteUser,
	findUserById,
	getUsersByRoom
}
