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

@Component({
  selector: 'app-machinedowntime',
  templateUrl: './machinedowntime.component.html',
  styleUrls: ['./machinedowntime.component.css']
})
export class MachinedowntimeComponent implements OnInit {

  machineDowntimeLine: Chart;
  curveFitMachineDowntime : Chart;
  totalDownTime : any = 0;
  totalFeedingDownTime : any = 0;
  totalMachineDownTime : any = 0;
  topFiveMachinesList : any = [];
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  totalDownTimeStyle : any = {};
  totalFeedingDownTimeStyle : any = {};
  totalMachineDownTimeStyle : any = {};
  selectedMachineName : any = "";
  KPIView : any = {};
  tableData : any = [];

  constructor(private http: HttpClient,private _router: Router) { }
  ngOnInit() {
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
    this.getFilterData();
    this.getMasterData();
  }

  getFilterData(){
    this.KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateMachineDowntimeOverview(this.KPIView);
  }

  calculateMachineDowntimeOverview(KPIView){
    this.topFiveMachinesList = [];
    var _this = this;
    var url = environment.backendUrl + "MachineDowntimeOverview";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.totalDownTime = responsedata["totalDownTime"];
      _this.totalFeedingDownTime = responsedata["totalFeedingDownTime"];
      _this.totalMachineDownTime = responsedata["totalMachineDownTime"];
      _this.totalDownTimeStyle = {
        'background-color' : responsedata["totalDowntimeColorCode"],
        'height' : '30px',
        'width' :  _this.totalDownTime
      }
      _this.totalFeedingDownTimeStyle = {
        'background-color' : responsedata["feedingDowntimeColorCode"],
        'height' : '30px',
        'width' :  _this.totalFeedingDownTime
      }
      _this.totalMachineDownTimeStyle = {
        'background-color' : responsedata["machineDowntimeColorCode"],
        'height' : '30px',
        'width' :  _this.totalMachineDownTime
      }
      responsedata["topFiveMachineDowntimeList"].forEach(element => {
        _this.topFiveMachinesList.push({
          machineName : element["MachineName"],
          machineDownTime : element["MachineDownTime"],
          machineStyle :{
            'background-color' : element["ColorCode"],
            'height' : '30px',
            'width' :  element["MachineDownTime"]
          }
        })
      });
    })
  }

  calculateMachineDowntime(machineName){
    this.selectedMachineName = machineName;
    var KPIView = this.KPIView;
    KPIView["MachineName"] = machineName;
    var _this = this;
    var url = environment.backendUrl + "MachineDailyDowntime";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.machineDowntimeLine = new Chart({
        chart: {
            type: 'scatter'
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
          categories: responsedata["categories"]
        },
        yAxis: {
          title: {
              text: 'Machine Downtime'
          },
          max:20,
          min:5,
          plotLines: [
            {
            color: '#003dab',
            width: 2,
            value: 10,
            dashStyle: 'shortdot'
          },
          {
            color: '#933401',
            width: 2,
            value: 5,
            dashStyle: 'shortdot'
          }
          ]
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            formatter: function() {
              return  '</b> Machine has downtime of  <b>' + this.y + '%</b></br> on '+ this.x;
          }
        },
        plotOptions: {
          spline: {
            marker: {
                radius: 4,
                lineWidth: 1
            }
          },
          series: {
              connectNulls: false,
              // lineWidth: 1
          }
            
        },
        series: responsedata["data"]
      });
      _this.calculateCurveFitChart(responsedata["categories"],responsedata["curveFitMachineDowntimeData"]);
    })
   }

   calculateCurveFitChart(categories, data){
    this.tableData = [];
    this.curveFitMachineDowntime = new Chart({
      chart: {
          type: 'scatter'
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
        categories: categories
      },
      yAxis: {
        title: {
            text: 'Machine Downtime'
        },
        max:20,
        min:5,
        plotLines: [
          {
            color: '#003dab',
            width: 2,
            value: 10,
            dashStyle: 'shortdot'
          },
          {
            color: '#933401',
            width: 2,
            value: 5,
            dashStyle: 'shortdot'
          }
        ]
      },
      tooltip: {
          crosshairs: true,
          shared: true,
          formatter: function() {
            return  '</b> Machine has downtime of  <b>' + this.y + '%</b></br> on '+ this.x;
        }
      },
      plotOptions: {
        spline: {
          marker: {
              radius: 4,
              // lineColor: '#666666',
              lineWidth: 1
          }
        },
        series: {
            connectNulls: false,
            dataLabels: {
              formatter: function() {
                if (this.y > 0) {
                  return this.y;
                }
              }
            }
            // lineWidth: 1
        }
          
      },
      series: data
    }); 
    data.forEach(element => {
      var countDowntimeMoreThanFive = 0;
      element["data"].forEach(innerElement => {
        if(innerElement >= 5){
          countDowntimeMoreThanFive ++;
        }
      });
      var frequency = Math.round(countDowntimeMoreThanFive * 100 / categories.length);
      if(frequency >= 20){
        var machineName = element["name"].split('_')[0];
        var location = element["name"].split('_')[1];
        var unit = element["name"].split('_')[2];
        var line = element["name"].split('_')[3];
        this.tableData.push({
          machineName : machineName,
          location : location,
          unit : unit,
          line : line,
          frequency : frequency
        });
      }
    });
    
   }

   showCurveFit(){
     if($("#curveFit").is(":hidden")){
      $("#frequencyBtn").html("Downtime Frequency")
      $("#curveFit").show();
      $("#machineDowntimeHistorical").hide();
     }
     else{
      $("#frequencyBtn").html("Downtime Overview");
      $("#curveFit").hide();
      $("#machineDowntimeHistorical").show();
     }
   }

   getSelectedLocationLineUnit(){
    this.KPIView = {};
    var checkedLocations = $('.option.justone.location:checkbox:checked').map(function() {
      var locationId = parseFloat(this.value);
      return locationId;
    }).get();
    var checkedUnits = $('.option.justone.unit:checkbox:checked').map(function() {
      var unitId = parseFloat(this.value);
      return unitId;
    }).get();
    var checkedLines = $('.option.justone.line:radio:checked').map(function() {
      var lineId = parseFloat(this.value);
      return lineId;
    }).get();
    var StartDate = new Date($('#startDate').val());
    var startDay = StartDate.getDate();
    var startmonth = StartDate.getMonth() + 1;
    var startyear = StartDate.getFullYear();
    var startDateTime = startyear + "-" + startmonth + '-' + startDay + " 00:00:00.000";
    var EndDate = new Date($('#endDate').val());
    var endDay = EndDate.getDate();
    var endmonth = EndDate.getMonth() + 1;
    var endyear = EndDate.getFullYear();
    var endDateTime = endyear + "-" + endmonth + '-' + endDay + " 00:00:00.000";
    this.KPIView = {
      Line : [1,2],
      Location : checkedLocations,
      Unit : checkedUnits,
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    return this.KPIView;
   }

   getSewingKPIAnalysis(){
    var KPIView = this.getSelectedLocationLineUnit();
    this.calculateMachineDowntimeOverview(KPIView);
   }

  onLocationChange(event){
    var masterDataUrl = environment.backendUrl + "MasterData";
    var _this = this;
    var locations = [];
    if (event.target.checked){
      locations.push(parseInt(event.target.value))
      var dataViewModel = {
        locations : locations,
        units : []
      }
      this.http.post<any>(masterDataUrl,dataViewModel).subscribe(responsedata =>{
        if(responsedata["statusCode"] == 200){
          responsedata["data"].forEach(element => {
            $("#unit_label_" + element.UnitId).show();
            $("#line_label_" + element.Id).show();
          });
        }
      })
    }
    else{
      $('.option.justone.location:checkbox').prop('checked', false);
      $('.option.justone.unit:checkbox').prop('checked', false);
      $(".unit_label").hide();
      $(".line_label").hide();
      $('.option.justone.line:radio').prop('checked', false);
    }
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

   navigateDowntime(){
    this._router.navigate(['downtime-curvefit']);
  }

}
