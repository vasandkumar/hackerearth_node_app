var mysql      = require('mysql');


var MySQLHandler = function()
{
	this.connection = mysql.createConnection({
		host : config.DB_HOST,
		user : config.DB_USERNAME,
		password : config.DB_PASSWORD,
		database : config.DB_NAME;
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

module.exports = MySQLHandler;