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
import * as XLSX from 'xlsx'; 
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-machinedowntime',
  templateUrl: './machinedowntime.component.html',
  styleUrls: ['./machinedowntime.component.css']
})
export class MachinedowntimeComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  
  @ViewChild('MachineDowntimeBreakage') MachineDowntimeBreakage: ElementRef;  
  @ViewChild('LowEfficiencyOperatorsTable') LowEfficiencyOperatorsTable: ElementRef;  
  @ViewChild('ModerateEfficiencyTable') ModerateEfficiencyTable: ElementRef;  
  @ViewChild('ModerateEfficiencyOperatorsTable') ModerateEfficiencyOperatorsTable: ElementRef; 
  @ViewChild('HighEfficiencyOperatorsTable') HighEfficiencyOperatorsTable: ElementRef;   
  machineDowntimeLine: Chart;
  curveFitMachineDowntime : Chart;
  totalDownTime : any = 0;
  totalFeedingDownTime : any = 0;
  totalMachineDownTime : any = 0;
  totalSpecialMachineDownTime : any = 0;
  totalGeneralMachineDownTime : any = 0;
  topFiveMachinesList : any = [];
  topFiveGeneralMachinesList : any = [];
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  totalDownTimeStyle : any = {};
  totalFeedingDownTimeStyle : any = {};
  totalMachineDownTimeStyle : any = {};
  totalSpecialMachineDownTimeStyle : any = {};
  totalGeneralMachineDownTimeStyle : any = {};
  selectedMachineName : any = "";
  KPIView : any = {};
  tableData : any = [];
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  data : any = [];
  operatorsDetailsList = [];
  selectedMachineValue = 5;
  selectedPeriodValue = 5;
  machineCountList =[
    {
      id : 5, name : "Top 5"
    },
    {
      id : 10, name : "Top 10"
    }
  ]
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
  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();

    $(function() {
        // Hide all lists except the outermost.
        // $('ul.tree ul').hide();
      
        // $('.tree li > ul').each(function(i) {
        //   var $subUl = $(this);
        //   var $parentLi = $subUl.parent('li');
        //   var $toggleIcon = '<i class="js-toggle-icon" style="cursor:pointer;">+</i>';
      
        //   $parentLi.addClass('has-children');
          
        //   $parentLi.prepend( $toggleIcon ).find('.js-toggle-icon').on('click', function() {
        //     $(this).text( $(this).text() == '+' ? '-' : '+' );
        //     $subUl.slideToggle('fast');
        //   });
        // });
    });
    this.getFilterData();
    this.getMasterData();
  }
  backToPrevious(){
    window.history.back();
  }
  headerTextValue : string;
  
  getFilterData(){
    $('input[type=radio]').prop('checked',false);
    $("#dropdownLocationMenuButton").html("Choose Option");
    $("#dropdownUnitMenuButton").html("Choose Option");
    $("#dropdownLineMenuButton").html("Choose Option");
    this.KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-31 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateMachineDowntimeOverview(this.KPIView);
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.downtimeOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.downtimeOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
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

  calculateMachineDowntimeOverview(KPIView){
    this.topFiveMachinesList = [];
    var _this = this;
    var url = environment.backendUrl + "MachineDowntimeOverview";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.totalDownTime = responsedata["totalDownTime"] + "%";
      _this.totalFeedingDownTime = responsedata["totalFeedingDownTime"] + "%";
      _this.totalMachineDownTime = responsedata["totalMachineDownTime"] + "%";
      _this.totalSpecialMachineDownTime = responsedata["totalSpecialMachineDownTime"] +"%";
      _this.totalGeneralMachineDownTime = responsedata["totalGeneralMachineDownTime"] +"%";
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
      _this.totalGeneralMachineDownTimeStyle = {
        'background-color' : responsedata["totalGeneralMachineDowntimeColorCode"],
        'height' : '30px',
        'width' :  _this.totalMachineDownTime
      }
      _this.totalSpecialMachineDownTimeStyle = {
        'background-color' : responsedata["totalSpecialMachineDowntimeColorCode"],
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
            'width' :  element["MachineDownTime"] + "%"
          }
        })
      });
      responsedata["topFiveGeneralMachineDowntimeList"].forEach(element => {
        _this.topFiveGeneralMachinesList.push({
          machineName : element["MachineName"],
          machineDownTime : element["MachineDownTime"],
          machineStyle :{
            'background-color' : element["ColorCode"],
            'height' : '30px',
            'width' :  element["MachineDownTime"] + "%"
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
          min:0,
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
      // _this.calculateCurveFitChart(responsedata["categories"],responsedata["curveFitMachineDowntimeData"], responsedata["totalCountDays"]);
    })
   }

   machineCategory = "";
   calculateTopSpecialMachineDowntime(){
    var EndDate = new Date($('#endDate').val());
    var last = new Date(EndDate.getTime() - (this.selectedPeriodValue * 24 * 60 * 60 * 1000));
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
    var startDateTime = year + "-" + monthString + '-' + dayString + " 00:00:00.000";
    this.KPIView["StartDate"] = startDateTime;
    this.KPIView["MachineCount"] = this.selectedMachineValue.toString();
    var KPIView = this.KPIView;
    KPIView["MachineCategory"] = "Special";
    this.machineCategory = "Special";
    this.calculateMachineDowntimeHistoricAnalysis(KPIView);
   }

   calculateTopGeneralMachineDowntime(){
    var EndDate = new Date($('#endDate').val());
    var last = new Date(EndDate.getTime() - (this.selectedPeriodValue * 24 * 60 * 60 * 1000));
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
    var startDateTime = year + "-" + monthString + '-' + dayString + " 00:00:00.000";
    this.KPIView["StartDate"] = startDateTime;
    this.KPIView["MachineCount"] = this.selectedMachineValue.toString();
    var KPIView = this.KPIView;
    KPIView["MachineCategory"] = "General";
    this.machineCategory = "General";
    this.calculateMachineDowntimeHistoricAnalysis(KPIView);
   }

   calculateMachineDowntimeHistoricAnalysis(KPIView){
    var _this = this;
    var url = environment.backendUrl + "MachineDailyDowntime";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.machineDowntimeLine = new Chart({
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
          categories: responsedata["categories"],
          visible : true,
          labels: {
            rotation: -45
          }
        },
        yAxis: {
          title: {
              text: 'Machine Downtime%'
          },
          max:responsedata["maxValue"],
          min:0,
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
              connectNulls: true,
              // lineWidth: 1
          }
            
        },
        series: responsedata["data"]
      });
      _this.calculateCurveFitChart(responsedata["machineDowntimeTabularViewModels"]);
    })
   }

   calculateCurveFitChart(machineDowntimeTabularViewModels){
    this.tableData = [];
    machineDowntimeTabularViewModels.forEach(element => {
      this.tableData.push({
        machineName : element["MachineName"],
        unit : element["UnitName"],
        line : element["LineName"],
        avgMachineDowntime : element["MachineDownTime"],
        frequency : element["WorkingMins"] + "|" + element["TotalMachineCount"]
      });
    });
   }

   showCurveFit(){
     if($("#curveFit").is(":hidden")){
      $("#historicalAnalysisParameters").hide();
      $("#frequencyBtn").html("Show Chart");
      $("#curveFit").show();
      $("#machineDowntimeHistorical").hide();
     }
     else{
      $("#historicalAnalysisParameters").show();
      $("#frequencyBtn").html("Show List");
      $("#curveFit").hide();
      $("#machineDowntimeHistorical").show();
     }
   }

   getSelectedLocationLineUnit(){
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
        return {};
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
        this.KPIView = {
          Line : checkedLines,
          Location : checkedLocations,
          Unit : checkedUnits,
          StartDate : startDateTime,
          EndDate : endDateTime
        }
        var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
        if($('#startDate').val() == $('#endDate').val()){
          this.headerTextValue = environment.downtimeHistoricalHeaderText + " on " + userFormattedDateOutput["startDateTime"];
        }
        else{
          this.headerTextValue = environment.downtimeHistoricalHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
        }
        return this.KPIView;
      }
    }
    else{
      Swal.fire({    
        icon: 'error',  
        title: 'Sorry...',  
        text: 'Please select location, unit ,line, start date and end date to view historical data',  
        showConfirmButton: true
      })  
      return {};
    }
    
   }

   showMachineAnalysis(){
      var EndDate = new Date($('#endDate').val());
      var last = new Date(EndDate.getTime() - (this.selectedPeriodValue * 24 * 60 * 60 * 1000));
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
      // var StartDate = year + "-" + monthString + "-" + dayString;
      var startDateTime = year + "-" + monthString + '-' + dayString + " 00:00:00.000";
      this.KPIView["StartDate"] = startDateTime;
      this.KPIView["MachineCount"] = this.selectedMachineValue.toString();
      this.KPIView["MachineCategory"] = this.machineCategory;
      this.calculateMachineDowntimeHistoricAnalysis(this.KPIView);
      console.log(this.KPIView);
   }
   isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

   getSewingKPIAnalysis(){
    var KPIView = this.getSelectedLocationLineUnit();
    if(this.isEmpty(KPIView) == false){
      this.calculateMachineDowntimeOverview(KPIView);
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

  onPeriodChangeInMachineDowntime(newMachinePeriodValue){
    //console.log("-------MachineDowntime--------",newMachinePeriodValue);
    this.selectedPeriodValue = newMachinePeriodValue
  }

  onMachineCountChangeInMachineDowntime(newMachineCountValue){
    //console.log("-------MachineDowntime--------",newMachineCountValue);
    this.selectedMachineValue = newMachineCountValue
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

   navigateDowntime(){
    this._router.navigate(['downtime-historic']);
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

  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Overall_Recommendations.xlsx');  
  }  
  ExportToExcelLowOperators(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.LowEfficiencyOperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Low_Efficiency_Operators.xlsx');  
  }
  ExportToExcelModerateEfficiency(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateEfficiencyTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Efficiency.xlsx');  
  }
  ExportToExcelModerateOperators(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateEfficiencyOperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Efficiency_Operators.xlsx');  
  }
  ExportToExcelHighOperators(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateEfficiencyOperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Efficiency_Operators.xlsx');  
  }

  ExportToMachineDowntimeBreakage(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.MachineDowntimeBreakage.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Machine_Downtime_Breakage.xlsx');
  }

  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 9,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
        _this.recommendationModalTitle = "Recommemdations for Machine Downtime"
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
