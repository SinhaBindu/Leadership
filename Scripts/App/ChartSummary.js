
$(document).ready(function () {
    GetSummaryData();
    GetPackedbubbleData();
});

function GetSummaryData() {

    $('#ChartSummary').html('');
    
    var formData = $('#formid').serialize();

    $.ajax({
        type: "GET",
        url: document.baseURI + "/Survey/GetSummary",
        data: '',
        success: function (resp) {
            if (resp.IsSuccess) {
                //debugger
                var resdata = JSON.parse(resp.Data);
                var resD = resdata;
                var DataList = [], DistName = [], DistN = []; 
                var Datav1 = [], Datav2 = [], Datav3 = [], Datav4 = [];
                var Dobj = {};
                for (var i = 0; i < resD.length; i++) {
                    var isdist = DistN.filter(x => x.name == resD[i].QuesID);
                    if (isdist == 0) {
                        DistN.push({ name: resD[i].QuesID });
                        DistName.push(resD[i].QuesID+' . ' + resD[i].Question);

                    }

                    for (let key in resD[i]) {
                        var keyname = '';
                        if (key != 'Question' && key != 'QuesID') {
                            console.log(key, resD[i][key]);
                            if (key == 'Rating1_3' || key =='Rating 1-3') {
                                keyname = 'Rating 1-3';
                            }
                            if (key == 'Rating4_5' || key == 'Rating 4-5') {
                                keyname = 'Rating 4-5';
                            }
                            var index = DataList.findIndex(x => x.name == keyname);

                            if (index == -1) {
                                if (key == 'Rating1_3' || key == 'Rating 1-3') {
                                    DataList.push({ name: keyname, data: [], color: '#544fc5' })
                                }
                                else {
                                    DataList.push({ name: keyname, data: [], color: '#03a9f4' })
                                }
                                index = DataList.length - 1;
                            }
                            //DataList[index].data.push(resD[i][key] || 0);
                            DataList[index].data.push(resD[i][key] || 0);

                        }
                    }

                    //if (resD[i].FlipChart && resD[i].FlipChart != undefined) {
                    //    Datav1.push(resD[i].FlipChart);
                    //}
                    //else {
                    //    Datav1.push(0);
                    //}
                    //if (resD[i].Leaflet && resD[i].Leaflet != undefined) {
                    //    Datav2.push(resD[i].Leaflet);
                    //}
                    //else {
                    //    Datav2.push(0);
                    //}
                    //if (resD[i].Video && resD[i].Video != undefined) {
                    //    Datav3.push(resD[i].Video);
                    //}
                    //else {
                    //    Datav3.push(0);
                    //}
                    //if (resD[i].Games && resD[i].Games != undefined) {
                    //    Datav4.push(resD[i].Games);
                    //}
                    //else {
                    //    Datav4.push(0);
                    //}
                }
                //DataList.push({ name: "Flip Chart", data: Datav1 });
                //DataList.push({ name: "Leaflet", data: Datav2 });
                //DataList.push({ name: "Video", data: Datav3 });
                //DataList.push({ name: "Games", data: Datav4 });
                console.log(DataList);
                Highcharts.chart('ChartSummary', {
                    chart: {
                        type: 'bar',
                        scrollablePlotArea: {
                            minHeight: 450
                        },
                        //marginRight: 5
                    },
                    title: {
                        text: 'Leadership Pizza Self-Assessment'
                    },
                    xAxis: {
                        categories: DistName,
                        labels: {
                            style: {
                                fontSize: '16px',
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        //max:50,
                        title: {
                            text: 'No of Rating',
                            fontSize: '16px',
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        reversed: true
                    },
                    //options: {
                    //    scales: {
                    //        xAxes: [{
                    //            barThickness: 20,  // number (pixels) or 'flex'
                    //            maxBarThickness: 20 // number (pixels)
                    //        }]
                    //    }
                    //},
                    plotOptions: {
                        series: {
                            //pointWidth: 30,
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                style: {
                                    fontSize: '16px',
                                }
                            }
                        }
                    },
                    series: DataList
                      
                    //    [{
                    //    name: 'Cristiano Ronaldo',
                    //    data: [3, 4, 6, 15, 12]
                    //}, {
                    //    name: 'Lionel Messi',
                    //    data: [5, 3, 12, 6, 11]
                    //}, {
                    //    name: 'Robert Lewandowski',
                    //    data: [5, 15, 8, 5, 8]
                    //}]
                });






            }
            else {
                $('#ChartSummary').html('Data Not Found!!');
            }
        },
        error: function (req, error) {
            if (error === 'error') { error = req.statusText; }
            var errormsg = 'There was a communication error: ' + error;
            //Do To Message display
        }
    });
}

function GetPackedbubbleData() {

    $('#ChartSummary1').html('');
 
    var formData = $('#formid').serialize();

    $.ajax({
        type: "GET",
        url: document.baseURI + "/Survey/GetSummary",
        data: '',
        success: function (resp) {
            if (resp.IsSuccess) {
                // debugger
                var resdata = JSON.parse(resp.Data);
                var resD = resdata;
                var DatalistP = [], DatalistG = [], Datasum = [], DList = [], DListM = [], DListF = [];
                var Dobj = {};
                var divbollte = $('#divquest').html('<ul>');
                for (var i = 0; i < resD.length; i++) {
                    $('#divquest').append('<li>' + resD[i].QuesID+'. '+ resD[i].Question +'</li>');
                    //Datalist.push({ name: "P-0", value: resD[i].P0 });//shortName
                    //Datalist.push({ name: "P-1", value: resD[i].P1 });
                    //Datalist.push({ name: "P-2", value: resD[i].P2 });
                    //Datalist.push({ name: "P-2+", value: resD[i].PPlus });
                    DatalistG.push({ name: resD[i].QuesID + '. ' + resD[i].Question, value: resD[i].Rating4_5 });
                    DatalistP.push({ name: resD[i].QuesID + '. ' + resD[i].Question, value: resD[i].Rating1_3 });

                    //Datasum += resD[i].TotalPlus;

                }

                DList.push({ name: "Rating (4-5)", data: DatalistG });
                DList.push({ name: "Rating (1-3)", data: DatalistP });
                $('#divquest').append('</ul>');
                // DList.push({ name: "Female Child", data: DatalistFemale });
                //Dobj = [DListM, DListF];

                 //Highcharts.setOptions({
                 //                       colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
                 //                           return {
                 //                               radialGradient: {
                 //                                   cx: 0.5,
                 //                                   cy: 0.3,
                 //                                   r: 0.7
                 //                               },
                 //                               stops: [
                 //                                   [0, color],
                 //                                   [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                 //                               ]
                 //                           };
                 //                       })
                 //                   });

                Highcharts.chart('ChartSummary1', {
                    chart: {
                        type: 'packedbubble',
                        height: '100%'
                    },
                    title: {
                        text: 'Leadership Pizza Self-Assessment',
                        align: 'center'
                    },
                    subtitle: {
                        //text: '(0 Child, 1 Child, 2 Child, 2+ Child) ' + '<b> Total : ' + Datasum + '</b>',
                        align: 'center'
                    },
                    tooltip: {
                        useHTML: true,
                        pointFormat: '<b>{point.name}: </b> {point.value}<sub></sub>'
                    },
                    credits: {
                        enabled: false
                    },
                    //legend: {
                    //    layout: 'vertical',
                    //    align: 'right',
                    //    verticalAlign: 'middle'
                    //},
                    //plotOptions: {
                    //    packedbubble: {
                    //        minSize: '15%',
                    //        maxSize: '50%',
                    //       // zMin: 0,
                    //       // zMax: 1000,
                    //        layoutAlgorithm: {
                    //           // gravitationalConstant: 0.05,
                    //            splitSeries: true,
                    //           // seriesInteraction: false,
                    //            dragBetweenSeries: true,
                    //            parentNodeLimit: true,
                    //            initialPositionRadius: 100,
                    //            parentNodeOptions: {
                    //                bubblePadding: 20
                    //            }
                    //        },
                    //        dataLabels: {
                    //            enabled: true,
                    //            format: '{point.value}',
                    //            parentNodeFormat: '{point.series.name}',
                    //            filter: {
                    //                property: 'y',
                    //                operator: '>',
                    //                value: 0
                    //            },
                    //            style: {
                    //                color: 'black',
                    //                textOutline: 'none',
                    //                fontWeight: 'normal'
                    //            }
                    //        }
                    //    }
                    //},
                    //colorAxis: [{
                    //    maxColor: '#000fb0',
                    //    minColor: '#e3e5ff',
                    //    labels: {
                    //        format: '{value}%'
                    //    },
                    //    reversed: true
                    //}, {
                    //    minColor: '#ffece8',
                    //    maxColor: '#8a1900',
                    //    labels: {
                    //        format: '{value}%'
                    //    }
                    //}],
                    plotOptions: {
                        packedbubble: {
                            minSize: '15%',
                            maxSize: '50%',
                            //bubble: {
                            //    color: 'white',
                            //    marker: {
                            //        fillColor: 'transparent'
                            //    }
                            //},
                            layoutAlgorithm: {
                                initialPositionRadius: 100,
                                splitSeries: true,
                                parentNodeLimit: true,
                                dragBetweenSeries: true,
                                parentNodeOptions: {
                                    bubblePadding: 20
                                }
                            },
                            dataLabels: {
                                enabled: true,
                                // format: '{point.shortName}',
                                parentNodeFormat: '{point.series.name}',
                                style: {
                                    color: 'black',
                                    textOutline: 'none',
                                    fontWeight: 'normal',
                                    fontSize: '18px'
                                }

                            },

                        }
                    },
                    series: DList,
                    //showInLegend: true

                });




            }
            else {
                $('#ChartSummary1').html('Data Not Found!!');
            }
        },
        error: function (req, error) {
            if (error === 'error') { error = req.statusText; }
            var errormsg = 'There was a communication error: ' + error;
            //Do To Message display
        }
    });
}