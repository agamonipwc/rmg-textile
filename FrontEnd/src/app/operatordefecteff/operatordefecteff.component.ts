import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { environment } from 'src/environments/environment.js';
@Component({
  selector: 'app-operatordefecteff',
  templateUrl: './operatordefecteff.component.html',
  styleUrls: ['./operatordefecteff.component.css']
})
export class OperatordefecteffComponent implements OnInit {
  KPIView : any = {};
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  highEfficiencyLowDefectOperatorSummaryDataList : any = [];
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
  getFilterData(){
    this.KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateEfficientDefectOperatorsList(this.KPIView);
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
    this.calculateEfficientDefectOperatorsList(this.KPIView);
  }

  calculateEfficientDefectOperatorsList(KPIView){
    var _this = this;
    this.highEfficiencyLowDefectOperatorSummaryDataList = [];
    this.lowEfficiencyHighDefectOperatorSummaryDataList = [];
    var url = environment.backendUrl + "OperatorDefectEfficiency";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      responsedata["highEfficiencyLowDefectOperatorSummaryDataList"].forEach(element => {
        _this.highEfficiencyLowDefectOperatorSummaryDataList.push({
          DefectCount : element["DefectCount1Data"],
          Efficiency : element["ProdData"],
          OperatorName : element["OperatorName"]
        });
      });

      responsedata["lowEfficiencyHighDefectOperatorSummaryDataList"].forEach(element => {
        _this.lowEfficiencyHighDefectOperatorSummaryDataList.push({
          DefectCount : element["DefectCount1Data"],
          Efficiency : element["ProdData"],
          OperatorName : element["OperatorName"]
        });
      });
    })
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
    }

  highOperator(activeTab){
    this.activeTab = activeTab;
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
