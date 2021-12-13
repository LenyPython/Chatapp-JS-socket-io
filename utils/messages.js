const moment = require('moment')

const msgData = (user, message) => {
	return {
		user,
		message,
		time: moment().format('h:mm')
	}
}

module.exports = msgData
