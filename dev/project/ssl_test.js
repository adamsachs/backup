var fs = require('fs');
var https = require('https');
var app = require('express')();

var options = {
		key: fs.readFileSync('/Users/personal/jazz_project/ssl/key.pem'),
		cert: fs.readFileSync('/Users/personal/jazz_project/ssl/cert.pem')
};

app.get('/', function (req, res) {
   res.send('Hello World!');
});

https.createServer(options, app).listen(8000, function () {
   console.log('Started!');
});