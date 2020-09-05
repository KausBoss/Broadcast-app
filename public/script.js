let socket = io();

$('#loginBox').show();
$('#chatBox').hide();

$('#btnStart').click(() => {
	socket.emit('login', {
		username: $('#username').val()
	});
});

socket.on('loggedIn', () => {
	$('#loginBox').hide();
	$('#chatBox').show();
});

$('#btn').click(() => {
	socket.emit('msg_send', {
		to: $('#toUser').val(),
		msg: $('#inpMsg').val()
	});
});

socket.on('msg_rcvd', (data) => {
	$('#ulMsg').append($('<li>').text(data.msg));
});
