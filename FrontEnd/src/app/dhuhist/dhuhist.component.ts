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
  selector: 'app-dhuhist',
  templateUrl: './dhuhist.component.html',
  styleUrls: ['./dhuhist.component.css']
})
export class DhuhistComponent implements OnInit {

 
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
  
  dhuLine: Chart;
  defectDHULine: Chart;
  avgDefectsBar: Chart;

constructor(private http: HttpClient,private _router: Router) { }

ngOnInit() {
  $("#topnavbar").hide();
  $("#footer").css("margin-left", "15%");
  $("#footer").hide();
  $(".footer").hide();
  this.calculateDHU('KPIView');
  this.calculateDHUByDefect('KPIView');
  this.calculateAvgDefectsDHU('KPIView');
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
  this.calculateDHU(KPIView);
  this.calculateDHUByDefect(KPIView);
  this.calculateAvgDefectsDHU(KPIView);
}
calculateDHU(KPIView){
   var _this = this;
  // var url = environment.backendUrl + "OperatorEfficiency";
  // this.http.post<any>(url, KPIView).subscribe(responsedata => {
    this.dhuLine = new Chart({
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
          categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
  '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
  '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
         
      },
      yAxis: {
          title: {
              text: 'DHU %'
          },
          max:100,
          min:0
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
          }
      },
      series: [{
          name: 'DHU %',
          showInLegend: false,
          data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
          color: '#175d2d'
  
      }]
  });
  }

calculateDHUByDefect(KPIView){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.defectDHULine = new Chart(
      {
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
          categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
  '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
  '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
         
      },
      yAxis: {
          title: {
              text: 'DHU %'
          },
          max:100,
          min:0
      },
      tooltip: {
          crosshairs: true,
          shared: true
      },
      plotOptions: {
          spline: {
              marker: {
                  radius: 4,
                  lineColor: '#666666',
                  lineWidth: 1
              }
          }
      },
      series: [{
          name: 'Defect 1',
          /* showInLegend: false, */
          data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
          color: 'yellow'
  
      },
      {
          name: 'Defect 2',
          /* showInLegend: false, */
          data: [12, 29, 34,38,42,20,25,63,12,3,10,25,87,79,60],
          color: 'red'
  
      },
      {
          name: 'Defect 3',
          /* showInLegend: false, */
          data: [73, 69, 55,48,35,74,25,35,36,33,42,79,69,65,60],
          color: 'red'
  
      },
      {
          name: 'Defect 4',
          /* showInLegend: false, */
          data: [9, 13, 8,5,8,4,4,4,10,11,13,10,10,5,5],
          color: 'green'
  
      }]
    });
  }

calculateAvgDefectsDHU(KPIView){
    var _this = this;
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
     this.avgDefectsBar = new Chart(
      {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['Defect 1', 'Defect 2', 'Defect 3', 'Defect 4']
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: 'DHU %'
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
                data: [
                {y:3.5, color:'green'}, 
                {y:7, color:'green'}, 
                {y:12, color:'red'}, 
                {y:9, color:'yellow'}],
                dataLabels: {
                  align: 'left',
                  enabled: true
              }
        }]
    }
      );
   }
}
