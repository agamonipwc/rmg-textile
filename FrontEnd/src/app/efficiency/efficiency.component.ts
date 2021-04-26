import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as  Highcharts from 'highcharts';
import { Router } from '@angular/router';
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
  selector: 'app-sewingmodule',
  templateUrl: './efficiency.component.html',
  styleUrls: ['./efficiency.component.css']
})
export class EfficiencyComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  
  @ViewChild('LowEfficiencyOperatorsTable') LowEfficiencyOperatorsTable: ElementRef;  
  @ViewChild('ModerateEfficiencyTable') ModerateEfficiencyTable: ElementRef;  
  @ViewChild('ModerateEfficiencyOperatorsTable') ModerateEfficiencyOperatorsTable: ElementRef; 
  @ViewChild('HighEfficiencyOperatorsTable') HighEfficiencyOperatorsTable: ElementRef;   
  title = 'Excel';  
  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  @ViewChild("container", { read: ElementRef }) container: ElementRef;
  @ViewChild("efficiencyContainer", { read: ElementRef }) efficiencyContainer: ElementRef;
  @ViewChild("dhuRejectDefectContainer", { read: ElementRef }) dhuRejectDefectContainer: ElementRef;
  @ViewChild('dataTable') table;
  dataTable: any;
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  capacityCalculationHeadingColor = "";

  data : any = [];
  operatorsDetailsList = [];
  
  operatorScatterOptions: any;
  headerTextValue : string = "";

  constructor(private http: HttpClient,private _router: Router) {
   }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.getMasterData();
    this.getFilterData();
    $("#footer").hide();
    $(".footer").hide();
    $("path").attr("visibility","visible");
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
      Line : [],
      Location : [],
      Unit : [],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateOperatorEfficiency(KPIView);
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.efficiencyHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.efficiencyHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
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

  calculateOperatorEfficiency(KPIView){
    var _this = this;
    var url = environment.backendUrl + "OperatorEfficiency";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.operatorScatterOptions = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Operator Efficiency',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px','display': 'none'},
        },
       
        xAxis: {
            title: {
                enabled: false,
                text: 'Operator ID',
            },
            visible : false,
            labels: {
              enabled: false,
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
        },
        yAxis: {
          max: 110,
          min: 0,
          title: {
              enabled: true,
              text: 'Efficiency (%)',
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
                    pointFormat: '{point.name} : {point.y} %'
                }
            }
        },
        series: responsedata["data"],
        visible : true
      }
      Highcharts.chart('operatorScatter', _this.operatorScatterOptions);
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
        this.headerTextValue = environment.efficiencyHeaderText + " on " + userFormattedDateOutput["startDateTime"];
      }
      else{
        this.headerTextValue = environment.efficiencyHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
      }
      this.calculateOperatorEfficiency(KPIView);
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
  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 1,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      if(recommendationId == 6){
        _this.recommendationModalTitle = "Recommemdations for Low Performance"
        _this.getOperatorsName('Low');
      }
      else{
        _this.recommendationModalTitle = "Recommemdations for Moderate Performance"
        _this.getOperatorsName('Moderate');
      }
      _this.data.push({
        Reasons : responsedata["allRecommendations"][0]["Reasons"],
        Recommendations : responsedata["allRecommendations"][0]["Recommendations"],
        SubReasons : responsedata["allRecommendations"][0]["SubReasons"],
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
          Operation : element["OperationName"],
          Machine : element["Machine"],
          Unit : element["Unit"],
          Location : element["Location"],
          Line : element["Line"]
        });
      });
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
}
