$(function () {

    $('#container').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: true,
			animation:{
				duration:5000
			}
        },

        title: {
            text: 'Températures & Humidité'
        },

        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: -20,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 8,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 60,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 12,
            tickColor: '#666',
            labels: {
                step: 1,
                rotation: 'none'
            },
            title: {
                text: 'Températures en °C'
            },
            plotBands: [{
                from: -20,
                to: 0,
                color: '#00BFFF' // blue
            }, {
                from: 0,
                to: 10,
                color: '#00FF00' // green
            }, {
                from: 10,
                to: 20,
                color: '#F7FE2E' // yellow
            }
			, {
                from: 20,
                to: 28,
                color: '#FF8000' // orange
				
            }, {
                from: 28,
                to: 100,
                color: '#FF0000' // red
            }]
        },

        series: [{
            name: 'Température',
            data: [0],
            tooltip: {
                valueSuffix: ' °C'
			}
			},
			{
				name: 'Humidité',
				data: [0],
				tooltip: {
					valueSuffix: ' %'
				}
			}
			,
			{
				name: 'Température',
				data: [0],
				tooltip: {
					valueSuffix: ' °C'
				}
			}
			,
			{
				name: 'Température',
				data: [0],
				tooltip: {
					valueSuffix: ' °C'
				}
			}]

    },
	
    // Add some life
    function (chart) {
        if (!chart.renderer.forExport) {
            setInterval(function () {
                var xhttp = new XMLHttpRequest();
				  xhttp.onreadystatechange = function() {
					if (xhttp.readyState == XMLHttpRequest.DONE) {
					  if (xhttp.status == 200) {
						var data = JSON.parse(xhttp.responseText);
						var date = new Date(data.date).getTime();
						var point1 = chart.series[0].points[0];
						var point2 = chart.series[1].points[0];
						var point3 = chart.series[2].points[0];
						var point4 = chart.series[3].points[0];
						point1.update(data.data.sonde1);
						point2.update(data.data.sonde2);
						point3.update(data.data.sonde3);
						point4.update(data.data.sonde4);
					  } else if (xhttp.status == 400) {
						//alert('There was an error 400');
					  } else {
						//alert('something else other than 200 was returned ' + xhttp.status);
					  }
					}
				  };
				  xhttp.open("GET", "/sondedht11", true);
				  xhttp.send();
            }, 3000);
        }
    });
});