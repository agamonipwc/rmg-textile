import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import * as  Highcharts from 'highcharts';
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
import { style } from '@angular/animations';
// Initialize exporting module.
Exporting(Highcharts);

@Component({
  selector: 'app-sewingmodule',
  templateUrl: './sewingmodule.component.html',
  styleUrls: ['./sewingmodule.component.css']
})
export class SewingmoduleComponent implements OnInit {
  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  @ViewChild("container", { read: ElementRef }) container: ElementRef;
  @ViewChild("efficiencyContainer", { read: ElementRef }) efficiencyContainer: ElementRef;
  @ViewChild("dhuRejectDefectContainer", { read: ElementRef }) dhuRejectDefectContainer: ElementRef;
  year :any = [
    {id: 2019, name: '2019'},
    {id: 2021, name: '2021'},
    {id: 2022, name: '2022'}
  ]
  startDate : Date;
  endDate : Date;
  options: DatepickerOptions = {
    locale: enLocale,
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    minDate: new Date(Date.now()), // Minimal selectable date
    // maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: {}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
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
  line : any = []
  unit : any = [];
  location : any = [];
  selectedYear = [];
  selectedMonth = [];
  selectedLine = [];
  selectedUnit = [];
  selectedLocation = [];
  capacityCalculationHeadingColor = "";
  // capacityCalcGaugeFormat : Chart;
  // columnsOptions : Chart;

  constructor(private http: HttpClient,) {
    this.startDate = new Date();
    this.endDate = new Date();
   }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.selectAllOptions();
    this.getFilterData();
    // this.getSewingKPIAnalysis();
    
  }
  getFilterData(){
    var _this = this;
    this.http.get<any>(this.userBackendUrl).subscribe(data=>{
      if(data.statusCode == 200){
        data.responseData.lineMasterData.forEach(element => {
          _this.line.push({id:element.Id, name: element.Name});
        });
        data.responseData.unitMasterData.forEach(element => {
          _this.unit.push({id:element.Id, name: element.Name});
        });
        data.responseData.locationMasterData.forEach(element => {
          _this.location.push({id:element.Id, name: element.Name})
        });
        var year= this.startDate.getFullYear();
        var month = this.startDate.getMonth();
        $("#year_"+year).prop('checked', true);
        $("#month_"+month).prop('checked', true);
        $("#line_"+_this.line[0].id).prop('checked', true);
        _this.selectedYear.push(parseInt($("#year_"+year).val()));
        _this.selectedMonth.push(parseInt($("#month_"+month).val()));
        _this.selectedLine.push(1);
        var KPIView = {
          Year : _this.selectedYear,
          Month : _this.selectedMonth,
          Line : _this.selectedLine
        }
        _this.callCapacityUtilizationApi(KPIView);
      }
    });
  }
  
  getSewingKPIAnalysis(){
    var _this = this;
    var lineSelected = [];
    var monthSelected = [];
    var  yearSelected = [];
    $('input[name="options[line]"]:checked').each(function(i){
      lineSelected.push(parseInt($(this).val()));
    });
    $('input[name="options[month]"]:checked').each(function(i){
      monthSelected.push(parseInt($(this).val()));
    });
    $('input[name="options[year]"]:checked').each(function(i){
      yearSelected.push(parseInt($(this).val()));
    });
    this.selectedYear = yearSelected;
    this.selectedLine = lineSelected;
    this.selectedMonth = monthSelected;
    var KPIView = {
      Year : this.selectedYear,
      Month : this.selectedMonth,
      Line : [1,2]
    }
    this.callCapacityUtilizationApi(KPIView);
    // this.callEfficiencyCalculationApi(KPIView);
  }

  callCapacityUtilizationApi(KPIView){
    var _this = this;
    this.http.post<any>(this.userBackendUrl, KPIView).subscribe(responsedata => {
      if(responsedata.StatusCode == 200){
        $("#capacityVisual").show();
        $("#efficiencyVisual").show();
        $("#dhuRejectDefectVisual").show();
        _this.capacityCalculationHeadingColor = responsedata["CapaCityCalculation"]["Value"]["colorCode"]
        Highcharts.chart(this.container.nativeElement, {
          // Created pie chart using Highchart
          chart: {
            type: 'solidgauge',
            width : 250,
            marginleft: 20
          },
  
          title: {
            text: 'Capacity Calculation',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '17px', 'color': _this.capacityCalculationHeadingColor}
          },
          credits: {enabled: false},
          pane: {
              center: ['50%', '85%'],
              size: '140%',
              startAngle: -90,
              endAngle: 90,
              background: {
                  backgroundColor: '#ffffff',
                  innerRadius: '60%',
                  outerRadius: '100%',
                  shape: 'arc'
              }
          },
      
          exporting: {
              enabled: false
          },
      
          tooltip: {
            enabled: false
          },
      
          yAxis: {
              stops: [
                [0.3, '#e0301e'],
                [0.6, '#ffb600'],
                [1, '#175d2d']
              ],
              lineWidth: 0,
              tickWidth: 0,
              minorTickInterval: null,
              tickAmount: 2,
              title: {
                  y: -70
              },
              labels: {
                  y: 16
              },
              min: 0,
              max: 100,
          },
      
          plotOptions: {
            solidgauge: {
              size: 150,
              dataLabels: {
                  y: 5,
                  borderWidth: 0,
                  useHTML: true
              },
              events: {
                click: function() {
                    // document.getElementById('back').style.display = "block";
                    // Highcharts.chart('container', columnsOptions);
                }
            }
            }
          },
          series: [
            {
              name : "Cumulative",
              data: [{
                y: responsedata["CapaCityCalculation"]["Value"]["capacityCalculation"],
                drilldown: null
              }],
              dataLabels: {
              format:
                '<div style="text-align:center">' +
                '<span style="font-size:15px">{y}%</span><br/>' +
                '</div>'
              },
            }
          ],
          // drilldown: {
          //   series: [{
          //     type:'pie',
          //     name: 'Cumulative',
          //     id: 'A',
          //     data: [
          //       ['Win 7', 55.03],
          //       ['Win XP', 15.83],
          //       ['Win Vista', 3.59],
          //       ['Win 8', 7.56],
          //       ['Win 8.1', 6.18]
          //     ]
          //   }]
          // }
        })

        Highcharts.chart(this.efficiencyContainer.nativeElement, {
          chart: {
              zoomType: 'xy',
              width : 350,
              marginleft: 10
          },
          exporting: {
            enabled: false
          },
          title: {
              text: '%Efficiency vs Weightage',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '17px', 'color': _this.capacityCalculationHeadingColor}
          },
          xAxis: [{
              categories: responsedata["Efficiency"]["Value"]["monthCategory"],
              crosshair: true
          }],
          credits: {enabled: false},
          yAxis: [{ 
              labels: {
                  format: '{value}',
                  style: {
                      // color: "#eb8c00",
                      style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                  }
              },
              title: {
                  text: '% Efficiency',
                  style: {
                      // color: "#d04a02",
                      style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                  }
              }
          }, { // Secondary yAxis
              title: {
                  text: 'Weightage',
                  style: {
                      // color: "#eb8c00",
                      style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      // color: "#d04a02",
                      style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                  }
              },
              opposite: true
          }],
          tooltip: {
              shared: true
          },
          // plotOptions: {
          //   line: {
          //     // dataLabels: {
          //     //     enabled: true
          //     // },
          //     size: 150,
          //     enableMouseTracking: false
          //   },
          //   column: {
          //       // dataLabels: {
          //       //     enabled: true
          //       // },
          //     size: 150,
          //     enableMouseTracking: false
          //   },
          // },
          legend: {
              layout: 'vertical',
              align: 'left',
              x: 120,
              verticalAlign: 'bottom',
              y: 100,
              floating: true,
              backgroundColor:
                  Highcharts.defaultOptions.legend.backgroundColor || // theme
                  'rgba(255,255,255,0.25)'
          },
          series: responsedata["Efficiency"]["Value"]["efficiencyWeitageResponse"]
          
        });

        //customize pie chart color
        var pieColors = (function () {
          var colors = [],
              base = "#d04a02",
              i;
          for (i = 0; i < 10; i += 1) {
              colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
          }
          return colors;
        }());
        Highcharts.chart(this.dhuRejectDefectContainer.nativeElement, {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            width: 300,
          },
          title: {
            text: 'Defect vs Reject vs Alter',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'color': _this.capacityCalculationHeadingColor}
          },
          accessibility: {
              point: {
                  valueSuffix: '%'
              }
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  size: 100,
                  colors: pieColors,
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                  }
              }
          },
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          series: [{
              data: responsedata["DefectRejectDHUPercentage"]["Value"]
          }]
        });
      }
      else{
        // _this.validationMsg = data["message"];
        return;
      }
    })

  }

  
  selectAllOptions(){
    $('.yearSelectAll').click(function() {
      // var yearSelected = [];
      if ($(this).is(':checked')) {
          $('.year').prop('checked', true);
          // $('input[name="options[year]"]:checked').each(function(i){
          //   yearSelected.push(parseInt($(this).val()));
          // });
          $("#yearSelectText").html(' Deselect');
      } else {
          $('.year').prop('checked', false);
          $("#yearSelectText").html(' Select');
      }
      // this.selectedYear = yearSelected;
    });

    $('.monthSelectAll').click(function() {
      // var monthSelected = [];
      if ($(this).is(':checked')) {
          $('.month').prop('checked', true);
          // $('input[name="options[month]"]:checked').each(function(i){
          //   monthSelected.push(parseInt($(this).val()));
          // });
          $("#monthSelectText").html(' Deselect');
      } else {
          $('.month').prop('checked', false);
          $("#monthSelectText").html(' Select');
      }
      // this.selectedMonth = monthSelected;
    });

    $('.lineSelectAll').click(function() {
      // var lineSelected = [];
      if ($(this).is(':checked')) {
          $('.line').prop('checked', true);
          // $('input[name="options[line]"]:checked').each(function(i){
          //   lineSelected.push(parseInt($(this).val()));
          // });
          $("#lineSelectText").html(' Deselect');
      } else {
          $('.line').prop('checked', false);
          $("#lineSelectText").html(' Select');
      }
      // this.selectedLine = lineSelected;
    });

    $('.locationSelectAll').click(function() {
      var locationSelected = []
      if ($(this).is(':checked')) {
          $('.location').prop('checked', true);
          $('input[name="options[]"]:checked').each(function(i){
            locationSelected.push($(this).val());
          });
          $("#locationSelectText").html(' Deselect');
      } else {
          $('.location').prop('checked', false);
          $("#locationSelectText").html(' Select');
      }
      this.selectedLocation = locationSelected;
    });

    $('.unitSelectAll').click(function() {
      var unitSelected = [];
      if ($(this).is(':checked')) {
          $('.unit').prop('checked', true);
          $('input[name="options[]"]:checked').each(function(i){
            unitSelected.push($(this).val());
          });
          $("#unitSelectText").html(' Deselect');
      } else {
          $('.unit').prop('checked', false);
          $("#unitSelectText").html(' Select');
      }
      this.selectedUnit = unitSelected;
    });
  }
}
