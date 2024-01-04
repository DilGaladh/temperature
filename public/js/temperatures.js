$(function () {
    //let heatmap = [[2023 - 11 - 27, 21, 0], [2023 - 11 - 27, 20, -5], [2023 - 11 - 27, 20, 18], [2023 - 11 - 27, 19, 20], [2023 - 11 - 27, 18, 0]];
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    $('#container').highcharts({
        chart: {
            type: 'spline',
            zoomType: 'x',
            animation: { duration: 5000 },
            events: {
                loade: function () {
                    var thatSeries = this.series;
                    setInterval(function () {

                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (xhttp.readyState == XMLHttpRequest.DONE) {
                                if (xhttp.status == 200) {
                                    var data = JSON.parse(xhttp.responseText);
                                    var date = new Date(data.date).getTime();
                                    thatSeries[0].addPoint([date, data.data.sonde1], true, true);
                                    thatSeries[1].addPoint([date, data.data.sonde2], true, true);
                                    thatSeries[2].addPoint([date, data.data.sonde3], true, true);
                                    thatSeries[3].addPoint([date, data.data.sonde4], true, true);
                                }
                                else if (xhttp.status == 400) {
                                    // alert('There was an error 400')
                                }
                                else {
                                    // alert('something else other than 200 was returned')
                                }
                            }
                        };
                        xhttp.open("GET", "sondes", true);
                        xhttp.send();
                    }, 10000);
                }
            }
        },
        title: {
            text: 'Sondes de température'
        },
        yAxis: {
            title: {
                text: 'Température'
            },
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 1000 * 60 * 30,
            title: {
                text: 'Temps'
            },
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 100,
            verticalAlign: 'top',
            y: 50,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: series,
    });
    if (heatmap != null) {
        $('#container2').highcharts({
            chart: {
                type: 'heatmap'
            },

            title: {
                text: 'HeatMap',
                align: 'left',
                x: 40
            },

            subtitle: {
                text: 'Variation des temperatures',
                align: 'left',
                x: 40
            },

            xAxis: {
                type: 'datetime',
                labels: {
                    align: 'left',
                    x: 5,
                    y: 14,
                    format: '{value:%b-%d}' 
                },
                showLastLabel: false,
                tickLength: 1
            },

            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    format: '{value}:00'
                },
                minPadding: 0,
                maxPadding: 0,
                startOnTick: false,
                endOnTick: false,
                tickPositions: [0, 6, 12, 18, 24],
                tickWidth: 1,
                min: 0,
                max: 23,
                reversed: true
            },

            colorAxis: {
                stops: [
                    [0, '#3060cf'],
                    [0.5, '#fffbbc'],
                    [0.9, '#c4463a'],
                    [1, '#c4463a']
                ],
                min: -15,
                max: 50,
                startOnTick: false,
                endOnTick: false,
                labels: {
                    format: '{value}℃'
                }
            },

            //data: heatmap,

            //series: heatmap,
            series: [{
                data: heatmap,
                /*boostThreshold: 100,*/
                borderWidth: 1,
                nullColor: '#EFEFEF',
                colsize: 24 * 36e5, // one day
                tooltip: {
                    headerFormat: 'Temperature<br/>',
                    pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
                },
                //     turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
            }]

        });
    }

});