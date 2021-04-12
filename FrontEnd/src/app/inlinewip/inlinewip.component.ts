import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.js';
import { data } from 'jquery';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let more = require("highcharts/highcharts-more");
let Exporting = require('highcharts/modules/exporting');
let Sunburst = require('highcharts/modules/sunburst');
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
Boost(Highcharts);
noData(Highcharts);
more(Highcharts);
noData(Highcharts);
Exporting(Highcharts);
const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);
const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
Sunburst(Highcharts);

@Component({
  selector: 'app-inlinewip',
  templateUrl: './inlinewip.component.html',
  styleUrls: ['./inlinewip.component.css']
})
export class InlinewipComponent implements OnInit {

  StyleA1 : any = [];
  StyleA2 : any = [];
  StyleA3 : any = [];
  StyleA4 : any = [];
  OpWIPStyleA: Chart;
  OpWIPStyleB: Chart;
  OpWIPStyleC: Chart;
  OpWIPStyleD : Chart;
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  data : any = [];
  operatorsDetailsList = [];
  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    this.calculateOperatorWIPStyleA('McNo');
    this.calculateOperatorWIPStyleB('McNo');
    this.calculateOperatorWIPStyleC('McNo');
    this.calculateOperatorWIPStyleD('McNo');
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();
    this.getFilterData();
    $(function() {
        // Hide all lists except the outermost.
        $('ul.tree ul').hide();
      
        $('.tree li > ul').each(function(i) {
          var $subUl = $(this);
          var $parentLi = $subUl.parent('li');
          var $toggleIcon = '<i class="js-toggle-icon" style="cursor:pointer;">+</i>';
      
          $parentLi.addClass('has-children');
          
          $parentLi.prepend( $toggleIcon ).find('.js-toggle-icon').on('click', function() {
            $(this).text( $(this).text() == '+' ? '-' : '+' );
            $subUl.slideToggle('fast');
          });
        });
    });
  }

  getFilterData(){
    var KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateWIPStyleWise(KPIView);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

  calculateWIPStyleWise(KPIView){
    var _this = this;
    this.StyleA1 = [];
    this.StyleA2 = [];
    this.StyleA3 = [];
    this.StyleA4 = [];
    var url = environment.backendUrl + "InlineWIPOverview";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
        responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA1.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString(),
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                }
            })
        });
        responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA2.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString(),
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                }
            })
        });
        responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA3.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString(),
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                }
            })
        });
        responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA4.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString(),
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                }
            })
        });
    })
  }

  calculateOperatorWIPStyleA(McNo){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.OpWIPStyleA = new Chart({
      chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['L1', 'L2', 'L3']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Operator Inline WIP'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Op 1',
        data: [5, 0, 0]
    }, {
        name: 'Op 2',
        data: [2, 0, 0]
    }, {
        name: 'Op 3',
        data: [3, null, null]
    },{
        name: 'Op 4',
        data: [null, 3, null]
    }, {
        name: 'Op 5',
        data: [null, 8, null]
    }, {
        name: 'Op 6',
        data: [null, null, 9]
    }, {
        name: 'Op 7',
        data: [null, null, 4]
    }, {
        name: 'Op 8',
        data: [null, null, 3]
    }]
   });
   }
   calculateOperatorWIPStyleB(McNo){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.OpWIPStyleB = new Chart({
      chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['L4', 'L5']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Operator Inline WIP'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Op 1',
        data: [5, null]
    }, {
        name: 'Op 2',
        data: [2, null]
    }, {
        name: 'Op 3',
        data: [3, null]
    },{
        name: 'Op 4',
        data: [3, null]
    }, {
        name: 'Op 5',
        data: [null, 8]
    }, {
        name: 'Op 6',
        data: [null, 9]
    }, {
        name: 'Op 7',
        data: [null, 4]
    }]
   });
   }

   calculateOperatorWIPStyleC(McNo){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.OpWIPStyleC = new Chart({
      chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['L4']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Operator Inline WIP'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Op 11',
        data: [5]
    }, {
        name: 'Op 12',
        data: [2]
    }, {
        name: 'Op 13',
        data: [3]
    }]
   });
   }

   calculateOperatorWIPStyleD(McNo){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.OpWIPStyleD = new Chart({
      chart: {
        type: 'column'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['L4']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Operator Inline WIP'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Op 11',
        data: [5]
    }, {
        name: 'Op 12',
        data: [2]
    }, {
        name: 'Op 13',
        data: [3]
    }]
   });
   }

    sewingNavigation(){
    this._router.navigate(['sewing-module']);
  } 
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }
  navigateWIPOperator(){
    this._router.navigate(['wip-operator']);
  }

  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 8,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
        _this.recommendationModalTitle = "Recommemdations for Inline WIP"
        _this.getOperatorsName('Moderate');
        responsedata["allRecommendations"].forEach(element => {
            _this.data.push({
              Reasons : element["Reasons"],
              Recommendations : element["Recommendations"],
              SubReasons : element["SubReasons"],
            });
        });
    })
  }
  getOperatorsName(efficiencyLevel){
    this.operatorsDetailsList = [];
    var operatorsDetailsView ={
      efficiencyLevel : efficiencyLevel
    };
    var url = environment.backendUrl + "OperatorsName";
    var _this = this;
    this.http.post<any>(url, operatorsDetailsView).subscribe(responsedata =>{
      responsedata["operatorsDetails"].forEach(element => {
        _this.operatorsDetailsList.push({
          Name : element["Name"],
          Machine : element["Machine"],
          Unit : element["Unit"],
          Location : element["Location"],
          Line : element["Line"]
        });
      });
    })
  }

  navigateWIPSummary(){
    this._router.navigate(['wip-summary']);
  }

}
