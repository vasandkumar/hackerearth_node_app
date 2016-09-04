var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : 's3kreee7'
});

var MySQLHandler = function()
{
	this.connection = mysql.createConnection({
		host : config.DB_HOST,
		user : config.DB_USERNAME,
		password : config.DB_USERNAME
	})

	this.connection.connect();
}

MySQLHandler.prototype.search = function(query, callback)
{
	this.connection.query(query, function(err,rows,fields){
		if(err) throw err;
		callback(rows);
	});
}

MySQLHandler.prototype.close = function()
{
	this.connection.end();
}

