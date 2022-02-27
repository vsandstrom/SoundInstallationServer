const express = require('express');
const http = require('http')
const osc = require('osc');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const socketServer = new WebSocket.Server({noServer: true});

console.clear();
console.log('METAMORPHOSIS\n');

const serverIP = os.networkInterfaces().en0[1].address;
// console.log("http://"+serverIP);

// Use vue front-end
app.use(express.static('app/dist/'))

var udpPort = new osc.UDPPort({
	localAddress: "127.0.0.1", // default listen port
	localPort: 57122,
	remoteAddress: "127.0.0.1",
	// remoteAddress: "192.168.1.12",
	remotePort: 57120,
	metadata: true
});

udpPort.open();


let socketConnection = undefined
// working websocket connection
// server.handleUpgrade(req, socket, header)
server.on('upgrade', (req, socket, head) => {
	if(socketConnection){
		console.log('Failed upgrade!!!');
		socket.write('fuck you');
		socket.destroy();
		return;
	}
  // This function is not defined on purpose. Implement it with your own logic.
	socketServer.handleUpgrade(req, socket, head, (ws) => {
		socketServer.emit('connection', ws);
	})

});


socketServer.on('connection', (ws) => {
	if(socketConnection){
		console.log('kopplingsförsök ej tillåtet. Stänger');
		ws.close();
		return;
	}

	ws.on('close', () =>{
		socketConnection = undefined;
		console.log('klient stängde koppling');
	})
	//Lets assign the connection so we know it is occupied
	socketConnection = ws;
	console.log('kopplingsförsök tillåtet!');
	ws.on('message', (message) => {
		msg = JSON.parse(message);
		if (msg[0] == "reset") {
			console.log(msg);

			let oscmsg = {
				address: "/reset",
				args: [
					{
						type: "i",
						value: msg[1].val
					}
				]
			};
			udpPort.send(oscmsg);


		} else if (msg[0] == "smudge") {
			console.log(msg);

			let oscmsg = {
				address: "/smudge",
				args: [
					{
						type: "i",
						value: msg[1].val
					}
				]
			};
			udpPort.send(oscmsg);
		} else if (msg[0] == "changes") {
			console.log(msg);

			let oscmsg = {
				address: "/slider0",
				args: [
					{
						type: "i",
						value: msg[1].val
					}
				]
			};
			udpPort.send(oscmsg);
		} else if (msg[0] == "size") {
			console.log(msg);

			let oscmsg = {
				address: "/slider1",
				args: [
					{
						type: "i",
						value: msg[1].val
					}
				]
			};
			udpPort.send(oscmsg);
		} else if (msg[0] == "login") {
			let val = msg[1];
			login = val;
			console.log(typeof(msg[1]));

		} else {
			// catch all if wrong values are transmitted
			console.log('recieved: %s', msg[0]);
			ws.send(`Hello, you sent -> ${msg}`);

		}
	})
});

server.listen(process.env.PORT || 8080, () => {
	let addr = server.address();
	console.log("Server located at:")
	console.log(`http://${serverIP}:${addr.port}`);

});

// ----------------------------------------
// Testing OSC transmission to SC
// ----------------------------------------

// setInterval( function() {
// 	var msg = {
// 		address: "/change",
// 		args: [
// 			{
// 				type: "i", 
// 				value: Math.random()
// 			}
// 		]
// 	};
// 	console.log("Sending message", msg.address, msg.args, udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
// 	udpPort.send(msg);
// }, 1000 );


// udpPort.on("ready", function (){
// 	udpPort.send({
// 		address: "/change", // valid osc destination at reciever computer
// 		args: [
// 			{
// 				type: "f", // read up on osc structure
// 				value: "default"
// 			},
// 			{
// 				type: "i",
// 				value: 100
// 			}
// 		]
// 	}, "127.0.0.1, 57110"); // address to reciever.
// });
