      var socket = io();
	  
	  var username = window.prompt('Please enter your username')
	  var peer = new Peer(username, {key: 'lwjd5qra8257b9'});
	  
	  var initiate = document.getElementById('createBTN');
	  var body = document.getElementById('textBody');
	  var roomName = "";
	  var localvideo = document.getElementById('localVideo');
	  var remotevideo = document.getElementById('remoteVideo');
	  
	  var usernameBTN = document.getElementById('chooseName');

	  var callBTN = document.getElementById("call")
	  
	  usernameBTN.addEventListener('click', function(){
		  var username = document.getElementById('usernametxt').value;
		  updateNav(username);
		  peer.disconnect();
		var peer = new Peer(username, {key: 'lwjd5qra8257b9'});
		});
		
		function updateNav(username){
			  document.getElementById('usernameLbl').innerHTML = "  Name: " + username;
			  document.getElementById('alerts').innerHTML = '<div class="alert alert-dismissible alert-success">' + 
				  '<button type="button" class="close" data-dismiss="alert" id="closeAlert">&times;</button>' +
				  '<strong>welcome ' + username + ' Thanks for choosing a username!</strong>' +
				'</div>'
				
			  document.getElementById("closeAlert").addEventListener('click', function(){
				  document.getElementById('alerts').innerHTML = "";
			  })
		} 
					
					
	  var initatior = false;
	  
	  			
		var constraints = {video: true, audio: false};
	  
	  function handleSuccess(stream){
		  window.localstream = stream; // make variable available to browser console
			localvideo.srcObject = stream;
			
			callBTN.style.visibility = "visible";
	  }
	  
	  function handleError(){
		
	  }
	  
	  initiate.addEventListener('click', function(){
		window.room = prompt("Enter room name:");
		
		if(room != ""){
			socket.emit('createRoom', room);
		}
		else{
			alert("Please enter a valid room name");
		}
	  })
	  
	  socket.on('roomCB', function(data){
	  	//document.getElementById('noofclients').innerHTML = "There are " + data.noOfClients + " in the room."
		console.log(data);
		body.innerHTML = data.description;
		roomName = data.name;
	  })
	  
	  
	  socket.on('broadcast', function(data){
		document.getElementById('noofclients').innerHTML = "There are " + data + " in the room.";
	  })
	  
	  socket.on('created', function(){
		initatior = true;
		console.log(initatior);
	  })
	  
	  socket.on('welcomeMsg', function(data){
		body.innerHTML += '<br>' + data;
	  })
	  
	  socket.on('roomFull', function(data){
		//location.reload(true);
		alert(data);
		console.log(data);
		//body.innerHTML += '<br>' + data;
	  })
	  
	  socket.on('disconnect', function(data){
		body.innerHTML = 'There are ' + data + ' in the room';
	})
	 
	socket.on('getUserMedia', function(data){	
		if(data.initatior == 1){
			initatior = true;
		}else{
			initatior = false;
		}
	  	  	navigator.mediaDevices.getUserMedia(constraints).
			then(handleSuccess).catch(handleError);
	});

	
	/////////////////////////////////////////////
	
		peer.on('call', function(call){
		console.log('call revieved');
		call.answer(window.localstream);
		
		socket.emit('roomCheck', roomName);
		handleCall(call);
	})
	
	callBTN.addEventListener('click', function(){	
		var call = peer.call(otherId.value, window.localstream);
		console.log(otherId.value);
		handleCall(call);
	})
	
	function handleCall(call){
		console.log('handling call');
		call.on('stream', function(stream) {
			remotevideo.srcObject = stream;
			remotevideo.play();
		});
	}

	