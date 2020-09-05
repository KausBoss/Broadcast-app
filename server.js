const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');

app.use('/', express.static(__dirname + '/public'));
const io = socketio(server);

let users = {};
let socketMap = {};

io.on('connection', (socket) => {
	console.log('Connnected with socket id', socket.id);

	function login(s, u) {
		s.join(u);
		s.emit('loggedIn');
		socketMap[s.id] = u;
	}

	socket.on('login', (data) => {
		if (users[data.username]) {
			if (users[data.username] == data.password) {
				login(socket, data.username);
			} else {
				socket.emit('login_failed');
			}
		} else {
			users[data.username] = data.password;
			login(socket, data.username);
		}
	});

	socket.on('msg_send', (data) => {
		data.from = socketMap[socket.id];
		if (data.to) {
			io.to(data.to).emit('msg_rcvd', data);
		} else {
			socket.broadcast.emit('msg_rcvd', data);
		}
	});

	// socket.on('msg_send', (data) => {
	// 	io.emit('msg_rcvd', data); --> to everyone including self
	// 	// io.emit('msg_rcvd', data); --> send to the same client
	// 	// socket.broadcast.emit('msg_rcvd', data) --> sends to all other client but not to self
	// });
});

const SERVER_PORT = process.env.PORT || 3333;

server.listen(SERVER_PORT, () => {
	console.log('Server started on http://localhost', SERVER_PORT);
});
