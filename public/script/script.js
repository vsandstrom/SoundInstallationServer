// TODO: make socket.io work
const io = new WebSocket("ws://localhost:80")

// TODO: change showCVal and showSVal to event listeners instead. 
var clickedSmudge = 0;

document.addEventListener('DOMContentLoaded', () => {

	var slider0 = document.getElementById('change');
	var slider1 = document.getElementById('size');
	var resetButton = document.getElementById('reset');
	var smudgeButton = document.getElementById('smudge');

	if(smudgeButton || slider0 || slider1 || resetButton) {
		alert("Welcome");
	};

	slider0.addEventListener("input", function(e) {
		let val = parseInt(e.target.value);

		// TODO: send value through websocket
		io.send(JSON.stringify(['slider0', {val}]));

		// updates value on website
		document.getElementById("cVal").innerHTML=e.target.value;
	});

	slider1.addEventListener("input", function(e) {
		let val = parseInt(e.target.value);

		// TODO: send value through websocket
		io.send(JSON.stringify(['slider1', {val}]));
		
		// updates value on website
		document.getElementById("sVal").innerHTML=e.target.value;
	});

	resetButton.addEventListener("mouseup", function(e) {
		let val = 1;
		
		// TODO: send value through websocket
		io.send(JSON.stringify(['reset', {val}]));
			
		if (e.target.innerHTML == 'stopReset') {
			e.target.innerHTML = 'Resetting';
		};

		// disables button for 1 second
		e.target.setAttribute("disabled", "disabled");
		setTimeout(function() {
			e.target.innerHTML = "stopReset"
			e.target.removeAttribute("disabled");
			val = 0;
			io.send(JSON.stringify(['reset', {val}]));
		}, 3e3);
	}, false);

	smudgeButton.addEventListener("click", function(e) {
		let val;
		if (clickedSmudge) {
			val = clickedSmudge;
			clickedSmudge = 0;
		} else {
			val = clickedSmudge;
			clickedSmudge = 1;
		};

		// TODO: send value through websocket
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
