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

 
  OpWIPStyleA: Chart;
  OpWIPStyleB: Chart;
  OpWIPStyleC: Chart;


  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    this.calculateOperatorWIPStyleA('McNo');
    this.calculateOperatorWIPStyleB('McNo');
    this.calculateOperatorWIPStyleC('McNo');
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();

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


  navigateWIPOperator(){
    this._router.navigate(['wip-operator']);
  }

  navigateWIPSummary(){
    this._router.navigate(['wip-summary']);
  }

}
