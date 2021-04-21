import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import * as  Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
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
  selector: 'app-absentism',
  templateUrl: './absentism.component.html',
  styleUrls: ['./absentism.component.css']
})
export class AbsentismComponent implements OnInit {

  @ViewChild('TABLE') TABLE: ElementRef;  
  @ViewChild('LowEfficiencyOperatorsTable') LowEfficiencyOperatorsTable: ElementRef;  
  @ViewChild('ModerateEfficiencyTable') ModerateEfficiencyTable: ElementRef;  
  @ViewChild('ModerateEfficiencyOperatorsTable') ModerateEfficiencyOperatorsTable: ElementRef; 
  @ViewChild('HighEfficiencyOperatorsTable') HighEfficiencyOperatorsTable: ElementRef;   
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
  
  absentismScatter: Chart;

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
    var KPIView = {
      Line : [],
      Location : [],
      Unit : [],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateOperatorsAbsentism(KPIView);
  }
  calculateOperatorsAbsentism(KPIView){
    var _this = this;
    var url = environment.backendUrl + "OperatorsAbsentism";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.absentismScatter = new Chart( {
          chart: {
              type: 'scatter',
              zoomType: 'xy'
          },
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
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          yAxis: {
                max: 20,
                min: 0,
              title: {
                  text: 'Defect%'
              }
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
                      pointFormat: 'Op{point.x} has absentism {point.y}%'
                  }
              }
          },
          series: responsedata["data"]
      });
    })
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

  getOperatorsAbsentismAnalysis(){
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
      Line : checkedLines,
      Location : checkedLocations,
      Unit : checkedUnits,
      // StartDate : "2021-01-31 00:00:00.000",
      // EndDate : "2021-01-31 00:00:00.000",
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    
    this.calculateOperatorsAbsentism(KPIView);
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
    console.log("------Recommendation Id--------",recommendationId);
    this.data = [];
    var recommendationView ={
      KPIId : 3,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      if(recommendationId == 22){
        _this.recommendationModalTitle = "Recommemdations for Low Operators"
        _this.getOperatorsName('Low')
      }
      else if(recommendationId == 23){
        _this.recommendationModalTitle = "Recommemdations for Moderate Operators"
        _this.getOperatorsName('Moderate');
      }
      else{
        _this.getOperatorsName('High');
      }
      responsedata["allRecommendations"].forEach(element => {
        _this.data.push({
          Reasons : element["Reasons"],
          Recommendations : element["Recommendations"],
          SubReasons : element["SubReasons"],
        });
      });
      // _this.recommendationData = responsedata;
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
  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Low_Absentism.xlsx');  
  }  
  ExportToExcelLowOperators(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.LowEfficiencyOperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Low_Absentism_Operators.xlsx');  
  }
  ExportToExcelModerateEfficiency(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateEfficiencyTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Absentism.xlsx');  
  }
  ExportToExcelModerateOperators(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateEfficiencyOperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Absentism_Operators.xlsx');  
  }
  ExportToExcelHighOperators(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateEfficiencyOperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Absentism_Operators.xlsx');  
  }
}
