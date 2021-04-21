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
  selector: 'app-machinedowntimehist',
  templateUrl: './machinedowntimehist.component.html',
  styleUrls: ['./machinedowntimehist.component.css']
})
export class MachinedowntimehistComponent implements OnInit {

 
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
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateDowntime(KPIView);
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
            max:20,
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

  getSelectedLocationLineUnit(){
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
      Line : [1,2],
      Location : checkedLocations,
      Unit : checkedUnits,
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    return this.KPIView;
   }

   getSewingKPIAnalysis(){
    var KPIView = this.getSelectedLocationLineUnit();
    this.calculateDowntime(KPIView);
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
