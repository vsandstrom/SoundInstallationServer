// TODO: Change IP to the current server
//
const io = new WebSocket("ws://10.10.40.245:80")
// const io = new WebSocket("ws://192.168.1.2:80")
// const io = new WebSocket("ws://10.10.40.47:80")
// const io = new WebSocket("ws://89.253.91.4:8887")

// TODO: change showCVal and showSVal to event listeners instead. 
var clickedSmudge = 0;

document.addEventListener('DOMContentLoaded', () => {

	var slider0 = document.getElementById('change');
	var slider1 = document.getElementById('size');
	var resetButton = document.getElementById('reset');
	var smudgeButton = document.getElementById('smudge');
	var login = document.getElementById('login');
	var logout = document.getElementById('logout');

	// Add addEventListener to each object on webpage
	if (slider0){
		slider0.addEventListener("input", function(e) {
			let val = parseInt(e.target.value);

			// send value through websocke	// Add addEventListener to each object on webpaget
			io.send(JSON.stringify(['slider0', {val}]));

			// updates value on website in <span id="cVal">
			document.getElementById("cVal").innerHTML=e.target.value;
		});
	};

	if (slider1){
		slider1.addEventListener("input", function(e) {
			let val = parseInt(e.target.value);

			// send value through websocket
			io.send(JSON.stringify(['slider1', {val}]));

			// updates value on website in <span id="sVal">
			document.getElementById("sVal").innerHTML=e.target.value;
		});
	}

	if (resetButton){
		resetButton.addEventListener("mouseup", function(e) {
			let val = 1;
			
			// send value through websocket
			io.send(JSON.stringify(['reset', {val}]));
				
			if (e.target.innerHTML == 'stopReset') {
				e.target.innerHTML = 'Resetting';
			};

			// disables button for 1 second
			e.target.setAttribute("disabled", "disabled");
			setTimeout(function() {
				e.target.innerHTML = "stopReset"
				e.target.removeAttribute("disabled");

				// button trigger delay
				val = 0;
				io.send(JSON.stringify(['reset', {val}]));
			}, 0.5e3);
		}, false);
	};

	if (smudgeButton){
		smudgeButton.addEventListener("mouseup", function(e) {
			let val;

			// toggle values sent to websocket
			// TODO: let server handle, so that the GUI follows what happens in SC, not the users personal interface. if
			// smudge is on, it should show
			if (clickedSmudge) {
				val = clickedSmudge;
				clickedSmudge = 0;
			} else {
				val = clickedSmudge;
				clickedSmudge = 1;
			};

			// send value through websocket
			io.send(JSON.stringify(['smudge', {val}]));

			// disables button for 1 second
			e.target.setAttribute("disabled", "disabled");

			setTimeout(function() {
				// toggle button and button innerHTML
				if (e.target.innerHTML == 'smudgeOn') {
					e.target.innerHTML = 'smudgeOff';
				} else {
					e.target.innerHTML = 'smudgeOn';
				};

				// enable clickable
				e.target.removeAttribute("disabled");
			}, 1e3);

		}, false);
	};

	if (login){
		login.addEventListener("mouseup", function(e) {
			// TODO:
			console.log("yooo");
			io.send(JSON.stringify(['login', true]))


		});
	};

	if (logout){
		logout.addEventListener("mouseup", function(e) {
			// TODO:
			io.send(JSON.stringify(['login', false]));

		});
	};
	



	// resetButton.oninput(function() {
	// 	if(clicked != true){
	// 		alert(smudgeButton.value);
	// 		// socket.emit("reset", smudgeButton.value);
	// 		clicked = true;
	// 		setTimeout(function(){
	// 			clicked = false;
	// 		}, 1000);
	// 	};

	// });

})
