// Load node modules
var fs = require('fs');
var util = require('util');
var http = require('http');
var express = require('express');
var router = express.Router();
var assert = require('assert');

var Engine = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/local';


//var Engine = require('mongodb')();
//var db = new Engine.Db('./data/', {});

// Read current temperature from sensor dht11
function readTemp(callback){
   
	var sondesData = {
			name: "test",
			date: new Date(),
			data: {
				 sonde1 : 0,
				 sonde2 : 0,
				 sonde3 : 0,
				 sonde4 : 0,
				//sonde1 : 20*Math.random(),
				//sonde2 : 20*Math.random(),
				//sonde3 : 20*Math.random(),
				//sonde4 : 20*Math.random(),
			}

		}

	var buffer = fs.readFileSync('/home/pi/Adafruit_Python_DHT/examples/sonderesults');
		{
			  if(buffer != undefined){
				  // Read data from file (using fast node ASCII encoding).
				  var data = buffer.toString('ascii');
				  var jdata = JSON.parse(data);
			
				  // Add date/time to temperature
				  sondesData.name = "dht11";
				  sondesData.data['sonde1'] = jdata.temp;
				  sondesData.data['sonde1'] = jdata.temperature;
				  sondesData.data['sonde2'] = jdata.humidity;
				  // Execute call back with data
				  callback(sondesData);
			}			
			  
		}
	
	
   
   
};

function insertTemp(data){
	Engine.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server.");
	  var collection = db.collection('temperatures');
		//console.log(collection);
		//collection.insert({'a':1})
		console.log("data:"+JSON.stringify(data));
		collection.insert(data);
		db.close();
	});
	
}

// Create a wrapper function which we'll use specifically for logging
function logTemp(interval){
      // Call the readTemp function with the insertTemp function as output to get initial reading
      readTemp(insertTemp);
      // Set the repeat interval (milliseconds). Third argument is passed as callback function to first (i.e. readTemp(insertTemp)).
      setInterval(readTemp, interval, insertTemp);
};

/* GET temperatures scan. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  
  readTemp(function(data){
    res.status(200).send(JSON.stringify(data));	
  });
  
  //res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

router.get('/current', function(req, res, next) {
  //res.send('respond with a resource');
  
  readTemp(function(data){
    res.render('layoutgauge', { title: 'Temperatures', series: data, dd1: "var dd1 = [0,8,4,5,6];" });
  });
  
  
});

module.exports = router;

// Start temperature logging (every 1 min).
var msecs = (60 * 1) * 1000; // log interval duration in milliseconds
logTemp(msecs);
// Send a message to console
console.log('Server is logging to database at '+msecs+'ms intervals');

