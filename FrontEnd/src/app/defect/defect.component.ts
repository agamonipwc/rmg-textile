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
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.css']
})
export class DefectComponent implements OnInit {

    userBackendUrl : any = environment.backendUrl + 'kpicalculation';
    @ViewChild("container", { read: ElementRef }) container: ElementRef;
    @ViewChild("efficiencyContainer", { read: ElementRef }) efficiencyContainer: ElementRef;
    @ViewChild("dhuRejectDefectContainer", { read: ElementRef }) dhuRejectDefectContainer: ElementRef;
    @ViewChild('dataTable') table;
    dataTable: any;
    recommendationData : any = [];
    year :any = [
      {id: 2019, name: '2019'},
      {id: 2021, name: '2021'},
      {id: 2022, name: '2022'}
    ]
    startDate : Date = new Date("01/25/2021");
    endDate : Date = new Date("01/31/2021");
    options: DatepickerOptions = {
      locale: enLocale,
      minYear: 1970,
      maxYear: 2030,
      displayFormat: 'MMM D[,] YYYY',
      barTitleFormat: 'MMMM YYYY',
      dayNamesFormat: 'dd',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
      minDate: this.startDate, // Minimal selectable date
      // maxDate: new Date(Date.now()),  // Maximal selectable date
      barTitleIfEmpty: 'Click to select a date',
      placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
      addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
      addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
      fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
      useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

    recommendationModalTitle : any = "";
    month : any = [
      {id: 1, name: 'January'},
      {id: 2, name: 'February'},
      {id: 3, name: 'March'},
      {id: 4, name: 'April'},
      {id: 5, name: 'May'},
      {id: 6, name: 'June'},
      {id: 7, name: 'July'},
      {id: 8, name: 'August'},
      {id: 9, name: 'September'},
      {id: 10, name: 'October'},
      {id: 11, name: 'November'},
      {id: 12, name: 'December'},
    ]
    lineOptions : any = []
    unitOptions : any = [];
    locationOptions : any = [];
    capacityCalculationHeadingColor = "";

    data : any = [];
    operatorsDetailsList = [];
    
    defectsScatter: Chart;

  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();
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
    this.getFilterData();
    this.getMasterData();
  }

  getFilterData(){
    var KPIView = {
      Line : [],
      Location : [],
      Unit : [],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateOperatorDefects(KPIView);
  }
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }

  calculateOperatorDefects(KPIView){
    console.log(KPIView);
     var _this = this;
      var url = environment.backendUrl + "OperatorsDefect";
      this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.defectsScatter = new Chart( {
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
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
        yAxis: {
              max: 50,
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
                    pointFormat: 'Op {point.x} produced {point.y} % defects'
                }
            }
        },
        series: responsedata["data"],
        visible : true
      })
    });
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

  getOperatorsDefectAnalysis(){
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
    this.calculateOperatorDefects(KPIView);
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
  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 4,
      recommendationId : recommendationId
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      if(recommendationId == 6){
        _this.recommendationModalTitle = "Recommemdations for Low Operators"
      }
      else{
        _this.recommendationModalTitle = "Recommemdations for Moderate Operators"
      }
      _this.data.push({
        Reasons : responsedata["allRecommendations"][0]["Reasons"],
        Recommendations : responsedata["allRecommendations"][0]["Recommendations"],
        SubReasons : responsedata["allRecommendations"][0]["SubReasons"],
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
}
