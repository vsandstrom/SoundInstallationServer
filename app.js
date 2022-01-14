
const express = require('express');
const http = require('http')
const osc = require('osc');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const socket = new WebSocket.Server({server});

app.set("view engine", "pug");
app.set("index", path.join(__dirname+"/public/", "index"));

const router = express.Router();

router.get('/', (req, res) => {
	res.render("index");
});

app.use('/', router);



var udpPort = new osc.UDPPort({
	localAddress: "127.0.0.1", // default listen port
	localPort: 57122,
	remoteAddress: "127.0.0.1",
	// remoteAddress: "192.168.1.12",
	remotePort: 57120,
	metadata: true
});

udpPort.open();

// working websocket connection
socket.on('connection', (ws) => {
	ws.on('message', (message) => {
		msg = JSON.parse(message);

		if (msg[0] == "reset") {
			console.log(msg);

			let oscmsg = {
				address: "/reset",
				args: [
					{
						type: "i",
						value: msg[1]['val']
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
						value: msg[1]['val']
					}
				]
			};
			udpPort.send(oscmsg);
		} else if (msg[0] == "slider0") {
			console.log(msg);

			let oscmsg = {
				address: "/slider0",
				args: [
					{
						type: "i",
						value: msg[1]['val']
					}
				]
			};
			udpPort.send(oscmsg);
		} else if (msg[0] == "slider1") {
			console.log(msg);

			let oscmsg = {
				address: "/slider1",
				args: [
					{
						type: "i",
						value: msg[1]['val']
					}
				]
			};
			udpPort.send(oscmsg);
		} else {
			// catch all if wrong values are transmitted
			console.log('recieved: %s', msg[0]);
			ws.send(`Hello, you sent -> ${msg}`);

		}
	})
});

app.get

server.listen(process.env.PORT || 80, () => {
	let addr = server.address();
	console.log("Server started on port %s", addr.port);

});

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
// 		address: "/change", // valid osc destination ad reciever computer
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
