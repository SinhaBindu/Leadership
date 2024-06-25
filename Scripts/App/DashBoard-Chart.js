
var myModule = angular.module('myModule', [])

myModule.factory("DataService", ['$filter', '$http', function ($filter, $http) {
    var service = {};
    service.getData = function () {
        var LineData = $http.get('/Report/tepm');
        return LineData;
    };
    return service;
}]);

myModule.controller('myController', function ($scope, $http, DataService) {
    var url = "http://localhost:59584/Scripts/App/bar.json";
    $scope.chartType = "column";

    $scope.CreateChart = function (val, Title, Section) {
        //$scope.value = val;
        $scope.ctitle = Title;
        $scope.section = Section;
        console.log(Section);

        $http.get('/Home/getDasboardChartData?ind_Id=' + val).success(function (result) {

            var myJSON = eval(result);
            // var myJSON = JSON.parse(result);

            var _title = Title
            var valType = myJSON[0].val_type;
            var indType = myJSON[0].IndType;
            console.log(valType);
            var yAxisTitle = valType == 'P' ? 'Percentage (%)' : 'Value';
            //var series = ["GIRIDIH", "JAMTARA", "DHANBAD", "EAST SINGHBUM", "GARHWA", "HAZARIBAGH", "JHARKHAND", "RANCHI", "DEOGHAR"];
            //var dataval = [100, 100, 100, 100, 100, 100, 88, 0, 100];
            var series = [];
            var dataval = [];
            for (var i in myJSON) {
                series.push(myJSON[i]["District"]);
                dataval.push(myJSON[i]["Pc"]);
            }

            Highcharts.setOptions({
                //colors: ['#ff3333', '#50B432']
                colors: indType > 0 ? ['#50B432'] : ['#ff3333'],
            });


            Highcharts.chart('lineChart', {
                chart: {
                    type: 'column',
                    spacingBottom: 0,
                    spacingTop: 10,
                    spacingLeft: 10,
                    spacingRight: 10,
                    width: null,
                    height: null
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: '<span style="font-size:13px;font-weight:bold;">' + _title + '</span>'
                },

                xAxis: {
                    categories: series, //JSON.stringify(series),
                    //categories: [
                    //    'Jan',
                    //    'Feb',
                    //    'Mar',
                    //    'Apr',
                    //    'May',
                    //    'Jun',
                    //    'Jul',
                    //    'Aug',
                    //    'Sep',
                    //    'Oct',
                    //    'Nov',
                    //    'Dec'
                    //],
                    crosshair: true
                },
                yAxis: {
                    title: {
                        text: yAxisTitle
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        point: {
                            events: {
                                click: function () {
                                    LoadpopIndicator(this.category, val, Section);//this.series.xAxis.categories

                                }
                            }
                        }
                    }
                },
                series: [{
                    //name: '2018',
                    data: dataval //myJSON[0].data
                }]
            })
        });

        $http.get('/Home/GetTOP3BottomData?ind_Id=' + val).success(function (result) {
            $scope.model = result;
            $scope.ind_type = result ? result[0].IndType : 0;
        });
    }
});





