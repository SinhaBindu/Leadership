function Load_Map(json_data, Pc, Den, ValType, IndType, paraextra) {
    var jsonObject = JSON.parse(json_data);
    var reportMapDivWidth = $("#report-map").width();
    var tooltipX = (reportMapDivWidth / 2) + 25;
    var MapHeight = reportMapDivWidth > 650 ? 500 : null;
    Highcharts.mapChart('report-map', {

        chart: {
            borderWidth: 1,
            borderColor: '#00000',
            height: MapHeight
        },

        title: {
            text: '<span style="font-size:13px;font-weight:bold;">' + jsonObject[0].ind + '</span>'
        },
        //subtitle: {
        //    text: '<span style="font-size:13px;">(State Level Estimate :' + ' <span  style="color: red; font-weight:bold; font-size:12px;"> ' + Pc + ValType + ' ( Den = ' + Den + ')  </span>)</span>'
        //},
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,
            align: 'center',
            //y: 60
        },
        mapNavigation: {
            enabled: false
        },
        tooltip: {
            backgroundColor: 'none',
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            padding: 0,
            //headerFormat : '',
            pointFormatter: function () {
                pointFormat: return '<span style="font-size:12px;">' + this.district + ' : ' + this.value + '</span>';
            },
            positioner: function () {
                return { x: tooltipX, y: 70 };
            }
        },
        colorAxis: {

            dataClasses: [{
                from: 0,
                to: Pc,
                color: IndType > 0 ? '#ffcccc' : '#ff3333',

            }, {
                from: Pc,
                to: 100,
                color: IndType > 0 ? '#D5FEFF' : '#009900'
            }]
        },
        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function (e) {
                            debugger;
                            if (paraextra == 1) {
                                //BindDataDistrict(this.DISTRICT);
                                console.log(location.href = '/Attendance/DailyAttendance?DistrictId=' + this.DISTRICT);
                                location.href = '/Attendance/DailyAttendance?DistrictId=' + this.DISTRICT
                                    //this.options.key;
                            }
                        }
                    }
                }
            }
        },

        series: [{
            animation: {
                duration: 1000
            },
            data: jsonObject,
            mapData: Highcharts.maps['custom/Jharkhand'],
            joinBy: ['DISTRICT', 'district'],
            dataLabels: {
                enabled: true,
                color: '#000000',
                format: '{point.district}',
                style: {
                    fontSize: 9,
                    fontWeight: 600
                },
            },

            name: jsonObject[0].Section,
            color: '#fff',
            borderColor: 'black',
            borderWidth: 0.5,
            tooltip: {
                pointFormat: '{point.district}: {point.value}'
            }
        }]
    });
}