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
  selector: 'app-machinedowntime',
  templateUrl: './machinedowntime.component.html',
  styleUrls: ['./machinedowntime.component.css']
})
export class MachinedowntimeComponent implements OnInit {

  machineDowntimeLine: Chart;

  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    this.calculateMachineDowntime('McNo');
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

  calculateMachineDowntime(McNo){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.machineDowntimeLine = new Chart({
       chart: {
           type: 'spline'
       },
       title: {
           text: ''
       },
       labels: {
         enabled: false,
       },
       xAxis: {
           categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
   '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
   '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
          
       },
       yAxis: {
           title: {
               text: 'Machine Downtime'
           },
           max:100,
           min:0
       },
       tooltip: {
           crosshairs: true,
           shared: true
       },
       plotOptions: {
           spline: {
               marker: {
                   radius: 2,
                   lineColor: 'red',
                   lineWidth: 3
                }
              },
            series: {
                // general options for all series
                connectNulls: true
            }
          
       },
       series: [{
           name: 'Machine Downtime',
           showInLegend: false,
           data: [36,null,7 ,null, null, null,8,87,null, null,35,86,79,69, null],
           color: '#175d2d'
   
       }]
   });
   }

   navigateDowntime(){
    this._router.navigate(['downtime-curvefit']);
  }

}
