

var pg = require('pg');
var uuid = require('uuid');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
			console.log('finished updating database');
			console.log(result.rows);
			res.json(result.rows);
		});
	});
}

//Error Handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

var port = process.env.PORT || 3343;
app.listen(port, function() {
	console.log(`App listening on port ${port}...`);
});


///////////////////
// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
		clientID: "709043704384-n42oicqdt6bbm6jejr6dgq26nf1vkff5.apps.googleusercontent.com",
		clientSecret: "-9386iGBYNbsDryUDvVDHd0E",
		callbackURL: "http://storeappnode-62710.onmodulus.net/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate({ googleId: profile.id }, function (err, user) {
			return done(err, user);
		});
	}
));

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/plus.login']
	})
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
	passport.authenticate('google', {failureRedirect: "/#/tab/account" }),
	function(req, res) {
		console.log(req);
		res.redirect('/');
	}
);