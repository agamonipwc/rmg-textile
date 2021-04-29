import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.js';
import { data } from 'jquery';
declare var require: any;
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
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
  selector: 'app-moduleperformancehist',
  templateUrl: './moduleperformancehist.component.html',
  styleUrls: ['./moduleperformancehist.component.css']
})
export class ModuleperformancehistComponent implements OnInit {

  operationHistoric : Chart;
  socialHistoric : Chart;
  environmentalHistoric : Chart;
  inwardHistoric : Chart;
  processHistoric : Chart;
  outwardHistoric : Chart;
  fabricTrimHistoric : Chart;
  SpreadingCuttingHistoric : Chart;
  SewingHistoric : Chart;
  FinishingPackagingHistoric : Chart;
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  periodOptions : any=[
    {
      Id : 5, Name:"Last 5 days"
    },
    {
      Id : 10, Name:"Last 10 days"
    },
    {
      Id : 15, Name:"Last 15 days"
    },
    {
      Id : 20, Name:"Last 20 days"
    }
  ];

  constructor(private http: HttpClient,private _router: Router) { }
  headerTextValue : string;
  ngOnInit() {

    $("#footer").hide();
    $(".footer").hide();
    $("#topnavbar").hide();
    this.createOperationHistoric();
    this.createSocialHistoric();
    this.createEnvironmentalHistoric();
    this.createInwardHistoric();
    this.createProcessHistoric();
    this.createOutwardHistoric();
    this.createFabricTrimHistoric();
    this.createSpreadingCuttingHistoric();
    this.createSewingHistoric();
    this.createFinishingPackagingHistoric();
    this.getMasterData();
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
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
    this.headerTextValue = environment.moduleHistOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
    this.headerTextValue = environment.moduleHistOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
    }
  }
  onLocationChange(event){
    var masterDataUrl = environment.backendUrl + "MasterData";
    var _this = this;
    var locations = [];
    if (event.target.checked){
      this.locationOptions.forEach(element => {
        if(element.Id == event.target.value){
          $("#dropdownLocationMenuButton").html(element.Name);
        }
      });
      locations.push(parseInt(event.target.value))
      var dataViewModel = {
        locations : locations,
        units : []
      }
      this.http.post<any>(masterDataUrl,dataViewModel).subscribe(responsedata =>{
        if(responsedata["statusCode"] == 200){
          responsedata["data"].forEach(element => {
            $("#unit_label_" + element.UnitId).show();
            $("#line_label_1").show();
            $("#line_label_2").show();
            // $("#line_label_" + element.Id).show();
          });
        }
      })
    }
    else{
      $('.option.justone.location:radio').prop('checked', false);
      $('.option.justone.unit:radio').prop('checked', false);
      $(".unit_label").hide();
      $(".line_label").hide();
      $('.option.justone.line:radio').prop('checked', false);
    }
  }

  onUnitChange(event){
    if (event.target.checked){
      this.unitOptions.forEach(element => {
        if(element.Id == event.target.value){
          $("#dropdownUnitMenuButton").html(element.Name);
        }
      });
    }
  }

  onLineChange(event){
    if (event.target.checked){
      this.lineOptions.forEach(element => {
        if(element.Id == event.target.value){
          $("#dropdownLineMenuButton").html(element.Name);
        }
      });
    }
  }

  onPeriodChange(event){
    if (event.target.checked){
      this.periodOptions.forEach(element => {
        if(element.Id == event.target.value){
          $("#dropdownLinePeriodButton").html(element.Name);
          var checkedPeriod = $('.option.justone.period:radio:checked').map(function() {
            var periodId = parseInt(this.value);
            return periodId;
          }).get();
          if(checkedPeriod[0] != null){
            var EndDate = new Date($('#endDate').val());
            var last = new Date(EndDate.getTime() - (checkedPeriod[0] * 24 * 60 * 60 * 1000));
            var day =last.getDate();
            var month=last.getMonth()+1;
            var year=last.getFullYear();
            var monthString = month.toString();
            var dayString = day.toString();
            if(month < 10){
              monthString = "0" + month;
            }
            if(day < 10){
              dayString = "0" + day;
            }
            var StartDate = year + "-" + monthString + "-" + dayString;
            $('#startDate').val(StartDate)
          }
        }
      });
    }
  }
  formatUserInputDate(startDate, endDate){
    var StartDate = new Date(startDate);
    var EndDate = new Date(endDate);
    var startDay = StartDate.getDate();
    var startmonth = StartDate.getMonth() + 1;
    var startyear = StartDate.getFullYear();
    var startDateTime = startDay + "." + startmonth + '.' + startyear;
    var endDay = EndDate.getDate();
    var endmonth = EndDate.getMonth() + 1;
    var endyear = EndDate.getFullYear();
    var endDateTime = endDay + "." + endmonth + '.' + endyear;
    return {startDateTime : startDateTime, endDateTime : endDateTime}
  }
  getSewingKPIAnalysis(){
    var checkedLocations = $('.option.justone.location:radio:checked').map(function() {
      var locationId = parseFloat(this.value);
      return locationId;
    }).get();
    var checkedUnits = $('.option.justone.unit:radio:checked').map(function() {
      var unitId = parseFloat(this.value);
      return unitId;
    }).get();
    var checkedLines = $('.option.justone.line:radio:checked').map(function() {
      var lineId = parseFloat(this.value);
      return lineId;
    }).get();
    var StartDate = new Date($('#startDate').val());
    var EndDate = new Date($('#endDate').val());

    if(checkedLocations.length != 0 && checkedLines.length != 0 && checkedUnits.length != 0 && $('#startDate').val() != "" && $('#endDate').val() != ""){
      var startDay = StartDate.getDate();
      var startmonth = StartDate.getMonth() + 1;
      var startyear = StartDate.getFullYear();
      var startDateTime = startyear + "-" + startmonth + '-' + startDay + " 00:00:00.000";
      var endDay = EndDate.getDate();
      var endmonth = EndDate.getMonth() + 1;
      var endyear = EndDate.getFullYear();
      var endDateTime = endyear + "-" + endmonth + '-' + endDay + " 00:00:00.000";
      var KPIView = {
        Line : checkedLines,
        Location : checkedLocations,
        Unit : checkedUnits,
        StartDate : startDateTime,
        EndDate : endDateTime
      }
      var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
      if($('#startDate').val() == $('#endDate').val()){
        this.headerTextValue = environment.moduleHistOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
      }
      else{
        this.headerTextValue = environment.moduleHistOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
      }
    //   this.getFilterData(KPIView)
    }
    else{
      Swal.fire({    
        icon: 'error',  
        title: 'Sorry...',  
        text: 'Please select location, unit ,line, start date and end date to view historical data',  
        showConfirmButton: true
      })  
    }
  }
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }

  createOperationHistoric(){

    this.operationHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 70.26, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Operations',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d',
            "showInLegend": false,
        }]
    });
  }
  getMasterData(){
    var masterDataUrl = environment.backendUrl + "MasterData";
    var _this = this;
    this.http.get<any>(masterDataUrl).subscribe(responsedata =>{
        if(responsedata["statusCode"] == 200){
            _this.locationOptions = responsedata["locationMasterData"];
            _this.unitOptions = responsedata["unitMasterData"];
            _this.lineOptions = responsedata["lineMasterData"];
        }
    })
  }
  navigateToModulePerformane(){
    this._router.navigate(['module-performance']);
  }

  createInwardHistoric(){

    this.inwardHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 65.6, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Inward',
            data: [56, 45, 67,89,44,56,60,71,78,73,72,79,69,65,60],
            color: '#ffb600',
            "showInLegend": false,
        }]
    });
  }
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  createProcessHistoric(){

    this.processHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 64.13, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Process',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color:'#e0301e',
            "showInLegend": false,
        }]
    });
  }
  createFabricTrimHistoric(){

    this.fabricTrimHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Fabric & Trim Store Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 64.13, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Fabric & Trim Store',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color:'#ffb600',
            "showInLegend": false,
        }]
    });
  }
  createSpreadingCuttingHistoric(){

    this.SpreadingCuttingHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Spreading & Cutting Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 64.13, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Spreading & Cutting',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color: '#175d2d',
            "showInLegend": false,
        }]
    });
  }
  createSewingHistoric(){

    this.SewingHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Sewing Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 60, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Sewing',
            data: [50, 45,45,55,51,63,57,64,59,78,68,79,69,65,52],
            color:'#e0301e',
            "showInLegend": false,
        }]
    });
  }
  createFinishingPackagingHistoric(){

    this.FinishingPackagingHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Finishing & Packaging Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
    visible : false
        },
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 64.13, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Finishing & Packaging',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color:'#ffb600',
            "showInLegend": false,
        }]
    });
  }

  createOutwardHistoric(){

    this.outwardHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 64.13, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Outward',
            data: [67, 45,71,60,69,68,55,73,89,90,88,79,69,65,76],
            color:'#175d2d',
            "showInLegend": false,
        }]
    });
  }

  createSocialHistoric(){

    this.socialHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Social Sustainability Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
            '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
            '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
            visible : false
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 70.26, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Social Sustainability',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            colour:'#175d2d',
            "showInLegend": false,
        }]
    });
  }

  createEnvironmentalHistoric(){

    this.environmentalHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Environmental Sustainability',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
        '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
        '12/01/2021','13/01/2021','14/01/2021','15/01/2021'],
        visible : false
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        yAxis: {
            title: {
                text: ''
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
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              events: {
                afterAnimate: function() {
                  var chart = this.chart;
                  var label = chart.renderer.text('Average : ' + 70.26, 350, 15)
                    .css({
                      fontSize: '12px',
                      color: '#933401',
                      fontWeight: '900'
                    })
                    .add();
                }
              }
            }
        },
        series: [{
            name: 'Environmental Sustainability',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#e0301e',   
            "showInLegend": false,
        }]
    });
  }

  backToPrevious(){
    window.history.back();
  }

}
