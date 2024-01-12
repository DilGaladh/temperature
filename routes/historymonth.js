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
		var series = 'var series = [';
		var heatmap = 'var heatmap = [';

		// Date parsing
		var dateStart = null;
		var dateEnd = null;
		for (let day = 0; day < 31; day++) {
			let hour = 0;
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
				dateStart.setDate(dateStart.getDate() - (31 - day));
				if (req.query.date == undefined) {
					dateStart = new Date();
					dateStart.setHours(0);
					dateStart.setMinutes(0);
					dateStart.setMilliseconds(0);
					dateStart.setSeconds(0);
				}
				dateEnd = new Date(dateStart.getTime() + 3600 * 1000 * 24);
			}
			year = dateStart.getFullYear();
			month = dateStart.getMonth();
			console.log(req.query.date, dateStart, dateEnd);
			//res.send('respond with a resource');
			let databaseName = url + "_" + year + "_" + month;
			let db = Engine.create(databaseName);
			await db.load();
			var docs = await db.find({ "date": { "$gte": dateStart, "$lt": dateEnd } }).sort({ "date": -1 });
			var labels = ["Soleil", "Sous-sol", "Extérieur", "Tuyau"];

			//console.log(JSON.stringify(docs));
			//console.log("docs:"+docs);
			if (docs != null) {
				docs.reverse();
				var serie = new Object();
				for (var cpt = 0; cpt < 4; cpt++) {
					serie[cpt] = "{name:'" + labels[(cpt)] + dateStart.getDate() + "',data:[";
					for (var doc in docs) {
						//console.log(doc+" doc:"+docs[doc]);
						var dataArray = docs[doc].data;
						var date = new Date(docs[doc].date);
						//console.log("dataArray:"+dataArray);
						var keys = Object.keys(dataArray);
						docs[doc].date.setFullYear(0);
						docs[doc].date.setDate(0);
						docs[doc].date.setMonth(0);
						serie[cpt] += "[" + JSON.stringify(docs[doc].date.getTime()) + "," + JSON.stringify(dataArray[keys[cpt]]) + "],";
						if (cpt == 0) {
							if (date.getHours() > hour) {
								hour = date.getHours();
							}
							if (date.getHours() == hour) {
								heatmap += "[" + date.getTime() + "," + JSON.stringify(date.getHours()) + "," + JSON.stringify(dataArray[keys[cpt]]) + "],";
								hour++;
							}
						}
					}
					serie[cpt] += "]},";
				}
				//console.log(serie);
				// concatenate all
				if (docs.length != 0)
					series += /*serie[0] + serie[1] +*/ serie[2] /*+ serie[3]*/;
				console.log("docs size:" + docs.length);
			}


		}
		series += ']';
		heatmap += ']';
		//console.log("series:"+series);
		//console.log("heatmap:"+heatmap);
		res.render('historymonth', { title: 'Temperatures', content: "salut", series: series, heatmap: heatmap });
		//console.log(docs);

	}

	//res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

/* GET temperatures listing. */
router.get('/empty', async function (req, res, next) {
	{
		var series = "var series = [{name:'0',data:[]}";
		var heatmap = 'var heatmap = [';

		
		series += ']';
		heatmap += ']';
		//console.log("series:"+series);
		//console.log("heatmap:"+heatmap);
		res.render('historymonth', { title: 'Temperatures', content: "salut", series: series, heatmap: heatmap });
		//console.log(docs);

	}

	//res.render('index', { title: 'Temperatures', content: collection, dd1: "var dd1 = [0,8,4,5,6];" });
});

/* GET temperatures listing. */
router.get('/onedayraw', async function (req, res, next) {
	{
		var series = 'var series = [';
		var heatmap = new Array();

		// Date parsing
		var dateStart = null;
		var dateEnd = null;
		//for (let day = 0; day < 31; day++) {
		let hour = 0;
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
			//dateStart.setDate(dateStart.getDate());
			//if (req.query.date == undefined) {
				//dateStart = new Date();
				dateStart.setHours(0);
				dateStart.setMinutes(0);
				dateStart.setMilliseconds(0);
				dateStart.setSeconds(0);
			//}
			dateEnd = new Date(dateStart.getTime() + 3600 * 1000 * 24);
		}
		year = dateStart.getFullYear();
		month = dateStart.getMonth();
		console.log(req.query.date, dateStart, dateEnd);
		//res.send('respond with a resource');
		let databaseName = url + "_" + year + "_" + month;
		let db = Engine.create(databaseName);
		await db.load();
		var docs = await db.find({ "date": { "$gte": dateStart, "$lt": dateEnd } }).sort({ "date": -1 });
		var labels = ["Soleil", "Sous-sol", "Extérieur", "Tuyau"];

		//console.log(JSON.stringify(docs));
		//console.log("docs:"+docs);
		if (docs != null && docs.length > 0) {
			docs.reverse();
			var firstHour = new Date(docs[0].date).getHours();
			hour = firstHour;
			for (var doc in docs) {
				//console.log(doc+" doc:"+docs[doc]);
				var dataArray = docs[doc].data;
				var date = new Date(docs[doc].date);
				//console.log("dataArray:"+dataArray);
				var keys = Object.keys(dataArray);
				docs[doc].date.setFullYear(0);
				docs[doc].date.setDate(0);
				docs[doc].date.setMonth(0);

				if (date.getHours() == hour) {
					heatmap.push([ date.getTime(), date.getHours(), dataArray[keys[0]]]);
					//heatmap += "[" + date.getTime() + "," + JSON.stringify(date.getHours()) + "," + JSON.stringify(dataArray[keys[0]]) + "],";
					hour++;
				}
			}
			//console.log(serie);
			// concatenate all
			console.log("docs size:" + docs.length);
		}


	}
	
	res.status(200).send(JSON.stringify(heatmap));	
});

module.exports = router;
