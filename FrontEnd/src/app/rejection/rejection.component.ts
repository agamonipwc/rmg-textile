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
  selector: 'app-rejection',
  templateUrl: './rejection.component.html',
  styleUrls: ['./rejection.component.css']
})
export class RejectionComponent implements OnInit {

  @ViewChild('LowRejectionTable') LowRejectionTable: ElementRef;  
  @ViewChild('ModerateRejectionTable') ModerateRejectionTable: ElementRef;  
  @ViewChild('HighRejectionTable') HighRejectionTable: ElementRef;  
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
  data : any = [];
  operatorsDetailsList = [];
  
  rejectionLine: Chart;
  styleRejectionBar: Chart;

constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();
    this.getMasterData();
    this.getFilterData();
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
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateRejection(KPIView);
    this.calculateRejectionByStyle(KPIView);
  }

  calculateRejection(KPIView){
   var _this = this;
    var url = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.rejectionLine = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: responsedata["RejectionHistoricalCalculation"]["Value"]["categories"],
            labels: {
              enabled: false
            },
            title: {
              text: 'Daily Date'
            },
        },
        yAxis: {
            title: {
                text: 'Rejection %'
            },
            max:15,
            min:0,
            reversed: true,
            plotLines: [
              {
              color: '#003dab',
              width: 2,
              value: 5,
              dashStyle: 'shortdot'
            },
            {
              color: '#933401',
              width: 2,
              value: 2,
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
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        series: [{
            name: 'Rejection %',
            showInLegend: false,
            data: responsedata["RejectionHistoricalCalculation"]["Value"]["data"],
            color: '#175d2d'
    
        }]
      })
    });
  }

  calculateRejectionByStyle(KPIView){
    var _this = this;
   var url = environment.backendUrl + "RejectionStyle";
   this.http.post<any>(url, KPIView).subscribe(responsedata => {
     _this.styleRejectionBar = new Chart(
      {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
          categories : responsedata["categories"],
          title: {
            text: 'Style Name'
          },
            // categories: ['Style 1', 'Style 2', 'Style 3', 'Style 4']
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        yAxis: {
            min: 0,
            max: 15,
            title: {
                text: 'Rejection %'
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
                // data: [
                //   {y:3.5, color:'green'}, 
                //   {y:7, color:'green'}, 
                //   {y:12, color:'red'}, 
                //   {y:9, color:'yellow'}
                // ],
                dataLabels: {
                  align: 'left',
                  enabled: true
              }
        }]
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
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  }
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
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
      Unit : [1,2],
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    this.calculateRejection(KPIView);
    this.calculateRejectionByStyle(KPIView);
  }
  showStyleData(){
    $("#rejectionLineDiv").height(280);
  }

  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 6,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      console.log(responsedata);
      _this.recommendationModalTitle = "Recommemdations for Rejection"
      // if(recommendationId == 162){
      //   _this.recommendationModalTitle = "Recommemdations for High Rejection"
      // }
      // else{
      //   _this.recommendationModalTitle = "Recommemdations for Moderate Rejection"
      // }
      _this.data.push({
        Reasons : responsedata["allRecommendations"][0]["Reasons"],
        Recommendations : responsedata["allRecommendations"][0]["Recommendations"],
        SubReasons : responsedata["allRecommendations"][0]["SubReasons"],
      });
    })
  }

  ExportToExcelLowRejection(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.LowRejectionTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Low_Rejection.xlsx');  
  }
  ExportToExcelModerateRejection(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.ModerateRejectionTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'Moderate_Rejection.xlsx');  
  }
  ExportToExcelHighRejection(){
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.HighRejectionTable.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'High_Rejection.xlsx');  
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }
}
