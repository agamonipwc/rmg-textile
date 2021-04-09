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

@Component({
  selector: 'app-inlinewipoperator',
  templateUrl: './inlinewipoperator.component.html',
  styleUrls: ['./inlinewipoperator.component.css']
})
export class InlinewipoperatorComponent implements OnInit {

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
  
  operatorWIP: Chart;
  operatorWIPAvg: Chart;
  operatorWIPHigh: Chart;

constructor(private http: HttpClient,private _router: Router) { }

ngOnInit() {
  $("#topnavbar").hide();
  $("#footer").css("margin-left", "15%");
  $("#footer").hide();
  $(".footer").hide();
  this.calculateOperatorWIP('KPIView');
  this.calculateAvgOperatorWIP('KPIView');
  this.calculateHighOperatorWIP('KPIView');
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
  this.calculateOperatorWIP(KPIView);
}
calculateOperatorWIP(KPIView){
   var _this = this;

  // var url = environment.backendUrl + "OperatorEfficiency";
  // this.http.post<any>(url, KPIView).subscribe(responsedata => {
  _this.operatorWIP = new Chart( {
    
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
  yAxis: {
        max: 100,
        min: 0,
      title: {
          text: 'Defect Per 100 units'
      }
  },
  
  series: [{
      marker: {
        symbol:'circle',
        radius: 4, // DHU Value
      },
      name: 'Op1',
      showInLegend: false,
      color: '#ffb600',
      data: [[1,25]] //Op no & Efficiency
    },{
      name: 'Op26',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 13, // DHU Value
      },
      data: [[26,45]]
    },{
      name: 'Op2',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 14, // DHU Value
      },
      data: [[2,87]]
    },{
      name: 'Op3',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 8, // DHU Value
      },
      data: [[3,37]]
    },{
      name: 'Op4',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 17, // DHU Value
      },
      data: [[4,56]]
    },{
      name: 'Op5',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 9, // DHU Value
      },
      data: [[5,68]]
    },{
      name: 'Op6',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 11, // DHU Value
      },
      data: [[6,65]]
    },{
      name: 'Op7',
      showInLegend: false,
      color: '#175d2d',
      marker: {
        symbol:'circle',
        radius: 4, // DHU Value
      },
      data: [[7,97]]
    },{
      name: 'Op8',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 12, // DHU Value
      },
      data: [[8,86]]
    },{
      name: 'Op9',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 6, // DHU Value
      },
      data: [[9,77]]
    },{
      name: 'Op10',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius:10, // DHU Value
      },
      data: [[10,25]]
    },{
      name: 'Op11',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 11, // DHU Value
      },
      data: [[11,48]]
    },{
      name: 'Op12',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 12, // DHU Value
      },
      data: [[12,25]]
    },{
      name: 'Op13',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 5, // DHU Value
      },
      data: [[13,42]]
    },{
      name: 'Op14',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 13, // DHU Value
      },
      data: [[14,51]]
    },{
      name: 'Op15',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 13, // DHU Value
      },
      data: [[15,10]]
    },{
      name: 'Op16',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 27, // DHU Value
      },
      data: [[16,25]]
    },{
      name: 'Op17',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 8, // DHU Value
      },
      data: [[17,30]]
    },{
      name: 'Op18',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 14, // DHU Value
      },
      data: [[18,25]]
    },{
      name: 'Op19',
      showInLegend: false,
      color: '#175d2d',
      marker: {
        symbol:'circle',
        radius: 4, // DHU Value
      },
      data: [[19,88]]
    },{
      name: 'Op20',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 15, // DHU Value
      },
      data: [[20,31]]
    },{
      name: 'Op21',
      showInLegend: false,
      color: '#e0301e',
      marker: {
        symbol:'circle',
        radius: 3, // DHU Value
      },
      data: [[21,12]]
    },{
      name: 'Op22',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 18, // DHU Value
      },
      data: [[22,36]]
    },{
      name: 'Op23',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 10, // DHU Value
      },
      data: [[23,69]]
    },{
      name: 'Op24',
      showInLegend: false,
      color: '#ffb600',
      marker: {
        symbol:'circle',
        radius: 9, // DHU Value
      },
      data: [[24,56]]
    },{
      name: 'Op25',
      showInLegend: false,
      color: '#175d2d',
      marker: {
        symbol:'circle',
        radius: 2, // DHU Value
      },
      data: [[25,79]]
    }]
   });
  }

calculateAvgOperatorWIP(KPIView){
    var _this = this;
 
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
   _this.operatorWIPAvg = new Chart( {
     
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
   yAxis: {
         max: 100,
         min: 0,
       title: {
           text: 'Defect Per 100 units'
       }
   },
   
   series: [{
       marker: {
         symbol:'circle',
         radius: 4, // DHU Value
       },
       name: 'Op1',
       showInLegend: false,
       color: '#ffb600',
       data: [[1,25]] //Op no & Efficiency
     },{
       name: 'Op26',
       showInLegend: false,
       color: '#e0301e',
       marker: {
         symbol:'circle',
         radius: 13, // DHU Value
       },
       data: [[26,45]]
     },{
       name: 'Op2',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 14, // DHU Value
       },
       data: [[2,87]]
     },{
       name: 'Op3',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 8, // DHU Value
       },
       data: [[3,37]]
     },{
       name: 'Op4',
       showInLegend: false,
       color: '#e0301e',
       marker: {
         symbol:'circle',
         radius: 17, // DHU Value
       },
       data: [[4,56]]
     },{
       name: 'Op5',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 9, // DHU Value
       },
       data: [[5,68]]
     },{
       name: 'Op6',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 11, // DHU Value
       },
       data: [[6,65]]
     },{
       name: 'Op7',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 4, // DHU Value
       },
       data: [[7,97]]
     },{
       name: 'Op8',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 12, // DHU Value
       },
       data: [[8,86]]
     },{
       name: 'Op9',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 6, // DHU Value
       },
       data: [[9,77]]
     },{
       name: 'Op10',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius:10, // DHU Value
       },
       data: [[10,25]]
     },{
       name: 'Op11',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 11, // DHU Value
       },
       data: [[11,48]]
     },{
       name: 'Op12',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 12, // DHU Value
       },
       data: [[12,25]]
     },{
       name: 'Op13',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 5, // DHU Value
       },
       data: [[13,42]]
     },{
       name: 'Op14',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 5, // DHU Value
       },
       data: [[14,52]]
     },{
       name: 'Op15',
       showInLegend: false,
       color: '#e0301e',
       marker: {
         symbol:'circle',
         radius: 13, // DHU Value
       },
       data: [[15,10]]
     },{
       name: 'Op16',
       showInLegend: false,
       color: '#e0301e',
       marker: {
         symbol:'circle',
         radius: 27, // DHU Value
       },
       data: [[16,25]]
     },{
       name: 'Op17',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 8, // DHU Value
       },
       data: [[17,30]]
     },{
       name: 'Op18',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 14, // DHU Value
       },
       data: [[18,25]]
     },{
       name: 'Op19',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 4, // DHU Value
       },
       data: [[19,88]]
     },{
       name: 'Op20',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 15, // DHU Value
       },
       data: [[20,77]]
     },{
       name: 'Op21',
       showInLegend: false,
       color: '#e0301e',
       marker: {
         symbol:'circle',
         radius: 3, // DHU Value
       },
       data: [[21,12]]
     },{
       name: 'Op22',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 18, // DHU Value
       },
       data: [[22,36]]
     },{
       name: 'Op23',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 10, // DHU Value
       },
       data: [[23,69]]
     },{
       name: 'Op24',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 9, // DHU Value
       },
       data: [[24,56]]
     },{
       name: 'Op25',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 2, // DHU Value
       },
       data: [[25,79]]
     }]
    });
  }

calculateHighOperatorWIP(KPIView){
    var _this = this;
 
   // var url = environment.backendUrl + "OperatorEfficiency";
   // this.http.post<any>(url, KPIView).subscribe(responsedata => {
   _this.operatorWIPHigh = new Chart( {
     
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
   yAxis: {
         max: 100,
         min: 0,
       title: {
           text: 'Defect Per 100 units'
       }
   },
   
   series: [{
       marker: {
         symbol:'circle',
         radius: 4, // DHU Value
       },
       name: 'Op1',
       showInLegend: false,
       color: '#ffb600',
       data: [[1,25]] //Op no & Efficiency
     },{
       name: 'Op26',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 9, // DHU Value
       },
       data: [[26,92]]
     },{
       name: 'Op2',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 14, // DHU Value
       },
       data: [[2,87]]
     },{
       name: 'Op3',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 8, // DHU Value
       },
       data: [[3,37]]
     },{
       name: 'Op4',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 10, // DHU Value
       },
       data: [[4,86]]
     },{
       name: 'Op5',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 9, // DHU Value
       },
       data: [[5,68]]
     },{
       name: 'Op6',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 11, // DHU Value
       },
       data: [[6,65]]
     },{
       name: 'Op7',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 4, // DHU Value
       },
       data: [[7,97]]
     },{
       name: 'Op8',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 12, // DHU Value
       },
       data: [[8,86]]
     },{
       name: 'Op9',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 6, // DHU Value
       },
       data: [[9,77]]
     },{
       name: 'Op10',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius:10, // DHU Value
       },
       data: [[10,25]]
     },{
       name: 'Op11',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 11, // DHU Value
       },
       data: [[11,48]]
     },{
       name: 'Op12',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 3, // DHU Value
       },
       data: [[12,82]]
     },{
       name: 'Op13',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 5, // DHU Value
       },
       data: [[13,86]]
     },{
       name: 'Op14',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 5, // DHU Value
       },
       data: [[14,79]]
     },{
       name: 'Op15',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 3, // DHU Value
       },
       data: [[15,82]]
     },{
       name: 'Op16',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 9, // DHU Value
       },
       data: [[16,95]]
     },{
       name: 'Op17',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 6, // DHU Value
       },
       data: [[17,80]]
     },{
       name: 'Op18',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 14, // DHU Value
       },
       data: [[18,25]]
     },{
       name: 'Op19',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 4, // DHU Value
       },
       data: [[19,88]]
     },{
       name: 'Op20',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 15, // DHU Value
       },
       data: [[20,77]]
     },{
       name: 'Op21',
       showInLegend: false,
       color: '#e0301e',
       marker: {
         symbol:'circle',
         radius: 3, // DHU Value
       },
       data: [[21,12]]
     },{
       name: 'Op22',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 18, // DHU Value
       },
       data: [[22,36]]
     },{
       name: 'Op23',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 10, // DHU Value
       },
       data: [[23,69]]
     },{
       name: 'Op24',
       showInLegend: false,
       color: '#ffb600',
       marker: {
         symbol:'circle',
         radius: 9, // DHU Value
       },
       data: [[24,56]]
     },{
       name: 'Op25',
       showInLegend: false,
       color: '#175d2d',
       marker: {
         symbol:'circle',
         radius: 2, // DHU Value
       },
       data: [[25,79]]
     }]
    });
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

}
