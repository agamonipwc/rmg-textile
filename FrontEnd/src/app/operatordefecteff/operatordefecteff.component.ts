import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { environment } from 'src/environments/environment.js';
import * as XLSX from 'xlsx'; 
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
@Component({
  selector: 'app-operatordefecteff',
  templateUrl: './operatordefecteff.component.html',
  styleUrls: ['./operatordefecteff.component.css']
})
export class OperatordefecteffComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  
  KPIView : any = {};
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  lowEfficiency : any = [];
  highDefect : any = [];
  lowEfficiencyHighDefectOperatorSummaryDataList : any =  [];
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
  headerTextValue : string;
  getFilterData(){
    this.KPIView = JSON.parse(sessionStorage.getItem("KPIView"))
    // this.KPIView = {
    //   Line : [1,2],
    //   Location : [1,2],
    //   Unit : [1,2],
    //   StartDate : "2021-01-01 00:00:00.000",
    //   EndDate : "2021-01-31 00:00:00.000",
    // }
    this.calculateEfficientDefectOperatorsList(this.KPIView);
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.operatorEfficiencyWIPHeaderText 
    }
    else{
      this.headerTextValue = environment.operatorEfficiencyWIPHeaderText 
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
        this.headerTextValue = environment.operatorEfficiencyWIPHeaderText + " on " + userFormattedDateOutput["startDateTime"];
        }
        else{
        this.headerTextValue = environment.operatorEfficiencyWIPHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
        }
        this.calculateEfficientDefectOperatorsList(this.KPIView);
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

  calculateEfficientDefectOperatorsList(KPIView){
    var _this = this;
    this.lowEfficiency = [];
    this.highDefect = [];
    this.lowEfficiencyHighDefectOperatorSummaryDataList = [];
    var url = environment.backendUrl + "OperatorDefectEfficiency";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      responsedata["lowEfficiency"].forEach(element => {
        _this.lowEfficiency.push({
          // DefectCount : element["DefectCount1Data"],
          // Efficiency : element["ProdData"],
          OperatorName : element["OperatorName"],
          Line : element["OperationDescription"]
        });
      });

      responsedata["highDefect"].forEach(element => {
        _this.highDefect.push({
          // DefectCount : element["DefectCount1Data"],
          // Efficiency : element["ProdData"],
          OperatorName : element["OperatorName"],
          Line : element["OperationDescription"]
        });
      });

      responsedata["lowEfficiencyHighDefectOperatorSummaryDataList"].forEach(element => {
        _this.lowEfficiencyHighDefectOperatorSummaryDataList.push({
          // DefectCount : element["DefectCount1Data"],
          // Efficiency : element["ProdData"],
          OperatorName : element["OperatorName"],
          Line : element["OperationDescription"]
        });
      });
    })
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
  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'InLine_WIP_Recommendation.xlsx');  
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
    }
    data = [];
    recommendationModalTitle : string;
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

  highOperator(activeTab){
    this.activeTab = activeTab;
  } 
  backToPrevious(){
    window.history.back();
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
  navigateWIPOperator(){
    this._router.navigate(['wip-overview']);
  }

  navigateWIPSummary(){
    this._router.navigate(['wip-summary']);
  }
}
