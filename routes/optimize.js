var express = require('express');
var assert = require('assert');
var router = express.Router();
var assert = require('assert');

// database
var Engine = require('nedb-promises');
var url = './data/temperatures';
var year = new Date().getFullYear();
var month = new Date().getMonth();

/* GET temperatures listing. */
router.get('/', async function (req, res, next) {
	{
		let theDate = new Date(Date.parse(req.query.date));
		if (req.query.date == undefined) {
			theDate = new Date();
			theDate.setHours(0);
			theDate.setMinutes(0);
			theDate.setMilliseconds(0);
			theDate.setSeconds(0);
		}
		year = theDate.getFullYear();

		let totalOptimized = 0;
		

		for (let index = 0; index < 12; index++) {
			let monthOptimizedCount = 0;
			month = index;
			let databaseToOptimizeName = url + "_" + year + "_" + month;
			let dbToOptimize = Engine.create(databaseToOptimizeName);
			await dbToOptimize.load();
			let countToOptomize = await dbToOptimize.count();
			console.log("count ", countToOptomize, " for ", databaseToOptimizeName);
			var docs = await dbToOptimize.find().sort({ "date": 1 });
			if (docs != undefined && docs.length > 0) {
				console.log("entries length ", docs.length, " for ", databaseToOptimizeName);
				for (let index = 1; index < docs.length - 1; index++) {
					const e = docs[index];
					const eNext = docs[index + 1];
					const ePrev = docs[index - 1];
					if (e.data.sonde1 == eNext.data.sonde1 && e.data.sonde1 == ePrev.data.sonde1
						&& e.data.sonde2 == eNext.data.sonde2 && e.data.sonde2 == ePrev.data.sonde2
						&& e.data.sonde3 == eNext.data.sonde3 && e.data.sonde3 == ePrev.data.sonde3
						&& e.data.sonde4 == eNext.data.sonde4 && e.data.sonde4 == ePrev.data.sonde4) {
						//console.log("############################ remove this non necessary info");
						await dbToOptimize.remove({ "_id": e._id });
						monthOptimizedCount++;
					}
				}
				console.log("For the month ", monthOptimizedCount, " entries deleted for ", databaseToOptimizeName);
				let count = await dbToOptimize.count();
				console.log("count after optimization", count, "for ", databaseToOptimizeName);
				//res.render('migrate', { title: 'migrate', content: totalOptimized, year: year, month: month });
			}
			dbToOptimize.compactDatafile();
			totalOptimized+=monthOptimizedCount;
		}
		
		console.log("Total of ", totalOptimized, " entries deleted");
		//res.render('migrate', { title: 'migrate', content: countToOptomize, year: year, month: month });
	}

	//res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

module.exports = router;
