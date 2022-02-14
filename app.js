const express = require('express');
const http = require('http')
const osc = require('osc');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const socket = new WebSocket.Server({server});

console.clear();
console.log('\n	888b     d888888888888888888888888    d8888888b     d888 .d88888b. 8888888b. 8888888b. 888    888 .d88888b.  .d8888b.8888888 .d8888b.  ');
console.log('	8888b   d8888888           888       d888888888b   d8888d88P" "Y88b888   Y88b888   Y88b888    888d88P" "Y88bd88P  Y88b 888  d88P  Y88b ');
console.log('	88888b.d88888888           888      d88P88888888b.d88888888     888888    888888    888888    888888     888Y88b.      888  Y88b.      ');
console.log('	888Y88888P8888888888       888     d88P 888888Y88888P888888     888888   d88P888   d88P8888888888888     888 "Y888b.   888   "Y888b.   ');
console.log('	888 Y888P 888888           888    d88P  888888 Y888P 888888     8888888888P" 8888888P" 888    888888     888    "Y88b. 888      "Y88b. ');
console.log('	888  Y8P  888888           888   d88P   888888  Y8P  888888     888888 T88b  888       888    888888     888      "888 888        "888 ');
console.log('	888   "   888888           888  d8888888888888   "   888Y88b. .d88P888  T88b 888       888    888Y88b. .d88PY88b  d88P 888  Y88b  d88P ');
console.log('	888       8888888888888    888 d88P     888888       888 "Y88888P" 888   T88b888       888    888 "Y88888P"  "Y8888P"8888888 "Y8888P"  \n');

var serverip = os.networkInterfaces().en0[1].address;
console.log("Log onto this IP: http://" + serverip);

app.set("view engine", "pug");
app.set("index", path.join(__dirname+"/views/", "index.pug"));
app.set("play", path.join(__dirname+"/views/", "play.pug"));
app.set("login", path.join(__dirname+"/views/", "login.pug"));
app.set("wait", path.join(__dirname+"/views/", "wait.pug"));

const router = express.Router();
const ip = [];


////////////////////////////////////////////////////////////////////////////////
// ROUTING:
////////////////////////////////////////////////////////////////////////////////

// TODO: check if button has been pressed, add to ip-array
// res.render something else

router.get('/', function(req, res) {
	if (ip.length == 1){
		// serverip sends current server ip to client to use with websocket
		return res.render("play", {serverip: serverip});
	} else {
		return res.redirect("/login");
	}
});

router.get('/login', function(req, res) {
	if (ip.length == 0) {
		ip.push(req.ip);
		return res.redirect('/');
	} else if (ip.length > 0){
		return res.redirect('/wait');
	};
});

router.get('/logout', function(req, res) {
	ip.pop();
	return res.redirect('/login');
});

router.get('/wait', function(req, res) {
	setInterval(()=>{
		if (ip.length == 0) {
			return res.redirect('login');
		}
	}, 1e3);
});

app.use('/', router);

// must be after app.get for some reason, otherwise it wont log the IP of the user.
app.use(express.static('public'))

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
		} else if (msg[0] == "slider0") {
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
		} else if (msg[0] == "slider1") {
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

server.listen(process.env.PORT || 80, () => {
	let addr = server.address();
	console.log("Server started on port %s", addr.port);

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
