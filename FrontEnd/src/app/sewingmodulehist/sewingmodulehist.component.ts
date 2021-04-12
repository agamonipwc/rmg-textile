import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
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

  ngOnInit() {

    $("#footer").hide();
    $(".footer").hide();
    $("#topnavbar").hide();   
    this.getMasterData();
    var KPIView = {
        Line : [1,2,3,4],
        Location : [1,2],
        Unit : [1,2],
        StartDate : "2021-01-01 00:00:00.000",
        EndDate : "2021-01-31 00:00:00.000",
    }
    this.getFilterData(KPIView)
    // this.createRejectionHistoric();
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

  getFilterData(KPIView){
      var _this = this ;
    var userBackendUrl = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(userBackendUrl, KPIView).subscribe(responsedata => {
        if(responsedata.StatusCode == 200){
            _this.createEfficiencyHistoric(responsedata["EfficiencyHistoricalCalculation"]["Value"]["categories"], responsedata["EfficiencyHistoricalCalculation"]["Value"]["data"]);
            _this.createCapacityHistoric(responsedata["CapacityHistoricalCalculation"]["Value"]["categories"], responsedata["CapacityHistoricalCalculation"]["Value"]["data"]);
            _this.createWIPHistoric(responsedata["InlineWIPHistoricalCalculation"]["Value"]["categories"], responsedata["InlineWIPHistoricalCalculation"]["Value"]["data"]);
            _this.createMachineDowntimeHistoric(responsedata["MachineDownTimeHistoricalCalculation"]["Value"]["categories"], responsedata["MachineDownTimeHistoricalCalculation"]["Value"]["data"]);
            _this.createDefectsHistoric(responsedata["DefectPecentageHistoricalCalculation"]["Value"]["categories"], responsedata["DefectPecentageHistoricalCalculation"]["Value"]["data"]);
            _this.createAbsentismHistoric(responsedata["AbsentismHistoricalCalculation"]["Value"]["categories"], responsedata["AbsentismHistoricalCalculation"]["Value"]["data"]);
            _this.createRejectionHistoric(responsedata["RejectionHistoricalCalculation"]["Value"]["categories"], responsedata["RejectionHistoricalCalculation"]["Value"]["data"]);
            _this.createDHUHistoric(responsedata["DHUHistoricalCalculation"]["Value"]["categories"], responsedata["DHUHistoricalCalculation"]["Value"]["data"])
        }
    })
    
  }

  createEfficiencyHistoric(categories, data){

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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'Efficiency %'
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
            }
        },
        series: [{
            name: 'Efficiency',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createCapacityHistoric(categories, data){
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
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Capacity %'
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
            }
        },
        series: [{
            name: 'Capacity Utilization',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createWIPHistoric(categories, data){
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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'WIP %'
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
            }
        },
        series: [{
            name: 'Inline WIP Level',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createMachineDowntimeHistoric(categories, data){
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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'Downtime %'
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
            }
        },
        series: [{
            name: 'Machine Downtime',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createDHUHistoric(categories, data){

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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'DHU'
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
            }
        },
        series: [{
            name: 'DHU',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createDefectsHistoric(categories, data){

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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'Defects %'
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
            }
        },
        series: [{
            name: 'Defects %',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createRejectionHistoric(categories, data){

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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'Rejection %'
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
            }
        },
        series: [{
            name: 'Rejection',
            data: data,
            color: '#175d2d'
    
        }]
    });
  }

  createAbsentismHistoric(categories, data){

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
            categories: categories
           
        },
        yAxis: {
            title: {
                text: 'Absentism %'
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
            }
        },
        series: [{
            name: 'Absentism',
            data: data,
            color: '#175d2d'
    
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
    var startMonthValue = startmonth.toString();
    if(startmonth > 10){
        startMonthValue = "0" + startmonth.toString();
    }
    var startyear = StartDate.getFullYear();
    var startDateTime = startyear + "-" + startMonthValue + '-' + startDay + " 00:00:00.000";
    var EndDate = new Date($('#endDate').val());
    var endDay = EndDate.getDate();
    var endmonth = EndDate.getMonth() + 1;
    var endMonthValue = startmonth.toString();
    if(endmonth > 10){
        endMonthValue = "0" + endmonth.toString();
    }
    var endyear = EndDate.getFullYear();
    var endDateTime = endyear + "-" + endMonthValue + '-' + endDay + " 00:00:00.000";
    var KPIView = {
      Line : [1,2],
      Location : checkedLocations,
      Unit : checkedUnits,
    //   StartDate : "2021-01-27 00:00:00.000",
    //   EndDate : "2021-01-31 00:00:00.000"
        StartDate : startDateTime,
      EndDate : endDateTime
    }
    this.getFilterData(KPIView)
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
  processNavigation(){
    this._router.navigate(['process-overview']);
  }

  dhuHistoricalNavigation(){
    this._router.navigate(['dhu-historic']);
  }
}
