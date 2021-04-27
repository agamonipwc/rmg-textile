import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import * as  Highcharts from 'highcharts';
import  More from 'highcharts/highcharts-more';
import { Chart } from 'angular-highcharts';
More(Highcharts);
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let more = require("highcharts/highcharts-more");
let Exporting = require('highcharts/modules/exporting');
Boost(Highcharts);
noData(Highcharts);
more(Highcharts);
noData(Highcharts);
Exporting(Highcharts);
const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);
const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

@Component({
  selector: 'app-sewingmodulehist',
  templateUrl: './sewingmodulehist.component.html',
  styleUrls: ['./sewingmodulehist.component.css']
})
export class SewingmodulehistComponent implements OnInit {

  constructor(private http: HttpClient,private _router: Router) { }

  efficiencyHistoric : Chart;
  capacityHistoric : Chart;
  wipHistoric : Chart;
  machineDowntimeHistoric : Chart;
  dhuHistoric : Chart;
  defectsHistoric : Chart;
  rejectionHistoric: Chart;
  absentismHistoric: Chart;
  locationOptions : any = [];
  unitOptions: any = [];
  lineOptions : any= [];
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

  headerTextValue : string = "";

  ngOnInit() {
    
    $("#footer").hide();
    $(".footer").hide();
    $("#topnavbar").hide();   
    this.getMasterData();
    var KPIView = {
        Line : [1,2,3,4],
        Location : [1,2],
        Unit : [1,2],
        StartDate : "2021-01-27 00:00:00.000",
        EndDate : "2021-01-31 00:00:00.000",
    }
    this.getFilterData(KPIView)
    // this.createRejectionHistoric();
    $(function() {
      var _this = this;
      // Hide all lists except the outermost.
      $('ul.tree ul').hide();
      $("#period_5").prop("checked", true);
      $("#dropdownLinePeriodButton").html("Last 5 days");
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

  averageKPIDataList = [];
  getFilterData(KPIView){
    var _this = this ;
    var userBackendUrl = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(userBackendUrl, KPIView).subscribe(responsedata => {
        if(responsedata.StatusCode == 200){
            _this.createEfficiencyHistoric(responsedata["EfficiencyHistoricalCalculation"]["Value"]["categories"], responsedata["EfficiencyHistoricalCalculation"]["Value"]["data"], responsedata["EfficiencyHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createCapacityHistoric(responsedata["CapacityHistoricalCalculation"]["Value"]["categories"], responsedata["CapacityHistoricalCalculation"]["Value"]["data"], responsedata["CapacityHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createWIPHistoric(responsedata["InlineWIPHistoricalCalculation"]["Value"]["categories"], responsedata["InlineWIPHistoricalCalculation"]["Value"]["data"], responsedata["InlineWIPHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createMachineDowntimeHistoric(responsedata["MachineDownTimeHistoricalCalculation"]["Value"]["categories"], responsedata["MachineDownTimeHistoricalCalculation"]["Value"]["data"], responsedata["MachineDownTimeHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createDefectsHistoric(responsedata["DefectPecentageHistoricalCalculation"]["Value"]["categories"], responsedata["DefectPecentageHistoricalCalculation"]["Value"]["data"], responsedata["DefectPecentageHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createAbsentismHistoric(responsedata["AbsentismHistoricalCalculation"]["Value"]["categories"], responsedata["AbsentismHistoricalCalculation"]["Value"]["data"], responsedata["AbsentismHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createRejectionHistoric(responsedata["RejectionHistoricalCalculation"]["Value"]["categories"], responsedata["RejectionHistoricalCalculation"]["Value"]["data"], responsedata["RejectionHistoricalCalculation"]["Value"]["averageDataValue"]);
            _this.createDHUHistoric(responsedata["DHUHistoricalCalculation"]["Value"]["categories"], responsedata["DHUHistoricalCalculation"]["Value"]["data"], responsedata["DHUHistoricalCalculation"]["Value"]["averageDataValue"],)
        }
    })
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.sewingHistKPIHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.sewingHistKPIHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
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

  createEfficiencyHistoric(categories, data, averageDataValue){
    var label;
    this.efficiencyHistoric = new Chart({
        chart: {
            type: 'spline',
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
           
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
              text: 'Efficiency %',
              rotation: 0,
            },
            maxPadding: 0.2,
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
            },
          },
          
          series: {
            events: {
              afterAnimate: function() {
                var chart = this.chart;
                label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'Efficiency',
            data: data,
            color: '#0060d7',
            "showInLegend": false,
        }]
    });
  }

  createCapacityHistoric(categories, data, averageDataValue){
    var label;
    this.capacityHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: ''
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
              text: 'Capacity %',
              rotation: 0,
            },
            max:120,
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
                  label = chart.renderer.text('Average : ' + averageDataValue, 350, 10)
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
            name: 'Capacity Utilization',
            data: data,
            color: '#741910',
            "showInLegend": false,
        }]
    });
  }

  createWIPHistoric(categories, data, averageDataValue){
    var label;
    this.wipHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: 'Inline WIP Level',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
           
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: 'WIP Level',
                rotation: 0,
            },
            max:5.0,
            min:0.0
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
                label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'Inline WIP Level',
            data: data,
            color: '#0060d7',
            "showInLegend": false,
        }]
    });
  }

  createMachineDowntimeHistoric(categories, data, averageDataValue){
    var label;
    this.machineDowntimeHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: 'Inline WIP Level',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: 'Downtime %',
                rotation: 0,
            },
            max: 20,
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
                  label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'Downtime',
            data: data,
            color: '#6a1ce2',
            "showInLegend": false,
        }]
    });
  }

  createDHUHistoric(categories, data, averageDataValue){
    var label;
    this.dhuHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: 'Defects Per Hundred Units (D.H.U.)',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
           
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: 'DHU',
                rotation: 0,
            },
            max:13,
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
                  label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'DHU',
            data: data,
            color: '#175c2c',
            "showInLegend": false,
        }]
    });
  }

  createDefectsHistoric(categories, data, averageDataValue){
    var label;
    this.defectsHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: '',
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: 'Defects %',
                rotation: 0,
            },
            max:50,
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
                  label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'Defects',
            data: data,
            color: '#a43e50',
            "showInLegend": false,
        }]
    });
  }

  createRejectionHistoric(categories, data, averageDataValue){
    var label;
    this.rejectionHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: '',
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
           
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
              text: 'Rejection %',
              rotation: 0,
            },
            max:15,
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
                  label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'Rejection',
            data: data,
            color: '#c28a00',
            "showInLegend": false,
        }]
    });
  }

  createAbsentismHistoric(categories, data, averageDataValue){
    var label;
    this.absentismHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
            enabled: false
          },
          credits: {enabled: false},
        title: {
            text: '',
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            visible : false,
            categories: categories
           
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: 'Absenteeism %',
                rotation: 0,
            },
            max:20,
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
                  label = chart.renderer.text('Average : ' + averageDataValue, 350, 15)
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
            name: 'Absenteeism',
            data: data,
            color: '#a43e50',
            "showInLegend": false,
        }]
    });
  }

  navigateEfficiency(){
    this._router.navigate(['efficiency-overview']);
  }

  dashboardNavigation(){
    this._router.navigate(['module-performance']);
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
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
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
        this.headerTextValue = environment.sewingHistKPIHeaderText + " on " + userFormattedDateOutput["startDateTime"];
      }
      else{
        this.headerTextValue = environment.sewingHistKPIHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
      }
      this.getFilterData(KPIView)
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
  processNavigation(){
    this._router.navigate(['process-overview']);
  }

  dhuHistoricalNavigation(){
    this._router.navigate(['dhu-historic']);
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

  showKPIAverageValues(kpiName){
    this.averageKPIDataList.forEach(element => {
      if(element["key"]== kpiName){
        Swal.fire({    
          icon: 'info',  
          title: 'KPI Analysis',  
          text: 'Average value of ' + kpiName + " : " + element["value"],  
          showConfirmButton: false
        })  
      }
    });
  }

  backToPrevious(){
    window.history.back();
  }
}
