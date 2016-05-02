'use strict';

//setInterval(function() {
//	getJson('/api/time').then(data => {
//		document.getElementById('container').innerHTML = data.time;
//	});
//}, 1000);

var socket = io.connect('http://10.0.112.162:3000');

document.addEventListener('mousemove', function(event) {

	//console.log(event.x, event.y);
	socket.emit('mousemove', {
		x: event.x,
		y: event.y
	})

});

socket.on('time', function (data) {

	document.getElementById('container').innerHTML = data.time;
	//console.log(data);
	//socket.emit('display time', {
	//	my: 'data'
	//});

});

socket.on('clientmousemove', function (data) {

	console.log('clientmousemove', data);
	

});

function getJson(endpoint) {
	return window.fetch(endpoint).then(response => {
		return response.json()
	});
}