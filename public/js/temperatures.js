$(function () {
     Highcharts.setOptions({
        global: {
          useUTC:false
        }
      });
      $('#container').highcharts({
        chart: {
            type: 'spline',
            zoomType: 'x',
            animation: { duration: 5000},
            events : {
                      load : function() {
                              var thatSeries = this.series;
                              setInterval(function(){
                                          
                                          var xhttp = new XMLHttpRequest();
                                          xhttp.onreadystatechange = function() {
                                               if (xhttp.readyState == XMLHttpRequest.DONE ) {
                                                   if(xhttp.status == 200){
                                                        var data = JSON.parse(xhttp.responseText);
                                                        var date = new Date(data.date).getTime();
                                                        thatSeries[0].addPoint([date,data.data.sonde1],true,true);
                                                        thatSeries[1].addPoint([date,data.data.sonde2],true,true);
                                                        thatSeries[2].addPoint([date,data.data.sonde3],true,true);
                                                        thatSeries[3].addPoint([date,data.data.sonde4],true,true);
                                                   }
                                                   else if(xhttp.status == 400) {
                                                       // alert('There was an error 400')
                                                   }
                                                   else {
                                                       // alert('something else other than 200 was returned')
                                                   }
                                                }
                                         };
                                  xhttp.open("GET", "sondedht11", true);
                                  xhttp.send();
                              },10000);
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
            type:'datetime',
            tickInterval: 1000*60*30,
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
     });