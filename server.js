var pg = require('pg');
var uuid = require('uuid');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var conString = "postgres://krisw:Password1!@krisdb.comteudljjgz.us-west-2.rds.amazonaws.com:5432/krisDB";

var client = new pg.Client(conString);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.set('json spaces', 2);

app.use('/', express.static(__dirname + '/client/storeApp/www'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/favs/:id', function(req, res) {
	var id=req.params.id;
	getFavsById(id, res);
});

app.post('/postfavs', function(req, res) {
	var favs=JSON.stringify(req.body.favs);
	var id= req.body.id;

	updateFav(favs, id, res);
	console.log('updating database of favs');
});

function updateFav(favs, id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query(
			'insert into users (id, favs) values ($1, $2) ON CONFLICT on constraint id_check do update set favs = $2',
			[id, favs],
			function(err, result) {
				done();
				if (err) {
					return console.error('error running query', err);
				}
				console.log(result.rows);
				res.json(result.rows);
			});
	});
}

function getFavsById(id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * from users where id = $1', [id], function(err, result) {
			done();
			if (err) {
				return console.error('error running query', err);
			}
			console.log(result.rows);
			res.json(result.rows);
		});
	});
}

function deleteFavsById(id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('DELETE from student where id = $1', [id], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

var port = process.env.PORT || 3343;
app.listen(port, function() {
	console.log(`App listening on port ${port}...`);
});
