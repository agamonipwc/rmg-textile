import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { environment } from 'src/environments/environment.js';
import * as  Highcharts from 'highcharts';
const More = require('highcharts/highcharts-more');
More(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
declare var require: any;

@Component({
  selector: 'app-inlinewipoperator',
  templateUrl: './inlinewipoperator.component.html',
  styleUrls: ['./inlinewipoperator.component.css']
})
export class InlinewipoperatorComponent implements OnInit {

  recommendationModalTitle : any = "";
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  capacityCalculationHeadingColor = "";

  data : any = [];
  operatorsDetailsList = [];
  
  operatorWIP: Chart;
  operatorWIPAvg: Chart;
  operatorWIPHigh: Chart;
  KPIView : any = {};

constructor(private http: HttpClient,private _router: Router) { }

ngOnInit() {
  $("#topnavbar").hide();
  $("#footer").css("margin-left", "15%");
  $("#footer").hide();
  $(".footer").hide();
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
  this.KPIView = {
    Line : [1,2],
    Location : [1,2],
    Unit : [1,2],
    StartDate : "2021-01-01 00:00:00.000",
    EndDate : "2021-01-31 00:00:00.000",
  }
  this.calculateOperatorWIP(this.KPIView);
}

calculateOperatorWIP(KPIView){
  KPIView["OperatorType"] = "Low";
  var _this = this;
  var url = environment.backendUrl + "DHUEfficiencyOperator";
  this.http.post<any>(url, KPIView).subscribe(responsedata => {
    console.log(responsedata);
    _this.operatorWIP = new Chart( {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
        xAxis: {
          title: {
                  enabled: true,
                  text: '%Defect',
          },
          labels: {
            enabled: true,
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        tooltip: {
          formatter: function () {
              return this.series.name + '<br>' + ' Efficiency: <b>' + this.y + '%' +
                  '</b><br> Defect: <b>' + this.x + '</b>' + '%';
          }
        },
        exporting: {
            enabled: false
          },
        credits: {enabled: false},
        yAxis: {
              max: 100,
              min: 0,
            title: {
                text: '%Efficiency'
            },
            plotLines: [
                {
                color: '#003dab',
                width: 2,
                value: 75,
                dashStyle: 'shortdot'
              },
              {
                color: '#933401',
                width: 2,
                value: 51,
                dashStyle: 'shortdot'
              }
            ]
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            borderWidth: 1
        },
        series: responsedata["chartViewModels"]
    });
  })
}

calculateAvgOperatorWIP(KPIView){
  KPIView["OperatorType"] = "Medium";
  var _this = this;
  var url = environment.backendUrl + "DHUEfficiencyOperator";
  this.http.post<any>(url, KPIView).subscribe(responsedata => {
  _this.operatorWIPAvg = new Chart( {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      tooltip: {
        formatter: function () {
            return this.series.name + '<br>' + ' Efficiency: <b>' + this.y + '%' +
                '</b><br> Defect: <b>' + this.x + '</b>' + '%';
        }
      },
      title: {
          text: ''
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      xAxis: {
        title: {
          enabled: true,
          text: '%Defect',
        },
        labels: {
          enabled: true,
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
          max: 100,
          min: 0,
          title: {
              text: '%Efficiency'
          },
          plotLines: [
            {
            color: '#003dab',
            width: 2,
            value: 75,
            dashStyle: 'shortdot'
          },
          {
            color: '#933401',
            width: 2,
            value: 51,
            dashStyle: 'shortdot'
          }
        ]
      },
      series: responsedata["chartViewModels"]
    });
  })
}

calculateHighOperatorWIP(KPIView){
  KPIView["OperatorType"] = "High";
  var _this = this;
  var url = environment.backendUrl + "DHUEfficiencyOperator";
  this.http.post<any>(url, KPIView).subscribe(responsedata => {
  _this.operatorWIPHigh = new Chart( {
    
    chart: {
      type: 'scatter',
      zoomType: 'xy'
    },
    exporting: {
        enabled: false
      },
      credits: {enabled: false},
    title: {
        text: ''
    },
    xAxis: {
        title: {
                enabled: false,
                text: 'Operator ID',
            },
            labels: {
              enabled: false,
            },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
          max: 100,
          min: 0,
        title: {
            text: '%Efficiency'
        },
        plotLines: [
            {
            color: '#003dab',
            width: 2,
            value: 75,
            dashStyle: 'shortdot'
          },
          {
            color: '#933401',
            width: 2,
            value: 51,
            dashStyle: 'shortdot'
          }
        ]
    },
    series: responsedata["chartViewModels"]
  });

  })
}

getSewingKPIAnalysis(){
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
        Line : checkedLines,
        Location : checkedLocations,
        Unit : checkedUnits,
        StartDate : startDateTime,
        EndDate : endDateTime
    }
    this.calculateOperatorWIP(this.KPIView);
    this.calculateAvgOperatorWIP(this.KPIView);
    this.calculateHighOperatorWIP(this.KPIView);
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

activeTab = 'lowOperator';

lowOperator(activeTab){
    this.activeTab = activeTab;
  }

avgOperator(activeTab){
    this.activeTab = activeTab;
    this.calculateAvgOperatorWIP(this.KPIView);
  }

highOperator(activeTab){
    this.activeTab = activeTab;
    this.calculateHighOperatorWIP(this.KPIView);
  } 

  navigateWIPOperator(){
    this._router.navigate(['wip-overview']);
  }

  navigateWIPSummary(){
    this._router.navigate(['wip-summary']);
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
  navigateWIPEffDefectOverview(){
    this._router.navigate(['operator-eff-defect']);
  }

}
