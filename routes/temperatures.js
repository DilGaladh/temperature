var express = require('express');
var assert = require('assert');
var router = express.Router();

// database

var Engine = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/local';
Engine.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

var db = new Engine.connect(url, {});

// insertion test
var insertDocument = function(db, callback) {
	var collection = db.collection('temperatures');
	//console.log(collection);
	//collection.insert({'a':1});
	collection.insert(
		{
			name: "test",
			date: new Date(),
			data: {
				sonde1 : 20*Math.random(),
				sonde2 : 20*Math.random(),
				sonde3 : 20*Math.random(),
				sonde4 : 20*Math.random(),
			}

		}, function(err, result){
		assert.equal(err,null);
		console.log("inserted a document into the temperatures collection.");
		callback(result);
	});
};

/*insertDocument(db, function(){
	db.close();
});*/

/* GET temperatures listing. */
router.get('/', function(req, res, next) {
	
	var date = Date.parse(req.query.date);
	var datePlus1 = date+3600*24;
	console.log(req.query.date,date,datePlus1);
  //res.send('respond with a resource');
  var collection = db.collection('temperatures');
collection.createIndex({date: -1}, {background: true});
  var series = 'var series = [';
  var cursor = collection.find({date:{ $gt: date, $lt: datePlus1 }}).sort({date:-1});
	/*res.send(collection);*/
	//console.log("test:"+test);
        //console.log("collection:"+collection);
	var docs = cursor.toArray(function(err, docs){
		//console.log(JSON.stringify(docs));
		//console.log("docs:"+docs);
		if(docs != null){
			docs.reverse();
			var serie = new Object();
			for(var cpt=0;cpt<4;cpt++){
				serie[cpt] = "{name:'sonde"+(cpt+1)+"',data:[";
				for(var doc in docs){
					//console.log(doc+" doc:"+docs[doc]);
					var dataArray = docs[doc].data;
					//console.log("dataArray:"+dataArray);
					var keys = Object.keys(dataArray);
					serie[cpt] += "["+JSON.stringify(docs[doc].date.getTime())+","+JSON.stringify(dataArray[keys[cpt]])+"],";
				}
				serie[cpt] += "]},";
			}
			//console.log(serie);
			// concatenate all
			series+=serie[0]+serie[1]+serie[2]+serie[3];
			console.log("docs size:"+docs.length);
		}
		series += ']';
			//console.log("series:"+series);
			res.render('index', { title: 'Temperatures', content: "salut", series: series ,dd1: "var dd1 = [0,8,4,5,6];" });
			//console.log(docs);
			
		db.close();
	});
		

	
  
  //res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

module.exports = router;
