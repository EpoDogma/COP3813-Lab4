const express = require('express');
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const COOKIE_SECRET = require("./cookieSecret.js");

let app = express();

// Set up the bodyParser to handle urlencoded data
app.use(bodyParser.urlencoded({ extended: true }));


// Set up cookie-parser
app.use(cookieParser(COOKIE_SECRET));

// Set up session for user based on cookie
app.use(session({
	secret: COOKIE_SECRET,
	resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set up handlebars view engine
let handlebars = require('express-handlebars')
	.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	if (req.session.user)	{
		res.render("home", {
			user: req.session.user
		});
	}	else	{
		res.render("login", {
			error: "You need to login"
		}); 
	}	
});


// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
