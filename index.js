var express = require('express');
var app = express();
var mysqldb = require('./lib/mysqlhandler.js');

app.get('/', function (req, res) {
  res.json({hello:"this is a respone"});
});

app.get('/list', function (req, res){
	var mysqlObject = new mysqldb();
	mysqlObject.search("SELECT DISTINCT location, region FROM battles", function(data)
		{
			res.send(JSON.stringify(data));
		});
	
});

app.listen(process.env.port, function () {
  console.log('Hackerearth app listening on port '+process.env.port+'!');
});