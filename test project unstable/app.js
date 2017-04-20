//npm packages
var express = require('express')(); //()
var serveStatic = require('serve-static');
var http = require('http').Server(express);
var io = require('socket.io')(http);
//var SimplePeer = require('simple-peer');
//var wrtc = require('wrtc')

//app.use(express.static('js'));
//server root directory
express.get('/', function(req, res){
  res.sendfile('main.html');
  //res.sendfile(__dirname + '/js/client.js');
});

//express.use(serveStatic(__dirname, {'main': ['main.html', 'main.htm']}))

express.use(serveStatic(__dirname, {'index': ['main.html', 'main.htm']}))

var roomName = [];

io.on('connection', function(socket){
	console.log('User Connected');
	socket.on('createRoom', function(data){
	socket.join(data);
	if(io.nsps['/'].adapter.rooms[data] && io.nsps['/'].adapter.rooms[data].length == 1){
		var clients = io.nsps['/'].adapter.rooms[data].length;
		socket.to(data).emit('welcomeMsg', 'User joined your room');
		socket.emit('created');
		socket.emit('roomCB', {description: 'Joined Room "' + data + '"', id: socket.id, name: data});
		io.sockets.in(data).emit('broadcast', clients);
		socket.emit('getUserMedia', {initiator: 1, id: socket.id});
	}
	else if(io.nsps['/'].adapter.rooms[data] && io.nsps['/'].adapter.rooms[data].length < 3){
		var clients = io.nsps['/'].adapter.rooms[data].length;
		socket.to(data).emit('welcomeMsg', 'User joined your room');
		socket.emit('roomCB', {description: 'Joined Room "' + data + '"', id: socket.id, name: data});
		io.sockets.in(data).emit('broadcast', clients);
		socket.emit('getUserMedia', 2, socket.id);
	}else{
		socket.emit('roomFull', 'Room ' + data + ' is full!');
	}
	
	socket.on('roomCheck', function(name){
		roomName.push(name);
		
		if(roomName.length = 2){
			if(roomName[0] != roomName[1]){
				socket.emit('wrongRoom');
			}
		}
	})
	
	
})
  socket.on('disconnect', function(){
	socket.emit('disconnectCB');
  });
})


http.listen(3000, function(){
  console.log('listening on *:3000');
});

