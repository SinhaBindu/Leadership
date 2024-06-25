function BindChartData() {
    DatatLists = [];
    // InputClear();
    $('#chart-data').removeClass("text-danger");
    var url = $('#submission-form').attr("action");
    var formData = $('#submission-form').serialize();
    var ComponentID = $('#ComponentID').val();
    ComponentID = ComponentID.join(",");
    var YID = $('#YID').val();
    var OrgID = $('#OrgID').val();
    OrgID = OrgID.join(",");
    var LID = $('#LID').val();
    //LID = LID.join(",");
    var Quarter = $('#Quarter').val();
    // Quarter = Quarter.join(",");
    var _indid = "F02";
    $.ajax({
        url: document.baseURI + '/AnalyticHr/GetBarDataHr',
        type: "get",
        data: { 'ind_Id': _indid },
        dataType: 'json',
        contentType: 'application/json charset=utf-8',
        success: function (resp) {
            if (resp.IsSuccess) {
                DatatLists = JSON.parse(resp.Data);
                NoofAct = [], CateData = [];
                var seridata = [
                    {
                        name: 'Total Activity', data: [],
                        //colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            useHTML: true,
                            formatter: function () {
                                return $('<div class="cni-datalabel"/>').css({
                                    'backgroundColor': this.color,
                                    'color': (this.color == "#90ed7d" || this.color == "#f7a35c") ? '#000' : '#fff',
                                    'padding': '3px 5px',
                                    'margin-top': '-5px',
                                    'margin-left': '-5px'
                                }).text(this.y)[0].outerHTML;
                            }
                        }
                    },
                    {
                        name: 'Not Started', data: [],
                        //colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            useHTML: true,
                            formatter: function () {
                                return $('<div class="cni-datalabel"/>').css({
                                    'backgroundColor': this.color,
                                    'color': (this.color == "#90ed7d" || this.color == "#f7a35c") ? '#000' : '#fff',
                                    'padding': '3px 5px',
                                    'margin-top': '-5px',
                                    'margin-left': '-5px'
                                }).text(this.y)[0].outerHTML;
                            }
                        }
                    },
                    {
                        name: 'Started,Ongoing', data: [],
                        //colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            useHTML: true,
                            formatter: function () {
                                return $('<div class="cni-datalabel"/>').css({
                                    'backgroundColor': this.color,
                                    'color': (this.color == "#90ed7d" || this.color == "#f7a35c") ? '#000' : '#fff',
                                    'padding': '3px 5px',
                                    'margin-top': '-5px',
                                    'margin-left': '-5px'
                                }).text(this.y)[0].outerHTML;
                            }
                        }
                    },
                    {
                        name: 'Completed', data: [],
                        //colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            useHTML: true,
                            formatter: function () {
                                return $('<div class="cni-datalabel"/>').css({
                                    'backgroundColor': this.color,
                                    'color': (this.color == "#90ed7d" || this.color == "#f7a35c") ? '#000' : '#fff',
                                    'padding': '3px 5px',
                                    'margin-top': '-5px',
                                    'margin-left': '-5px'
                                }).text(this.y)[0].outerHTML;
                            }
                        }
                    }
                ];


                for (var i = 0; i < DatatLists.length; i++) {
                    CateData.push(DatatLists[i].OrgName);
                    NoofAct.push(DatatLists[i].NoofActivity);
                    seridata[0].data.push(DatatLists[i].NoofActivity);
                    seridata[1].data.push(DatatLists[i].NotStartedActivity);
                    seridata[2].data.push(DatatLists[i].StartedOngoingActivity);
                    seridata[3].data.push(DatatLists[i].CompletedActivity);                   
                }

                Highcharts.charts[0] && Highcharts.charts[0].destroy();
                //seridata.push({ name: 'Organization', data: NoofAct });//color: '#007bff',

                Highcharts.setOptions({ colors: ['rgb(124, 181, 236)', '#FC9B9B', '#FFD54F', '#33CC66'] });

                var chart = Highcharts.chart('chart-data', {
                    chart: {
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 18,
                            depth: 70
                        }
                    },
                    title: {
                        text: 'No Of Activity (Partner Summary)'
                    },
                    //subtitle: {
                    //    align: 'left',
                    //    text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
                    //},
                    //accessibility: {
                    //    announceNewData: {
                    //        enabled: true
                    //    }
                    //},
                    xAxis: {
                        /* type: 'category'*/
                        categories: CateData,
                        skew3d: true,
                    },
                    yAxis: {
                        title: {
                            text: 'No Of Activity'
                        }
                    },
                    legend: {
                        enabled: true
                    },
                    //exporting: {
                    //    chartOptions: {
                    //        plotOptions: {
                    //            series: {
                    //                dataLabels: {
                    //                    enabled: true
                    //                }
                    //            }
                    //        }
                    //    }
                    //},
                    exporting: {
                        enabled: true
                    },
                    plotOptions: {
                        column: {
                            depth: 25,
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function (e) {
                                        // console.log(this.category + '-' + this.series.name);
                                        var orginId = DatatLists.filter(x => x.OrgName == this.category)[0].IDOrg;
                                        BindSubmissionData(false, orginId, this.series.name);
                                    }
                                }
                            }
                        }
                    },

                    tooltip: {
                        enabled: true
                        //    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        //    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                    },

                    credits: {
                        enabled: false
                    },
                   
                    series: seridata

                });




            }
            else {
                $('#chart-data').html("Record Not Found !!");//TO DO
                $('#chart-data').addClass("text-danger");//TO DO
            }
        },
        error: function (req, error) {
            if (error === 'error') { error = req.statusText; }
            var errormsg = 'There was a communication error: ' + error;
            $('#chart-data').html(errormsg);
        }
    });
}


