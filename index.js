var express = require('express');
var app = express();

app.get('/', function (req, res) {

	
  res.json({hello:"this is a respone"});
});

app.listen(process.env.port, function () {
  console.log('Hackerearth app listening on port '+process.env.port+'!');
});