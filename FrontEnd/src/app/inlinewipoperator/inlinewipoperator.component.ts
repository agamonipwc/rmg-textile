import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { environment } from 'src/environments/environment.js';
import * as  Highcharts from 'highcharts';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
const More = require('highcharts/highcharts-more');
import * as XLSX from 'xlsx';  
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
  @ViewChild('TABLE') TABLE: ElementRef;  
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
  headerTextValue : string ;

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

getFilterData(){
  this.KPIView = {
    Line : [1,2],
    Location : [1,2],
    Unit : [1,2],
    StartDate : "2021-01-01 00:00:00.000",
    EndDate : "2021-01-31 00:00:00.000",
  }
  this.calculateOperatorWIP(this.KPIView);
  var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
  if($('#startDate').val() == $('#endDate').val()){
    this.headerTextValue = environment.inlineWIPOperatorHeaderText + " on " + userFormattedDateOutput["startDateTime"];
  }
  else{
    this.headerTextValue = environment.inlineWIPOperatorHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
  }
}

calculateOperatorWIP(KPIView){
  KPIView["OperatorType"] = "Low";
  var _this = this;
  var url = environment.backendUrl + "DHUEfficiencyOperator";
  this.http.post<any>(url, KPIView).subscribe(responsedata => {
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
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.name} <br> <b>Efficiency : {point.y} % </b> <br> <b> Defect: {point.x} % </b>'
        },
        // tooltip: {
        //   formatter: function () {
        //       return this.name + '<br>' + ' Efficiency: <b>' + this.y + '%' +
        //           '</b><br> Defect: <b>' + this.x + '</b>' + '%';
        //   }
        // },
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
    if(StartDate > EndDate){
        Swal.fire({    
        icon: 'error',  
        title: 'Sorry...',  
        text: 'StartDate can not be greater than EndDate',  
        showConfirmButton: true
        })  
    }
    else{
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
      this.KPIView = KPIView;
      var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
      if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.inlineWIPOperatorHeaderText + " on " + userFormattedDateOutput["startDateTime"];
      }
      else{
      this.headerTextValue = environment.inlineWIPOperatorHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
      }
      this.calculateOperatorWIP(this.KPIView);
      this.calculateAvgOperatorWIP(this.KPIView);
      this.calculateHighOperatorWIP(this.KPIView);
    }
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

backToPrevious(){
  sessionStorage.removeItem("KPIView")
  window.history.back();
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

ExportToExcelLowEfficiency() {  
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
  const wb: XLSX.WorkBook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
  XLSX.writeFile(wb, 'InLine_WIP_Recommendation.xlsx');  
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
    sessionStorage.removeItem("KPIView")
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

}
