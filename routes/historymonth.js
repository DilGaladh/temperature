var express = require('express');
var assert = require('assert');
var router = express.Router();
var assert = require('assert');

// database

var Engine = require('nedb-promises');
var url = './data/temperatures';



/* GET temperatures listing. */
router.get('/', async function (req, res, next) {
	var db = Engine.create(url);
	await db.load();
	{
		
		console.log("Connected correctly to server HISTORY month.");

		var series = 'var series = [';

		// Date parsing
		var dateStart = null;
		var dateEnd = null;
		for (let day = 0; day < 31; day++) {
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
				dateStart.setDate(dateStart.getDate() - day);
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
			
			var docs = await db.find({ "date": { "$gte": dateStart, "$lt": dateEnd } }).sort({ "date": -1 }).limit(500000);
			var labels = ["Soleil", "Sous-sol", "Extérieur", "Tuyau"];

			console.log(JSON.stringify(docs));
			console.log("docs:"+docs);
			if (docs != null) {
				docs.reverse();
				var serie = new Object();
				for (var cpt = 0; cpt < 4; cpt++) {
					serie[cpt] = "{name:'" + labels[(cpt)] + dateStart.getDate() + "',data:[";
					for (var doc in docs) {
						//console.log(doc+" doc:"+docs[doc]);
						var dataArray = docs[doc].data;
						//console.log("dataArray:"+dataArray);
						var keys = Object.keys(dataArray);
						docs[doc].date.setFullYear(0);
						serie[cpt] += "[" + JSON.stringify(docs[doc].date.getTime()) + "," + JSON.stringify(dataArray[keys[cpt]]) + "],";
					}
					serie[cpt] += "]},";
				}
				//console.log(serie);
				// concatenate all
				if(docs.length != 0)	
					series += /*serie[0] + serie[1] +*/ serie[2] /*+ serie[3]*/;
				console.log("docs size:" + docs.length);
			}


		}
		series += ']';
		//console.log("series:"+series);
		res.render('index', { title: 'Temperatures', content: "salut", series: series, dd1: "var dd1 = [0,8,4,5,6];" });
		//console.log(docs);
	
	}

	//res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

module.exports = router;
