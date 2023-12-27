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
		let databaseToMigrateName = url;
		let dbToMigrate = Engine.create(databaseToMigrateName);
		await dbToMigrate.load();
		let countToMigrate = await dbToMigrate.count();
		console.log("count ", countToMigrate, " for ", databaseToMigrateName);
		var docs = await dbToMigrate.find().sort({ "date": 1 }).limit(1);
		if(docs != undefined && docs.length > 0)
		{
			let theDate = new Date(docs[0].date);
			console.log(theDate, docs[0].date);
			let endOfTheDay = new Date(theDate);
			endOfTheDay.setUTCHours(23, 59, 59, 999);
			console.log(endOfTheDay);
			let query = {"date": { "$lt": endOfTheDay }};
			var docsOfTheDay = await dbToMigrate.find(query).sort({ "date": 1 });
			console.log(docsOfTheDay.length, " entries today");
			console.log(docsOfTheDay[0], " is first");

			year = theDate.getFullYear();
			month = theDate.getMonth();

			let databaseName = url+"_"+year+"_"+month;
			let db = Engine.create(databaseName);
			await db.load();
			let count = await db.count();
			console.log("count ", count, "for ", databaseName);
			try{
				await db.insertMany(docsOfTheDay);
				
			}
			catch(e)
			{
				//console.error(e);
			}
			
			for (const iterator of docsOfTheDay) {
				//console.log("removing ", iterator._id);
				await dbToMigrate.remove({"_id": iterator._id});
			}

			count = await db.count();
			console.log("count after insertion", count, "for ", databaseName);
		}
		
		
		
		
		res.render('migrate', { title: 'migrate', content: countToMigrate, year: year, month: month});

		

		// var series = 'var series = [';
		// var heatmap = 'var heatmap = [';

		// // Date parsing
		// var dateStart = null;
		// var dateEnd = null;
		// for (let day = 0; day < 31; day++) {
		// 	if (req.query.date == "month") {
		// 		dateStart = new Date();
		// 		dateStart.setDate(1);
		// 		dateStart.setHours(0);
		// 		dateStart.setMinutes(0);
		// 		dateStart.setMilliseconds(0);
		// 		dateStart.setSeconds(0);
		// 		dateEnd = new Date();
		// 	} else {
		// 		dateStart = new Date(Date.parse(req.query.date));
		// 		dateStart.setDate(dateStart.getDate() - day);
		// 		if (req.query.date == undefined) {
		// 			dateStart = new Date();
		// 			dateStart.setHours(0);
		// 			dateStart.setMinutes(0);
		// 			dateStart.setMilliseconds(0);
		// 			dateStart.setSeconds(0);
		// 		}
		// 		dateEnd = new Date(dateStart.getTime() + 3600 * 1000 * 24);
		// 	}
		// 	year = dateStart.getFullYear();
		// 	month = dateStart.getMonth();
		// 	console.log(req.query.date, dateStart, dateEnd);
		// 	//res.send('respond with a resource');
		// 	let databaseName = url+"_"+year+"_"+month;
		// 	let db = Engine.create(databaseName);
		// 	await db.load();
		// 	var docs = await db.find({ "date": { "$gte": dateStart, "$lt": dateEnd } }).sort({ "date": -1 }).limit(500000);
		// 	var labels = ["Soleil", "Sous-sol", "Extérieur", "Tuyau"];

		// 	//console.log(JSON.stringify(docs));
		// 	//console.log("docs:"+docs);
		// 	if (docs != null) {
		// 		docs.reverse();
		// 		var serie = new Object();
		// 		for (var cpt = 0; cpt < 4; cpt++) {
		// 			serie[cpt] = "{name:'" + labels[(cpt)] + dateStart.getDate() + "',data:[";
		// 			for (var doc in docs) {
		// 				//console.log(doc+" doc:"+docs[doc]);
		// 				var dataArray = docs[doc].data;
		// 				//console.log("dataArray:"+dataArray);
		// 				var keys = Object.keys(dataArray);
		// 				docs[doc].date.setFullYear(0);
		// 				docs[doc].date.setDate(0);
		// 				docs[doc].date.setMonth(0);
		// 				serie[cpt] += "[" + JSON.stringify(docs[doc].date.getTime()) + "," + JSON.stringify(dataArray[keys[cpt]]) + "],";
		// 				heatmap += "[" + JSON.stringify(docs[doc].date.getDate()) + "," + JSON.stringify(docs[doc].date.getMonth()) + "," + 5 + "],";
		// 			}
		// 			serie[cpt] += "]},";
		// 		}
		// 		//console.log(serie);
		// 		// concatenate all
		// 		if (docs.length != 0)
		// 			series += /*serie[0] + serie[1] +*/ serie[2] /*+ serie[3]*/;
		// 		console.log("docs size:" + docs.length);
		// 	}


		// }
		// series += ']';
		// heatmap += ']';
		// //console.log("series:"+series);
		//res.render('migrate', { title: 'migrate', content: "salut"});
		//console.log(docs);

	}

	//res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

module.exports = router;
