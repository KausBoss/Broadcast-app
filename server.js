const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');

app.use('/', express.static(__dirname + '/public'));
const io = socketio(server);

let users = {};

io.on('connection', (socket) => {
	console.log('Connnected with socket id', socket.id);

	socket.on('login', (data) => {
		if (users[data.username]) {
			if (users[data.username] == data.password) {
				socket.join(data.username);
				socket.emit('loggedIn');
			} else {
				socket.emit('login_failed');
			}
		} else {
			users[data.username] = data.password;
			socket.join(data.username);
			socket.emit('loggedIn');
		}
	});

	socket.on('msg_send', (data) => {
		if (data.to) {
			io.to(data.to).emit('msg_rcvd', data);
		} else {
			socket.broadcast.emit('msg_rcvd', data);
		}
	});

	// socket.on('msg_send', (data) => {
	// 	io.emit('msg_rcvd', data);
	// 	// io.emit('msg_rcvd', data); --> send to the same client
	// 	// socket.broadcast.emit('msg_rcvd', data) --> sends to all other client but not to self
	// });
});

server.listen(4444, () => {
	console.log('Server started on http://localhost:4444');
});
