import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.js';
import { data } from 'jquery';
declare var require: any;
import * as XLSX from 'xlsx';  

@Component({
  selector: 'app-inlinewipsummary',
  templateUrl: './inlinewipsummary.component.html',
  styleUrls: ['./inlinewipsummary.component.css']
})
export class InlinewipsummaryComponent implements OnInit {
  @ViewChild('OperatorsTable') OperatorsTable: ElementRef;  
  @ViewChild('TABLE') TABLE: ElementRef;  
  constructor(private http: HttpClient,private _router: Router) { }
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  operatorsSummaryData = [];

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
    var KPIView = JSON.parse(sessionStorage.getItem("KPIView"))
    // var KPIView = {
    //   Line : [1,2],
    //   Location : [1,2],
    //   Unit : [1,2],
    //   StartDate : "2021-01-01 00:00:00.000",
    //   EndDate : "2021-01-31 00:00:00.000",
    // }
    this.calculateWIPOperatorSummary(KPIView);
  }
  recommendationModalTitle : any = "";
  data : any = [];
  operatorsDetailsList = [];
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

  backToPrevious(){
    window.history.back();
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
      Line : checkedLines,
      Location : checkedLocations,
      Unit : checkedUnits,
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    this.calculateWIPOperatorSummary(KPIView);
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
  ExportToExcelOperatorsDetails() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.OperatorsTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'InLine_Operators_Details.xlsx');  
  } 
  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'InLine_WIP_Recommendation.xlsx');  
  }

  calculateWIPOperatorSummary(KPIView){
    var _this = this;
    var url = environment.backendUrl + "OperatorsWIPSummary";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      responsedata["data"].forEach(element => {
        _this.operatorsSummaryData.push({
          Unit : element.Unit,
          Line : element.Line,
          OperatorName : element.OperatorName,
          WIPData : element.WIPData,
          OpearationName : element.OpearationName,
          MachineName : element.MachineName
        })
      });
    });
  }

  navigateWIPOperator(){
    this._router.navigate(['wip-operator']);
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
