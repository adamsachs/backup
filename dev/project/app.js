var path = require('path');
var express = require('express');
var logger = require('morgan');
var Promise = require('promise');
var app = express();
var root = '/Users/personal/dev/project/';
var s3 = require('./utils/s3controller');
var redis = require('./utils/rediscontroller');

var staticOptions = {
	extensions : ['html']
}

// Log the requests
app.use(logger('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), staticOptions));

app.use('/public', express.static(__dirname + '/public/'));

app.set('views', root + 'views');
app.set('view engine', 'pug');
app.locals.basedir = path.join(__dirname, '');

//
app.get('/home', function(req, res){
	res.sendFile('/Users/personal/dev/project/public/home.html');
});


app.get('/gallery/:location', function(req, res){
	params = {
		key: req.params.location,
	}
	s3.getFolder(params, function (contents){
		s3.expandFolder(contents, function(keys){
			debugger;
			var locals = {
				images: keys,
				title: req.params.location,
			};
			res.render('photos/gallery', locals);
		});
	});
});

app.get('/markers', function(req, res, next){
	var response = [];
	redis.smembers("markers").then(function (markers){
		Promise.all(markers.map(function (marker){
			return redis.getAll(marker);
		})).then(function (locations){
			res.send(locations);
		});
	});
});

app.get('/:section/index.html', function(req, res){
	var locals = {
		title: req.params.section
	}
	res.render('page', locals);
});


// Route for everything else.
app.get('*', function(req, res){
	debugger;
  res.send('Hello World');
});

var markers = [
	{
		name : "AXPE",
		location : "43.1159537,-2.5985256",
		zindex : "5"
	},
	{
		name : "BERLIN",
		location : "52.5075419,13.4261419",
		zindex : "6"
	}
];

markers.forEach(function(marker){
	redis.sadd({
		key : "markers",
		members : marker.name
	});

	var entries = [];
	for (var property in marker) {
		var entry = {};
		if (marker.hasOwnProperty(property)) {
				entry["field"] = property;
				entry["value"] = marker[property];
				entries.push(entry);
		}
	}

	redis.hmset({
		key : marker.name ,
		entries : entries
	});

});


// Fire it up!
app.listen(3000);
console.log('Listening on port 3000');
