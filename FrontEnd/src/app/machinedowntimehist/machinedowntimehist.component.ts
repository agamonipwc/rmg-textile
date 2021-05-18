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
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import * as XLSX from 'xlsx';  
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
  selector: 'app-machinedowntimehist',
  templateUrl: './machinedowntimehist.component.html',
  styleUrls: ['./machinedowntimehist.component.css']
})
export class MachinedowntimehistComponent implements OnInit {

  @ViewChild('TABLE') TABLE: ElementRef;  
  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  capacityCalculationHeadingColor = "";
  data : any = [];
  operatorsDetailsList = [];
  downtimeLine: Chart;
  KPIView : any = {};
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
    this.getMasterData();
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
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateDowntime(KPIView);
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.downtimeHistoricalHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.downtimeHistoricalHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
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
  backToPrevious(){
    window.history.back();
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
  calculateDowntime(KPIView){
    var _this = this;
    var url = environment.backendUrl + "MachineDowntimeHistorical";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.downtimeLine = new Chart({
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
            categories: responsedata["categories"],
            visible : false
        },
        yAxis: {
            title: {
                text: 'Downtime'
            },
            max:30,
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
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 3,
                    // lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              // general options for all series
              connectNulls: true
          }
        },
        series: responsedata["data"]
      });
    })
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
        // _this.getOperatorsName('Moderate');
        responsedata["allRecommendations"].forEach(element => {
            _this.data.push({
              Reasons : element["Reasons"],
              Recommendations : element["Recommendations"],
              SubReasons : element["SubReasons"],
            });
        });
    })
  }

  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Overall_Recommendations.xlsx');  
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

   isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

   getSewingKPIAnalysis(){
    var KPIView = this.getSelectedLocationLineUnit();
    if(this.isEmpty(KPIView) == false){
      this.calculateDowntime(KPIView);
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
    this._router.navigate(['downtime-overview']);
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
}
