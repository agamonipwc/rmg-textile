import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as  Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import * as XLSX from 'xlsx';  
import Swal from 'sweetalert2/dist/sweetalert2.js'; 

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
  selector: 'app-capacityutilization',
  templateUrl: './capacityutilization.component.html',
  styleUrls: ['./capacityutilization.component.css']
})
export class CapacityutilizationComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  
  @ViewChild('LowEfficiencyOperatorsTable') LowEfficiencyOperatorsTable: ElementRef;  
  @ViewChild('ModerateEfficiencyTable') ModerateEfficiencyTable: ElementRef;  
  @ViewChild('ModerateEfficiencyOperatorsTable') ModerateEfficiencyOperatorsTable: ElementRef; 
  @ViewChild('HighEfficiencyOperatorsTable') HighEfficiencyOperatorsTable: ElementRef;   
  title = 'Excel';  
  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  dataTable: any;
  recommendationData : any = [];
  year :any = [
    {id: 2019, name: '2019'},
    {id: 2021, name: '2021'},
    {id: 2022, name: '2022'}
  ]
  startDate : Date = new Date("01/25/2021");
  endDate : Date = new Date("01/31/2021");
  
  recommendationModalTitle : any = "";
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  capacityCalculationHeadingColor = "";

  data : any = [];
  operatorsDetailsList = [];
  
  capacityUtilizationScatter: Chart;
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
    this.getFilterData();
    $(function() {
      $("#period_5").prop("checked", true);
      $("#dropdownLinePeriodButton").html("Last 5 days");
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
    this.getMasterData();
  }

  headerTextValue : string;
  getFilterData(){
    $('input[type=radio]').prop('checked',false);
    $("#dropdownLocationMenuButton").html("Choose Option");
    $("#dropdownUnitMenuButton").html("Choose Option");
    $("#dropdownLineMenuButton").html("Choose Option");
    var KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-27 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.capacityUtilizationHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.capacityUtilizationHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
    }
    this.calculateCapacityUtilization(KPIView);
  }
  
  calculateCapacityUtilization(KPIView){
    var _this = this;
    var url = environment.backendUrl + "OperatorsCapacityUtilization";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.capacityUtilizationScatter = new Chart( {
          chart: {
              type: 'scatter',
              zoomType: 'xy'
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
                text: 'Capacity Utiliztion %'
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
          plotOptions: {
              scatter: {
                  marker: {
                      radius: 5,
                      symbol: 'circle',
                      states: {
                          hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                          }
                      }
                  },
                  states: {
                      hover: {
                          marker: {
                              enabled: false
                          }
                      }
                  },
                  tooltip: {
                      headerFormat: '<b>{series.name}</b><br>',
                      pointFormat: '{point.name} : {point.y}'
                  }
              }
          },
          series: responsedata["data"]
      });
    })
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
        this.headerTextValue = environment.capacityUtilizationHeaderText + " on " + userFormattedDateOutput["startDateTime"];
      }
      else{
        this.headerTextValue = environment.capacityUtilizationHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
      }
      this.calculateCapacityUtilization(KPIView);
    }
    else{
      Swal.fire({    
        icon: 'error',  
        title: 'Sorry...',  
        text: 'Please select location, unit ,line, start date and end date to view historical data',  
        showConfirmButton: true
      })  
    }
    // var checkedLocations = $('.option.justone.location:checkbox:checked').map(function() {
    //   var locationId = parseFloat(this.value);
    //   return locationId;
    // }).get();
    // var checkedUnits = $('.option.justone.unit:checkbox:checked').map(function() {
    //   var unitId = parseFloat(this.value);
    //   return unitId;
    // }).get();
    // var checkedLines = $('.option.justone.line:radio:checked').map(function() {
    //   var lineId = parseFloat(this.value);
    //   return lineId;
    // }).get();
    // var StartDate = new Date($('#startDate').val());
    // var startDay = StartDate.getDate();
    // var startmonth = StartDate.getMonth() + 1;
    // var startyear = StartDate.getFullYear();
    // var startDateTime = startyear + "-" + startmonth + '-' + startDay + " 00:00:00.000";
    // var EndDate = new Date($('#endDate').val());
    // var endDay = EndDate.getDate();
    // var endmonth = EndDate.getMonth() + 1;
    // var endyear = EndDate.getFullYear();
    // var endDateTime = endyear + "-" + endmonth + '-' + endDay + " 00:00:00.000";
    // var KPIView = {
    //   Line : checkedLines,
    //   Location : checkedLocations,
    //   Unit : checkedUnits,
    //   // StartDate : "2021-01-31 00:00:00.000",
    //   // EndDate : "2021-01-31 00:00:00.000",
    //   StartDate : startDateTime,
    //   EndDate : endDateTime
    // }
    // this.calculateCapacityUtilization(KPIView);
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
            $('#startDate').val(StartDate);
            var KPIView = {
              Line : [1,2,3,4],
              Location : [1,2],
              Unit : [1,2],
              StartDate : (StartDate + " 00:00:00.000"),
              EndDate : "2021-01-31 00:00:00.000",
            }
            this.calculateCapacityUtilization(KPIView);
            var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
            if($('#startDate').val() == $('#endDate').val()){
              this.headerTextValue = environment.efficiencyHeaderText + " on " + userFormattedDateOutput["startDateTime"];
            }
            else{
              this.headerTextValue = environment.efficiencyHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
            }
          }
        }
      });
    }
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

  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 5,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      _this.data.push({
        Reasons : responsedata["allRecommendations"][0]["Reasons"],
        Recommendations : responsedata["allRecommendations"][0]["Recommendations"],
        SubReasons : responsedata["allRecommendations"][0]["SubReasons"],
      });
      _this.getOperatorsName('Moderate');
      _this.getOperatorsName('Low');
      _this.getOperatorsName('High');
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
          Operation : element["OperationName"],
          Machine : element["Machine"],
          Unit : element["Unit"],
          Location : element["Location"],
          Line : element["Line"]
        });
      });
    })
  }

  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Low_Efficiency.xlsx');  
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
  backToPrevious(){
    window.history.back();
  }
  recommendationLowDivShow(){
    $("#Recommendations").show();
    $("#Operators").hide();
  }

  operatorLowDivShow(){
    $("#Recommendations").hide();
    $("#Operators").show();
  }

  recommendationMediumDivShow(){
    $("#ModerateRecommendations").show();
    $("#ModerateOperators").hide();
  }

  recommendationMediumivShow(){
    $("#ModerateRecommendations").hide();
    $("#ModerateOperators").show();
  }
}
