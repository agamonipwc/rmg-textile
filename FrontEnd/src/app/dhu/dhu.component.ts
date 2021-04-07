import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
// import * as $ from 'jquery';
// declare var $: any;
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-dhu',
  templateUrl: './dhu.component.html',
  styleUrls: ['./dhu.component.css']
})
export class DhuComponent implements OnInit {

  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  @ViewChild('TABLE') TABLE: ElementRef;  
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
  overDHUValue : any = 0;
  overAllDHUStyle : any = {};

  data : any = [];
  operatorsDetailsList = [];
  
  dhuBar: Chart;

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
      Line : [1,2,3,4],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-31 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateDHU(KPIView);
  }
  calculateDHU(KPIView){
    var _this = this;
    var url = environment.backendUrl + "DHUOverview";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      console.log(responsedata);
      _this.overDHUValue = responsedata["overallDHU"];
      _this.overAllDHUStyle = {
        'background-color' : responsedata["overAllDHUColor"],
        'height' : '30px',
        'width' :  (Math.round((_this.overDHUValue/15)*100) + "%")
      }
      _this.dhuBar = new Chart( 
        {
          chart: {
              type: 'bar'
          },
          title: {
              text: ''
          },
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          xAxis: {
              categories: responsedata["categories"]
          },
          yAxis: {
              min: 0,
              max: 13,
              title: {
                  text: 'Defects Per Hundred Units (D.H.U.)'
              }
          },
          legend: {
              reversed: true
          },
          plotOptions: {
              series: {
                  stacking: 'normal'
              }
          },
          series: [{
                  name:'',
                  showInLegend: false,
                  data: responsedata["data"],
                  dataLabels: {
                    align: 'left',
                    enabled: true
                }
          }]
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
      Line : [1,2],
      Location : checkedLocations,
      Unit : checkedUnits,
      // StartDate : "2021-01-31 00:00:00.000",
      // EndDate : "2021-01-31 00:00:00.000",
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    this.calculateDHU(KPIView);
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

  getRecommendation(){
    this.data = [];
    var recommendationView ={
      KPIId : 4,
      recommendationId : ""
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      _this.recommendationModalTitle = "Recommemdations for Defects Per Hundred Units (D.H.U.)/ Defect %"
      responsedata["allRecommendations"].forEach(element => {
        _this.data.push({
          Reasons : element["Reasons"],
          Recommendations : element["Recommendations"],
          SubReasons : element["SubReasons"],
        });
      });
    })
  }

  ExportToExcelDHU() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'DHU_Recommendations.xlsx');  
  } 

}
