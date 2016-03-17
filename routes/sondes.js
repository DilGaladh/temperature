// Load node modules
var fs = require('fs');
var util = require('util');
var http = require('http');
var express = require('express');
var router = express.Router();

var Engine = require('tingodb')();
var db = new Engine.Db('./data/', {});

// Read current temperature from sensor
function readTemp(callback){
   fs.readdir('/sys/bus/w1/devices/', function(err, files){
	var sondesData = {
			name: "test",
			date: new Date(),
			data: {
				sonde1 : 0,
				sonde2 : 0,
				sonde3 : 0,
				sonde4 : 0,
			}

		}
	var cpt=1;
	for(i in files){
		if(files[i].match("28*")){
			var buffer = fs.readFileSync('/sys/bus/w1/devices/'+files[i]+'/w1_slave');
			{
			      if(buffer != undefined){
				      // Read data from file (using fast node ASCII encoding).
				      var data = buffer.toString('ascii').split(" "); // Split by space
				
				      // Extract temperature from string and divide by 1000 to give celsius
				      var temp  = parseFloat(data[data.length-1].split("=")[1])/1000.0;
				
				      // Round to one decimal place
				      temp = Math.round(temp * 10) / 10;
				
				      // Add date/time to temperature
				      sondesData.data['sonde'+cpt] = temp;
				}			
			      
	   		}
			cpt++;
		}
	}
	// Execute call back with data
	callback(sondesData);
   });
   
};

function insertTemp(data){
	var collection = db.collection('temperatures');
	//console.log(collection);
	//collection.insert({'a':1})
	console.log("data:"+JSON.stringify(data));
	collection.insert(data);
	db.close();
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
    res.status(200).send(JSON.stringify(data));	
  });
  
  res.render('layoutgauge', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

module.exports = router;

// Start temperature logging (every 1 min).
var msecs = (60 * 1) * 1000; // log interval duration in milliseconds
logTemp(msecs);
// Send a message to console
console.log('Server is logging to database at '+msecs+'ms intervals');

