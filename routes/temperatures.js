var express = require('express');
var assert = require('assert');
var router = express.Router();
var assert = require('assert');

// database

var Engine = require('nedb');
var url = './data/temperatures';


/* GET temperatures listing. */
router.get('/', async function (req, res, next) {
	let db = Engine.create(url);
	await db.load();
	 {
		
		console.log("Connected correctly to server.");
		// Date parsing
		var dateStart = null;
		var dateEnd = null;
		if (req.query.date == "month") {
			dateStart = new Date();
			dateStart.setDate(1);
			dateStart.setHours(0);
			dateStart.setMinutes(0);
			dateStart.setMilliseconds(0);
			dateStart.setSeconds(0);
			dateEnd = new Date();
		} else {
			dateStart = new Date(Date.parse(req.query.date));
			if (req.query.date == undefined) {
				dateStart = new Date();
				dateStart.setHours(0);
				dateStart.setMinutes(0);
				dateStart.setMilliseconds(0);
				dateStart.setSeconds(0);
			}
			dateEnd = new Date(dateStart.getTime() + 3600 * 1000 * 24);
		}
		console.log(req.query.date, dateStart, dateEnd);
		//res.send('respond with a resource');
		var collection = db;
		//collection.createIndex({date: -1}, {background: true});
		var series = 'var series = [';
		var cursor = collection.find({ "date": { "$gte": dateStart, "$lt": dateEnd } }).sort({ "date": -1 }).limit(500000);
		//cursor.count(0, null, function (err, c) { console.log("count:", c); });
		//var cursor = collection.find( );
		// cursor.each(function(err, doc) {
		// assert.equal(err, null);
		// if (doc != null) {
		// console.dir(doc);
		// } 
		// });
		/*res.send(collection);*/
		//console.log("test:"+test);
		//console.log("collection:"+collection);
		var labels = ["Soleil", "Sous-sol", "Extérieur", "Tuyau"];
		var docs = cursor.exec(function (err, docs) {
			console.log(JSON.stringify(docs));
			//console.log("docs:"+docs);
			if (docs != null) {
				docs.reverse();
				var serie = new Object();
				for (var cpt = 0; cpt < 4; cpt++) {
					serie[cpt] = "{name:'" + labels[(cpt)] + "',data:[";
					for (var doc in docs) {
						//console.log(doc+" doc:"+docs[doc]);
						var dataArray = docs[doc].data;
						//console.log("dataArray:"+dataArray);
						var keys = Object.keys(dataArray);
						serie[cpt] += "[" + JSON.stringify(docs[doc].date.getTime()) + "," + JSON.stringify(dataArray[keys[cpt]]) + "],";
					}
					serie[cpt] += "]},";
				}
				//console.log(serie);
				// concatenate all
				series += serie[0] + serie[1] + serie[2] + serie[3];
				console.log("docs size:" + docs.length);
			}
			series += ']';
			//console.log("series:"+series);
			//console.log(docs);
			res.render('index', { title: 'Temperatures', content: "salut", series: series, dd1: "var dd1 = [0,8,4,5,6];" });

			
		});

	}

	//res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

module.exports = router;
