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

app.use('/', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//app.get('/users', function(req, res) {
//	listAllStudents(res);
//});

app.get('/user/:id', function(req, res) {
	getStudentById(req.params.id, res);
});

app.put('/fav/:id', function(req, res) {
	var classId = req.body.classId;
	var grade = req.body.grade;

	gradeEditAdd(req.params.id, classId, grade, res);

});

app.delete('/user/:id', function(req, res) {
	delStudentById(req.params.id, res);
});

app.delete('/fav/:id', function(req, res) {
	var classId = req.body.classId;
	delGrade(req.params.id, classId, res);
});

app.post('/users', function(req, res) {
	//var id = getNewId();
	var favs = req.body.favs;
	console.log(favs);

	insertStudent(favs, res);

	//res.json(req.body);
});

app.post('/class', function(req, res) {
	var id = getNewId();
	var name = req.body.name;
	console.log(id, name);

	insertClass(id, name, res);

	//res.json(req.body);
});



function listAllStudents(res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * from student', function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function getStudentsInClass(id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT name FROM student, grade WHERE class_id = $1 AND id = student_id', [id], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function getStudentGradesInClass(id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT name, grade FROM student, grade WHERE class_id = $1 AND id = student_id', [id], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function listAllClasses(res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * from class', function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function delGrade (id, classId, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('DELETE from grade where student_id = $1 AND class_id = $2', [id, classId], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function delStudentById (id, res) {
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

function delClassById (id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('DELETE from class where id = $1', [id], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function gradeEditAdd(id, classId, grade, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query(
			'insert into grade (student_id, class_id, grade) values ($1, $2, $3) ON CONFLICT on constraint student_class do update set grade = $3',
			[id, classId, grade],

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

function insertStudent(fav, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query(
			'insert into users (id) values ($1)',
			[fav],
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

function insertClass(id, name, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query(
			'insert into class (id, name) values ($1, $2)',
			[id, name],
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

function getStudentById(id, res) {
	pg.connect(conString, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT * from student where id = $1', [id], function(err, result) {
			done();

			if (err) {
				return console.error('error running query', err);
			}

			console.log(result.rows);

			res.json(result.rows);
		});
	});
}

function getNewId() {
	return uuid.v4();
}

console.log(getNewId());

var port = 3343;
app.listen(port, function() {
	console.log(`App listening on port ${port}...`);
});
