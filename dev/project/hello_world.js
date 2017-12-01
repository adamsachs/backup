var https = require('https');
var fs = require('fs');
var port = 3000;
var serverUrl = "127.0.0.1";
var counter = 0;
var request = require("request");


var options = {
		key: fs.readFileSync('/Users/personal/jazz_project/ssl/key.pem'),
		cert: fs.readFileSync('/Users/personal/jazz_project/ssl/cert.pem')
};


var server = https.createServer(options, function(in_req,res){

	debugger;
	counter++;
	console.log("Request: " + in_req.url + " (" + counter + ")");

	if (in_req.url == "/sample.html"){

		var options = { method: 'POST',
		  url: 'https://www.linkedjazz.org/sparql/select',
		  headers: 
		   { 'cache-control': 'no-cache',
		     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
		     referer: 'https://linkedjazz.org/sparql/',
		     origin: 'https://linkedjazz.org',
		     host: 'www.linkedjazz.org',
		     'content-type': 'application/sparql-query;charset=UTF-8',
		     'content-length': '56',
		     connection: 'keep-alive',
		     'accept-language': 'en-US,en;q=0.8',
		     'accept-encoding': 'gzip, deflate',
		     accept: 'application/sparql-results+JSON' },
		  body: 'SELECT * WHERE {\n  ?subject ?predicate ?object ;\n} LIMIT 30\n\n' };

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);

		  console.log(body);
		  console.log(response);
		  res.end(body);
		});

		return;
	}

});

console.log("Listening at " + serverUrl + ":" + port);
server.listen(port, serverUrl);