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
//import {Chart} from 'highcharts';
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
import { Chart } from 'angular-highcharts';
// Initialize exporting module.
Exporting(Highcharts);

@Component({
  selector: 'app-sewingmodule',
  templateUrl: './efficiency.component.html',
  styleUrls: ['./efficiency.component.css']
})
export class EfficiencyComponent implements OnInit {
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
  startDate : Date = new Date("01/01/2021");
  endDate : Date = new Date("01/10/2021");
  // this.startDate = new Date("01/01/2021");
  //   this.endDate = new Date("01/10/2021");
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


  productionLine1 : Chart;
  operatorLine1 : Chart;
  productionLine2 : Chart;
  operatorLine2 : Chart;
  dhuLine : Chart;
  productionUnit : Chart;
  efficiencyHistoryLocationWise : Chart;
  efficiencyHistoryLineWise : Chart;
  efficiencyHistoryUnitWise : Chart;
  dhuUnit : Chart;
  

  constructor(private http: HttpClient,private _router: Router) {
   }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.selectAllOptions();
    this.getFilterData();
    this.getEfficiencyCharts();
    this.getEfficiencyHistoryCharts();
    $("#footer").hide();
    $(".footer").hide();
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable();
    // $(document).ready(function() {
    //   $('#recommendationTable').DataTable();
    // });
    
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

  getEfficiencyCharts(){

    this.productionLine1 = new Chart({
      chart: {
          type: 'spline'
      },
      title: {
          text: 'Production Efficiency',
          style: {'font-family': 'Arial, Helvetica', 'font-size': '13px'},
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      xAxis: {
          type: 'category'
      },
      yAxis: {
        title: 'Efficiency %',
        min: 0,
        max: 100
     },
      colors: [
                '#eb8c00',
                '#db536a',
                '#e0301e',
                '#eb8c00', 
                '#db536a', 
                '#d93954', 
                '#e0301e',  
                '#92A8CD'
                
          ],
  
  
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true
              },
          column: {
                colorByPoint: true
            }
          }
      },
  
      series: [{
          name: 'Line 1',
          data: [{
            name: '01/01/2021',
            y: 46
        }, {
            name: '01/02/2021',
            y: 38
        }, {
            name: '01/03/2021',
            y: 47
        }, {
            name: '01/04/2021',
            y: 35
        }, {
            name: '01/05/2021',
            y: 31
        }]
      }],
      
  });

    this.operatorLine1 = new Chart({
      chart: {
          type: 'column'
      },
      title: {
          text: 'Operator Performance',
          style: {'font-family': 'Arial, Helvetica', 'font-size': '13px'},
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      xAxis: {
          type: 'category'
      },
      yAxis: {
        title: 'Efficiency %'
     },
      colors: [
            '#eb8c00',
            '#db536a',
            '#e0301e',
            '#eb8c00', 
            '#db536a', 
            '#d93954', 
            '#e0301e',  
            '#92A8CD'
                
          ],


      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true
              },
          column: {
                colorByPoint: true
            }
          }
      },

      series: [{
        name: 'Line 1',
        data: [{
            name: 'Op1',
            y: 43
        }, {
            name: 'Op2',
            y: 27
        }, {
            name: 'Op3',
            y: 32
        }, {
          name: 'Op4',
          y: 48
      }]
    }],
       
  });

  this.productionLine2 = new Chart({
    chart: {
        type: 'spline'
    },
    exporting: {
      enabled: false
    },
    credits: {enabled: false},
    title: {
        text: 'Production Efficiency',
        style: {'font-family': 'Arial, Helvetica', 'font-size': '13px'},
    },
    
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: 'Efficiency %',
        min: 0,
        max: 100
    },
    colors: [
              '#d04a02',
              '#db536a',
              '#eb8c00', 
              '#db536a', 
              '#d93954', 
              '#e0301e', 
              '#d04a02', 
              '#92A8CD'
              
        ],


    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
            },
        column: {
              colorByPoint: true
          }
        }
    },

    series: [{
        name: 'Line 2',
        data: [{
            name: '01/01/2021',
            y: 22
        }, {
            name: '01/02/2021',
            y: 29
        }, {
            name: '01/03/2021',
            y: 29
        }, {
            name: '01/04/2021',
            y: 27
        }, {
            name: '01/05/2021',
            y: 25
        }]
    }],
    
});

  this.operatorLine2 = new Chart({
    chart: {
        type: 'column'
    },
    exporting: {
      enabled: false
    },
    credits: {enabled: false},
    title: {
        text: 'Operator Performance',
        style: {'font-family': 'Arial, Helvetica', 'font-size': '13px'},
    },
    
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: 'Efficiency %'
    },
    colors: [
          '#d04a02',
          '#db536a',
          '#e0301e',
          '#eb8c00', 
          '#db536a', 
          '#d93954', 
          '#e0301e', 
          '#d04a02', 
          '#92A8CD'
              
        ],


    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
            },
        column: {
              colorByPoint: true
          }
        }
    },

    series: [{
      name: 'Line 2',
      data: [{
          name: 'Op1',
          y: 50
      }, {
          name: 'Op2',
          y: 52
      }, {
          name: 'Op3',
          y: 40
      }
      , {
        name: 'Op4',
        y: 32
    }]
  }],
      
});

  }

  getEfficiencyHistoryCharts(){

    this.productionUnit = new Chart({
      chart: {
          type: 'spline'
      },
      title: {
          text: 'Unit Production Efficiency',
          style: {'font-family': 'Arial, Helvetica'},
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      xAxis: {
          type: 'category'
      },
      yAxis: {
        title: 'Efficiency %',
        min: 0,
        max: 100
      },
      colors: [
            '#db536a',
            '#ffb600',
            '#e0301e',
            '#eb8c00', 
            '#db536a', 
            '#d93954', 
            '#e0301e', 
            '#d04a02', 
            '#92A8CD'
          ],
  
  
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true
              },
          column: {
                colorByPoint: true
            }
          }
      },
  
      series: [{
          name: 'Unit 2',
          data: [{
              name: '01/01/2021',
              y: 37
          }, {
              name: '01/02/2021',
              y: 30
          }, {
              name: '01/03/2021',
              y: 45
          },{
            name: '01/04/2021',
            y: 24
          }, {
            name: '01/05/2021',
            y: 29
            }
        ]
      }],
      
  });
  var dateModel = {
    "StartDate" : "2021-01-01",
    "EndDate" : "2021-01-10"
  }
  var url = environment.backendUrl + "DrilldownProductivityLinewise";
  var _this = this;
  this.http.post<any>(url, dateModel).subscribe(responsedata => {
    var colors = [
      '#ffb600',
      '#d04a02',
      '#db536a',
      '#e0301e',
      '#eb8c00', 
      '#db536a', 
      '#d93954', 
      '#e0301e', 
    ];
      // _this.efficiencyHistoryLocationWise = new Chart({
      // chart: {
      //     type: 'spline'
      // },
      // title: {
      //     text: 'Efficiency Overview Location Wise',
      //     style: {'font-family': 'Arial, Helvetica', 'font-size': '13px'},
      // },
      // xAxis: {
      //     type: 'category'
      // },
      // yAxis: {
      //   title: 'Efficiency %',
      //   min: 0,
      //   max: 120
      // },
      // colors: [
      //     '#ffb600',
      //     '#db536a',
      //     '#e0301e',
      //     '#eb8c00', 
      //     '#db536a', 
      //     '#d93954', 
      //     '#e0301e', 
      //     '#d04a02', 
      //     '#92A8CD'
      // ],
      // plotOptions: {
      //     series: {
      //         borderWidth: 0,
      //         dataLabels: {
      //             enabled: true
      //         },
      //     column: {
      //           colorByPoint: true
      //       }
      //     }
      // },
      // series: responsedata["EfficiencyLocationData"]["Value"]["productionSeries"]
      // });

      _this.efficiencyHistoryLineWise = new Chart({
        chart: {
            type: 'column'
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Efficiency Overview Line Wise',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '15px'},
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
          title: {
            text: '% score'
          },
          min: 0,
          max: 120,
          plotLines: [{
            color: '#175d2d',
            width: 2,
            value: 85,
          }]
        },
        tooltip: {
          pointFormat: '% Efficiency: <b>{point.y:.1f}</b>'
        },
        colors: colors,
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                },
            column: {
                  colorByPoint: true
              }
            }
        },
        series: responsedata["EfficiencyLineData"]["Value"]["productionSeries"]
      });

      _this.efficiencyHistoryUnitWise = new Chart({
        chart: {
            type: 'spline'
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Efficiency Overview Unit Wise',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '15px'},
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
          title: {
            text: '% score'
          },
          min: 0,
          max: 120,
          labels: {
            style: {
                fontSize: '10px',
                'font-family': 'Arial, Helvetica'
            },
          },
          plotLines: [{
            color: '#175d2d',
            width: 2,
            value: 85,
          }]
        },
        tooltip: {
          pointFormat: '% Efficiency: <b>{point.y:.1f}</b>'
        },
        colors: colors,
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
            column: {
                  colorByPoint: true
              }
            }
        },
        series: responsedata["EfficiencyUnitData"]["Value"]["productionSeries"]
      });
    })
  
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

  activeTab = 'kpi';

  kpi(activeTab){
    this.activeTab = activeTab;
  }

  detailedAnalysis(activeTab){
    this.activeTab = activeTab;
  }

  guidance(activeTab){
    this.activeTab = activeTab;
    this.getRecommendation();
  }
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  }

  getRecommendation(){
    var recommendationView ={
      KPIId : 1
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      console.log(responsedata);
      _this.recommendationData = responsedata;
    })
  }
}
