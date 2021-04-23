import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
// import * as $ from 'jquery';
// declare var $: any;
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import * as  Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

@Component({
  selector: 'app-dhuhist',
  templateUrl: './dhuhist.component.html',
  styleUrls: ['./dhuhist.component.css']
})
export class DhuhistComponent implements OnInit {

  @ViewChild('dataTable') table;
  dataTable: any;
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  data : any = [];
  operatorsDetailsList = [];
  
  dhuLine: Chart;
  defectDHULine: Chart;
  avgDefectsBar: Chart;

constructor(private http: HttpClient,private _router: Router) { }

ngOnInit() {
  $("#topnavbar").hide();
  $("#footer").css("margin-left", "15%");
  $("#footer").hide();
  $(".footer").hide();
  // this.calculateDHU('KPIView');
  // this.calculateDHUByDefect('KPIView');
  this.getFilterData();
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
}

  getFilterData(){
    var KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    // this.calculateDHU(KPIView);
    this.calculateDHUByDefect(KPIView);
    // this.calculateAvgDefectsDHU(KPIView);
  }
  calculateDHU(KPIView){
   var _this = this;
    var url = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.dhuLine = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: responsedata["DHUHistoricalCalculation"]["Value"]["categories"]
          
        },
        yAxis: {
            title: {
                text: 'Defects Per Hundred Units (D.H.U.)	'
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
            name: 'Defects Per Hundred Units (D.H.U.)	',
            showInLegend: false,
            data: responsedata["DHUHistoricalCalculation"]["Value"]["data"],
            color: '#175d2d'
    
        }]
      });
    })
  }

  calculateDHUByDefect(KPIView){
    var _this = this;
    var url = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      // console.log(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["data"]);
      // responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["data"].forEach(element => {
      //   for(var index = 0; index < element["data"].length; index++){
      //     if(element["data"][index] == 0){
      //       element["data"][index] = null;
      //     }
      //   }
      // });
      _this.defectDHULine = new Chart(
        {
          chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        labels: {
          enabled: false,
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        xAxis: {
          categories: responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["categories"],
          visible : false
        },
        yAxis: {
            title: {
                text: 'Defects Per Hundred Units (D.H.U.)'
            },
            max:13,
            min:3
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              // general options for all series
              connectNulls: true
            }
        },
        series: responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["data"]
      });
      _this.calculateAvgDefectsDHU(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["avgDefectCategories"], responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["avgDefects"])
    })
  }

  calculateAvgDefectsDHU(categories, data){
    this.avgDefectsBar = new Chart(
    {
      chart: {
          type: 'bar'
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      title: {
          text: ''
      },
      xAxis: {
          categories: categories
      },
      yAxis: {
          min: 0,
          max: 13,
          title: {
              text: 'Defects Per Hundred Units (D.H.U.)'
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
          series: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                color: '#000000'
              }
          }
      },
      series: [{
              name:'Avg. DHU',
              showInLegend: false,
              data: data,
              dataLabels: {
                align: 'left',
                enabled: true
            }
      }]
    });
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
    var startyear = StartDate.getFullYear();
    var startDateTime = startyear + "-" + startmonth + '-' + startDay + " 00:00:00.000";
    var EndDate = new Date($('#endDate').val());
    var endDay = EndDate.getDate();
    var endmonth = EndDate.getMonth() + 1;
    var endyear = EndDate.getFullYear();
    var endDateTime = endyear + "-" + endmonth + '-' + endDay + " 00:00:00.000";
    var KPIView = {
      Line : [1,2],
      Location : checkedLocations,
      Unit : checkedUnits,
      // StartDate : "2021-01-31 00:00:00.000",
      // EndDate : "2021-01-31 00:00:00.000",
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    this.calculateDHUByDefect(KPIView);
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
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  } 
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }
  navigateToDHUOverview(){
    this._router.navigate(['dhu-overview']);
  }
}
