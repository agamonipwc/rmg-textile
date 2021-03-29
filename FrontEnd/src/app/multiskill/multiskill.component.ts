import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
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
  selector: 'app-multiskill',
  templateUrl: './multiskill.component.html',
  styleUrls: ['./multiskill.component.css']
})
export class MultiskillComponent implements OnInit {


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
    
    multiskillBar: Chart;

  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();
    this.calculateMultiskill('KPIView');
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
    this.calculateMultiskill(KPIView);
  }

  calculateMultiskill(KPIView){
     var _this = this;
    // var url = environment.backendUrl + "OperatorEfficiency";
    // this.http.post<any>(url, KPIView).subscribe(responsedata => {

    _this.multiskillBar = new Chart(
      {
        chart: {
          type: 'bar'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['Op1', 'Op2', 'Op3']
        },
        yAxis: [{
          min: 0,
          enabled: false
        }, {
          title: {
            text: 'Multiskill %'
          },
          opposite: true
        }],
        legend: {
          shadow: false
        },
        tooltip: {
          shared: true
        },
        plotOptions: {
          bar: {
            grouping: false,
            shadow: false,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Multiskill Required',
          color: 'rgba(248,161,63,1)',
          data: [60, 40, 30],
          pointPadding: 0.3,
          pointPlacement: 0.2,
          yAxis: 1
        }, {
          name: 'Multiskill',
          color: 'rgba(186,60,61,.9)',
          data: [40, 30, 20],
          pointPadding: 0.4,
          pointPlacement: 0.2,
          yAxis: 1
        }]
      });

    }

    getRecommendation(recommendationId){
      this.data = [];
      var recommendationView ={
        KPIId : 1,
        recommendationId : recommendationId
      };
      var url = environment.backendUrl + "Recommendation";
      var _this = this;
      // this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      //   if(recommendationId == 6){
      //     _this.recommendationModalTitle = "Recommemdations for Low Operators"
      //   }
      //   else{
      //     _this.recommendationModalTitle = "Recommemdations for Moderate Operators"
      //   }
      //   _this.data.push({
      //     Reasons : responsedata["allRecommendations"][0]["Reasons"],
      //     Recommendations : responsedata["allRecommendations"][0]["Recommendations"],
      //     SubReasons : responsedata["allRecommendations"][0]["SubReasons"],
      //   });
      //   console.log(_this.data);
      //   // _this.recommendationData = responsedata;
      // })
    }
}
