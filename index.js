var express = require('express');
var app = express();
var mysqldb = require('./lib/mysqlhandler.js');

app.get('/', function (req, res) {
  res.json({hello:"this is a respone"});
});

app.get('/list', function (req, res){
	var mysqlObject = new mysqldb();
	var places = [];
	mysqlObject.search("SELECT DISTINCT location, region FROM battles", function(data)
		{
			for(var i in data)
			{
				location = data[i];
				region = data[i];
				places.push({location:location,region: region});
			}
			res.json({result:places});
		});
	mysqlObject.close();
	
});

app.get('/count', function(req, res){
	var mysqlObject = new mysqldb();
	var places = [];
	mysqlObject.search("SELECT COUNT(id) FROM battles", function(data)
		{
			for(var i in data)
			{
				location = data[i];
				region = data[i];
				places.push({location:location,region: region});
			}
			res.json(places);
		});
	mysqlObject.close();
});

app.get('/stats', function(req,res){
	const events = require('events');
	var eventEmitter = new events.EventEmitter();
	var mysqlObject = new mysqldb();
	mysqlObject.search("SELECT attacker_king, count(attacker_king) as count FROM battles GROUP BY attacker_king ORDER BY count DESC LIMIT 1", function(data)
	{
		eventEmitter.emit('response',{data: data[0].attacker_king, type: 'attacker_king'});
	});
	mysqlObject.search("SELECT defender_king, count(defender_king) as count FROM battles GROUP BY defender_king ORDER BY count DESC LIMIT 1", function(data)
	{
		eventEmitter.emit('response',{data: data[0].defender_king, type: 'defender_king'});
	});
	mysqlObject.search("SELECT region, count(region) as count FROM battles GROUP BY region ORDER BY count DESC LIMIT 1", function(data)
	{
		eventEmitter.emit('response',{data: data[0].region, type: 'region'});
	});
	mysqlObject.search("SELECT name, count(name) as count FROM battles GROUP BY name ORDER BY count DESC LIMIT 1", function(data)
	{
		eventEmitter.emit('response',{data: data[0].name, type: 'name'});
	});
	mysqlObject.search("SELECT battle_type as count FROM battles", function(data)
	{
		battle_types = [];
		for(var i in data)
		{
			battle_types.push(data[i].battle_type);
		}
		eventEmitter.emit('response',{data: battle_types, type: 'battle_type'});
	});
	mysqlObject.search("SELECT defender_size FROM battles", function(data)
	{
		var max_army = 0;
		var min_army = 0;
		var average_army = 0;
		for(var i in data)
		{
			if(i == 0 || min_army > parseInt(data[i].defender_size))
			{
				min_army = parseInt(data[i].defender_size);
			}
			if(i == 0 || max_army < parseInt(data[i].defender_size))
			{
				max_army = parseInt(data[i].defender_size);
			}
			average_army = average_army + parseInt(data[i].defender_size);
		}
		average_army = average_army / data.length;
		eventEmitter.emit('response',{data: average_army, type: 'defender_size_average'});
		eventEmitter.emit('response',{data: min_army, type: 'defender_size_min'});
		eventEmitter.emit('response',{data: max_army, type: 'defender_size_max'});
	});
	mysqlObject.search("SELECT attacker_outcome FROM battles", function(data)
	{
		var won = 0;
		var loss = 0;
		for(var i in data)
		{
			if(data[i].attacker_outcome === 'win')
			{
				won = won + 1;
			}
			else
			{
				loss = loss + 1;
			}
		}
		eventEmitter.emit('response',{data: won, type: 'attacker_outcome_win'});
		eventEmitter.emit('response',{data: loss, type: 'attacker_outcome_loss'});
	});
	response_data = {};
	eventEmitter.on('response', function(data)
	{
		response_data[data.type] = data.data;
		if(response_data['battle_type'] && response_data['region'] && response_data['attacker_outcome_win'] && response_data['attacker_outcome_loss'] && response_data['attacker_king'] && response_data['defender_king'] && response_data['name'] && response_data['defender_size_average'] && response_data['defender_size_max'] && response_data['defender_size_min'])
		{
			response_result  = {
				"most_active":{  
				     "attacker_king":response_data['attacker_king'],
				     "defender_king":response_data['defender_king'],
				     "region":response_data['region'],
				     "name":response_data['name']
				  },
				  "attacker_outcome":{  
				     "win":response_data['attacker_outcome_win'],
				     "loss":response_data['attacker_outcome_loss']
				  },
				  "battle_type":response_data['battle_type'],
				  "defender_size":{  
				     "average":response_data['defender_size_average'],
				     "min":response_data['defender_size_min'],
				     "max":response_data['defender_size_max']
				  }
			}
			res.json(response_data);
			mysqlObject.close();
		}
	});
	
});

app.listen(process.env.port, function () {
  console.log('Hackerearth app listening on port '+process.env.port+'!');
});