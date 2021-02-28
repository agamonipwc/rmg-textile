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
import { Chart } from 'angular-highcharts';
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
  @ViewChild("mmrWIPContainer", { read: ElementRef }) mmrWIPContainer: ElementRef;
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

  dhuStyle : any = {};
  defectStyle : any= {};
  rejectStyle : any = {};
  
  productionLine : Chart;
  rejectionLine : Chart;
  dhuLine : Chart;
  productionUnit : Chart;
  rejectionUnit : Chart;
  dhuUnit : Chart;
  
  WIPLine : Chart;
  alterationLine : Chart;
  workingLine : Chart;
  WIPUnit : Chart;
  alterationUnit : Chart;
  workingUnit : Chart;

  operatorLine : Chart;
  helperLine : Chart;
  checkerLine : Chart;
  operatorUnit : Chart;
  helperUnit : Chart;
  checkerUnit : Chart;

  constructor(private http: HttpClient,) {
    this.startDate = new Date();
    this.endDate = new Date();
   }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.selectAllOptions();
    this.getFilterData();
    $("#footer").hide();
    $(".footer").hide();

    setInterval(function(){
      $("#dhuCard").addClass("reveal-text");
      $("#defectCard").addClass("reveal-text");
      $("#rejectCard").addClass("reveal-text");
      setTimeout(function(){
        $("#dhuCard").removeClass("reveal-text");
        $("#defectCard").removeClass("reveal-text");
        $("#rejectCard").removeClass("reveal-text");
      }, 1500);
    }, 3000);
    // this.kpi("kpi");
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
        _this.line.forEach(element => {
          var id = element.id.toString();
          $("#line_"+id).prop('checked', true);
        });
        _this.selectedYear.push(parseInt($("#year_"+year).val()));
        _this.selectedMonth.push(parseInt($("#month_"+month).val()));
        _this.selectedLine.push(1);
        var KPIView = {
          Year : _this.selectedYear,
          Month : _this.selectedMonth,
          Line : [1,2,3,4]
          // Line : _this.selectedLine
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
      Line : [1,2,3,4]
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
        $("#mmrWIPVisual").show();
        $("#dhuCard").show();
        $("#defectCard").show();
        $("#rejectCard").show();
        // $("#dhuCard").html("% D.H.U");
        // $("#defectCard").html("% Defect");
        // $("#rejectCard").html("% Reject");

        _this.dhuStyle = {
          backgroundColor : responsedata["DefectRejectDHUPercentage"]["Value"][0]["colorCode"],
          // width : responsedata["DefectRejectDHUPercentage"]["Value"][0]["PercentageValue"],
        }

        _this.defectStyle = {
          backgroundColor : responsedata["DefectRejectDHUPercentage"]["Value"][1]["colorCode"],
          color : responsedata["DefectRejectDHUPercentage"]["Value"][1]["textColor"]
          // width : responsedata["DefectRejectDHUPercentage"]["Value"][1]["PercentageValue"],
        }

        _this.rejectStyle = {
          backgroundColor : responsedata["DefectRejectDHUPercentage"]["Value"][2]["colorCode"],
          color : responsedata["DefectRejectDHUPercentage"]["Value"][2]["textColor"]
          // width : responsedata["DefectRejectDHUPercentage"]["Value"][2]["PercentageValue"],
        }

        $("#dhuCard").html("% D.H.U is: " + responsedata["DefectRejectDHUPercentage"]["Value"][0]["y"]);
        $("#defectCard").html("% Defect is: " + responsedata["DefectRejectDHUPercentage"]["Value"][1]["y"]);
        $("#rejectCard").html("% Reject is: " + responsedata["DefectRejectDHUPercentage"]["Value"][2]["y"]);

        _this.capacityCalculationHeadingColor = responsedata["CapaCityCalculation"]["Value"]["colorCode"];
        var pieColors = (function () {
          var colors = [],
              base = "#eb8c00",
              i;
          for (i = 0; i < 10; i += 1) {
              colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
          }
          return colors;
        }());
        Highcharts.chart(this.container.nativeElement,{
          chart: {
            type: 'pie',
            width: 360,
            },
            colors: [
              '#ffb600',
              '#db536a',
              '#e0301e',
              '#eb8c00', 
              '#db536a', 
              '#d93954', 
              '#e0301e', 
              '#d04a02', 
              '#92A8CD'
              
            ],
            title: {
              text: 'Monthly Capacity on 2021',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
            },
            credits: {enabled: false},
            exporting: {
              enabled: false
            },
            // subtitle: {
            //     text: 'Click the slices to view versions. Source: netmarketshare.com.'
            // },
            xAxis: {
              categories: ['Line1','Line2', 'Line3', 'Line4']
                // showEmpty: false
            },
            yAxis: {
                showEmpty: false
            },
            plotOptions: {
                // series: {
                //     dataLabels: {
                //         enabled: true,
                //         format: '{point.name}: {point.y:.1f}%'
                //     }
                // }
                pie:{
                  size: 125,
                  dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                  },
                  // colors: pieColors,
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
            },

            series: [responsedata["CapaCityCalculation"]["Value"]["capacityUtilizationSeries"]],
            drilldown: {
              series: [
                {
                  "type": "column",
                    name: 'Capacity in line',
                  "id": "utilized",
                  "data": responsedata["CapaCityCalculation"]["Value"]["capacityUtilizationNested"]["nestedData"]
                }
               ]
            }
        })
        // Highcharts.chart(this.container.nativeElement, {
        //   // Created pie chart using Highchart
        //   chart: {
        //     type: 'solidgauge',
        //     width : 250,
        //     marginleft: 20
        //   },
  
        //   title: {
        //     text: 'Capacity Calculation',
        //     style: {'font-family': 'Arial, Helvetica', 'font-size': '17px', 'color': _this.capacityCalculationHeadingColor}
        //   },
        //   credits: {enabled: false},
        //   pane: {
        //       center: ['50%', '85%'],
        //       size: '140%',
        //       startAngle: -90,
        //       endAngle: 90,
        //       background: {
        //           backgroundColor: '#ffffff',
        //           innerRadius: '60%',
        //           outerRadius: '100%',
        //           shape: 'arc'
        //       }
        //   },
      
        //   exporting: {
        //       enabled: false
        //   },
      
        //   tooltip: {
        //     enabled: false
        //   },
      
        //   yAxis: {
        //       stops: [
        //         [0.3, '#e0301e'],
        //         [0.6, '#ffb600'],
        //         [1, '#175d2d']
        //       ],
        //       lineWidth: 0,
        //       tickWidth: 0,
        //       minorTickInterval: null,
        //       tickAmount: 2,
        //       title: {
        //           y: -70
        //       },
        //       labels: {
        //           y: 16
        //       },
        //       min: 0,
        //       max: 100,
        //   },
      
        //   plotOptions: {
        //     solidgauge: {
        //       size: 150,
        //       dataLabels: {
        //           y: 5,
        //           borderWidth: 0,
        //           useHTML: true
        //       },
        //       events: {
        //         click: function() {
        //             // document.getElementById('back').style.display = "block";
        //             // Highcharts.chart('container', columnsOptions);
        //         }
        //     }
        //     }
        //   },
        //   series: [
        //     {
        //       name : "Cumulative",
        //       data: [{
        //         y: responsedata["CapaCityCalculation"]["Value"]["capacityCalculation"],
        //         drilldown: null
        //       }],
        //       dataLabels: {
        //       format:
        //         '<div style="text-align:center">' +
        //         '<span style="font-size:15px">{y}%</span><br/>' +
        //         '</div>'
        //       },
        //     }
        //   ],
        //   // drilldown: {
        //   //   series: [{
        //   //     type:'pie',
        //   //     name: 'Cumulative',
        //   //     id: 'A',
        //   //     data: [
        //   //       ['Win 7', 55.03],
        //   //       ['Win XP', 15.83],
        //   //       ['Win Vista', 3.59],
        //   //       ['Win 8', 7.56],
        //   //       ['Win 8.1', 6.18]
        //   //     ]
        //   //   }]
        //   // }
        // })

        Highcharts.chart(this.efficiencyContainer.nativeElement, {
          chart: {
              zoomType: 'xy',
              width : 360,
              marginleft: 10
          },
          colors: [
            '#ffb600',
            '#db536a',
            '#e0301e',
            '#eb8c00', 
            '#db536a', 
            '#d93954', 
            '#e0301e', 
            '#d04a02', 
            '#92A8CD'
            
          ],
          exporting: {
            enabled: false
          },
          title: {
              text: 'Monthly %Efficiency on 2021',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
          },
          xAxis: [{
              categories: responsedata["Efficiency"]["Value"]["monthCategory"],
              crosshair: false
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
              }
            ],
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
        // var pieColors = (function () {
        //   var colors = [],
        //       base = "#d04a02",
        //       i;
        //   for (i = 0; i < 10; i += 1) {
        //       colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
        //   }
        //   return colors;
        // }());
        // Highcharts.chart(this.dhuRejectDefectContainer.nativeElement, {
        //   chart: {
        //     plotBackgroundColor: null,
        //     plotBorderWidth: null,
        //     plotShadow: false,
        //     type: 'pie',
        //     width: 300,
        //   },
        //   title: {
        //     text: 'Defect vs Reject vs Alter',
        //     style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'color': _this.capacityCalculationHeadingColor}
        //   },
        //   accessibility: {
        //       point: {
        //           valueSuffix: '%'
        //       }
        //   },
        //   plotOptions: {
        //       pie: {
        //           allowPointSelect: true,
        //           cursor: 'pointer',
        //           size: 100,
        //           colors: pieColors,
        //           dataLabels: {
        //               enabled: true,
        //               format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        //               style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
        //           }
        //       }
        //   },
        //   exporting: {
        //     enabled: false
        //   },
        //   credits: {enabled: false},
        //   series: [{
        //       data: responsedata["DefectRejectDHUPercentage"]["Value"]
        //   }]
        // });

        var stackedChartcolors = ["#eb8c00","#ffb600", "#d04a02"],dark = -0.5;
        stackedChartcolors[1] = Highcharts.Color(stackedChartcolors[0]).brighten(dark).get();
        stackedChartcolors[2] = Highcharts.Color(stackedChartcolors[2]).brighten(dark).get();
        Highcharts.chart(this.mmrWIPContainer.nativeElement, {
          chart: {
            type: 'column',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            width: 350,
          },
          colors: [
            '#ffb600',
            '#db536a',
            '#e0301e',
            '#eb8c00', 
            '#db536a', 
            '#d93954', 
            '#e0301e', 
            '#d04a02', 
            '#92A8CD'
            
      ],
          title: {
            text: 'Monthly Inline WIP on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
          },
          xAxis: {
              categories: responsedata["MMRWIPInline"]["Value"]["monthCategory"]
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Total consumption'
              },
              stackLabels: {
                  enabled: true,
                  style: {
                      // fontWeight: 'bold',
                      color: ( 
                          Highcharts.defaultOptions.title.style &&
                          Highcharts.defaultOptions.title.style.color
                      ) || 'gray'
                  }
              }
          },
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          legend: {
              align: 'right',
              x: -30,
              verticalAlign: 'top',
              y: 25,
              floating: true,
              backgroundColor:
                  Highcharts.defaultOptions.legend.backgroundColor || 'white',
              borderColor: '#CCC',
              borderWidth: 1,
              shadow: false
          },
          tooltip: {
              headerFormat: '<b>{point.x}</b><br/>',
              pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
              column: {
                  // stacking: 'normal',
                  pointPadding: 0.2,
                  borderWidth: 0,
                  // dataLabels: {
                  //     enabled: true
                  // },
                  size: 200
              }
          },
          series: [{
            name : responsedata["MMRWIPInline"]["Value"]["name"],
            data: responsedata["MMRWIPInline"]["Value"]["chartDatas"]
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
  //not to change api
  getProductivityLineWiseCharts(){
    $("#productivityLine").show();
    var linewiseChartBackendUrl = environment.backendUrl + 'drilldownlinewise';
    var KPIView = {
        Year : [2021],
        Month : [1],
        Line : [1,2,3,4]
    }
    var _this = this;
    this.http.post<any>(linewiseChartBackendUrl, KPIView).subscribe(responsedata => {
      _this.productionLine = new Chart({
          chart: {
              type: 'spline',
              width: 350,
          },
          yAxis: [{ 
            title: {
                text: 'pcs',
                style: {
                    // color: "#d04a02",
                    style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                }
              }
            }
          ],
          title: {
              text: 'Monthly Alteration on 2021',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
          },
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          xAxis: {
              type: 'category',
              // categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          },
          colors: [
                '#ffb600',
                '#db536a',
                '#e0301e',
                '#571f01', 
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
                  size:350,
              column: {
                    colorByPoint: true
                }
              }
          },
          series: responsedata["ProductionLineWiseAnalysis"]["Value"]["productionMonthDrilldowns"],
          drilldown: {
              series: responsedata["ProductionLineWiseAnalysis"]["Value"]["productionDrilldownMonthSeries"]
          }
      });

      _this.dhuLine = new Chart({
        chart:{
          width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly DHU Analysis on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        colors: [
                  '#ffb600',
                  '#db536a',
                  '#e0301e',
                  '#eb8c00', 
                  '#db536a', 
                  '#d93954', 
                  '#e0301e', 
                  '#d04a02', 
                  '#92A8CD'
          
              ],
    
        // yAxis: {
        //     title: {
        //         text: 'DHU %'
        //     },
            
        //     plotLines: [{
        //     // color: 'red', // Color value
        //     // dashStyle: 'dash', // Style of the plot line. Default to solid
        //     // value: 1.80, // Value of where the line will appear
        //     // width: 2, // Width of the line,
        //     // label: {
        //     //     text: 'Permissible DHU'
        //     // }
        //   }]
        // },
    
        xAxis: {
            // accessibility: {
            //     rangeDescription: 'Range: 2019 to 2021'
            // },
            categories:responsedata["DHULineWiseAnalysis"]["Value"]["categories"]
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                size:350
                // pointStart: 
            },
            column: {
              colorByPoint: true
          }
        },
    
        series: responsedata["DHULineWiseAnalysis"]["Value"]["series"],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
      });

      _this.rejectionLine = new Chart({
        chart: {
            type: 'column',
            width : 350
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Monthly Rejection on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        xAxis: {
            type: 'category'
        },
        colors: [
              '#ffb600',
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
  
        series: responsedata["RejectionLineWiseAnalysis"]["Value"]["rejectionMonthDrilldowns"],
        drilldown: {
            series: responsedata["RejectionLineWiseAnalysis"]["Value"]["rejectionDrilldownMonthSeries"]
        }
      });
    })
  }
  // not to change api
  getProductivityUnitWiseCharts(){
    $("#productivityLine").hide();
    var linewiseChartBackendUrl = environment.backendUrl + 'drilldownunitwise';
    var KPIView = {
        Year : [2021],
        Month : [1],
        Unit : [1,2]
    }
    var _this = this;
    _this.http.post<any>(linewiseChartBackendUrl, KPIView).subscribe(responsedata => {
      this.productionUnit = new Chart({
        chart: {
            type: 'spline',
            width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly Alteration on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        xAxis: {
            type: 'category'
        },
        colors: [
              '#ffb600',
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
    
        series: responsedata["ProductionUnitWiseAnalysis"]["Value"]["productionMonthDrilldowns"],
        drilldown: {
          series: responsedata["ProductionUnitWiseAnalysis"]["Value"]["productionDrilldownMonthSeries"]
        }
      });
      this.dhuUnit = new Chart({
        chart:{
          width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Weekly DHU Analysis on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        colors: [
          '#ffb600',
          '#db536a',
          '#e0301e',
          '#eb8c00', 
          '#db536a', 
          '#d93954', 
          '#e0301e', 
          '#d04a02', 
          '#92A8CD'
        ],
    
        
        xAxis: {
            // accessibility: {
            //     rangeDescription: 'Range: 2019 to 2021'
            // },
            categories:responsedata["DHUUnitWiseAnalysis"]["Value"]["categories"]
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                size:350
                // pointStart: 2010
            },
            column: {
              colorByPoint: true
          }
        },
    
        series: responsedata["DHUUnitWiseAnalysis"]["Value"]["series"],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
      });
      this.rejectionUnit = new Chart({
        chart: {
            type: 'column',
            width : 350
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Monthly Rejection on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        
        xAxis: {
            type: 'category'
        },
        colors: [
                  '#ffb600',
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
  
        series: responsedata["RejectionUnitWiseAnalysis"]["Value"]["rejectionMonthDrilldowns"],
        drilldown: {
            series: responsedata["RejectionUnitWiseAnalysis"]["Value"]["rejectionDrilldownMonthSeries"]
        }
      });
    })
  }

  
  getEfficiencyLineWiseCharts(){
    $("#workEfficiencyLine").show();
    var linewiseChartBackendUrl = environment.backendUrl + 'DrilldownProductivityLinewise';
    var KPIView = {
        Year : [2021],
        Month : [1],
        Line : [1,2,3,4]
    }
    var _this = this;
    this.http.post<any>(linewiseChartBackendUrl, KPIView).subscribe(responsedata => {
      _this.WIPLine = new Chart({
          chart: {
              type: 'spline',
              width: 350,
          },
          title: {
              text: 'Monthly WIP on 2021',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
          },
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          xAxis: {
              type: 'category',
              // categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          },
          yAxis: [{ 
            title: {
                text: 'Nos',
                style: {
                    // color: "#d04a02",
                    style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                }
              }
            }
          ],
          colors: [
                '#ffb600',
                '#db536a',
                '#e0301e',
                '#571f01', 
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
                  size:350,
              column: {
                    colorByPoint: true
                }
              }
          },
          series: responsedata["ProductionLineWiseAnalysis"]["Value"]["productionMonthDrilldowns"],
          drilldown: {
              series: responsedata["ProductionLineWiseAnalysis"]["Value"]["productionDrilldownMonthSeries"]
          }
      });

      _this.alterationLine = new Chart({
        chart:{
          width: 350,
        },
        title: {
            text: 'Monthly Production on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        credits: {enabled: false},
        colors: [
                  '#ffb600',
                  '#db536a',
                  '#e0301e',
                  '#eb8c00', 
                  '#db536a', 
                  '#d93954', 
                  '#e0301e', 
                  '#d04a02', 
                  '#92A8CD'
          
              ],
    
        // yAxis: {
        //     title: {
        //         text: 'DHU %'
        //     },
            
        //     plotLines: [{
        //     // color: 'red', // Color value
        //     // dashStyle: 'dash', // Style of the plot line. Default to solid
        //     // value: 1.80, // Value of where the line will appear
        //     // width: 2, // Width of the line,
        //     // label: {
        //     //     text: 'Permissible DHU'
        //     // }
        //   }]
        // },
    
        xAxis: {
            // accessibility: {
            //     rangeDescription: 'Range: 2019 to 2021'
            // },
            categories:responsedata["DHULineWiseAnalysis"]["Value"]["categories"]
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                size:350
                // pointStart: 
            },
            column: {
              colorByPoint: true
          }
        },
    
        series: responsedata["DHULineWiseAnalysis"]["Value"]["series"],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
      });

      _this.workingLine = new Chart({
        chart: {
            type: 'column',
            width : 350
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Monthly Working on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        xAxis: {
            type: 'category'
        },
        colors: [
              '#ffb600',
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
  
        series: responsedata["RejectionLineWiseAnalysis"]["Value"]["rejectionMonthDrilldowns"],
        drilldown: {
            series: responsedata["RejectionLineWiseAnalysis"]["Value"]["rejectionDrilldownMonthSeries"]
        }
      });
    })
  }

  getEfficiencyUnitWiseCharts(){
    $("#workEfficiencyLine").hide();
    var linewiseChartBackendUrl = environment.backendUrl + 'DrilldownProductivityUnitwise';
    var KPIView = {
        Year : [2021],
        Month : [1],
        Unit : [1,2]
    }
    var _this = this;
    _this.http.post<any>(linewiseChartBackendUrl, KPIView).subscribe(responsedata => {
      this.WIPUnit = new Chart({
        chart: {
            type: 'spline',
            width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'Nos',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly WIP on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        xAxis: {
            type: 'category'
        },
        colors: [
              '#ffb600',
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
    
        series: responsedata["ProductionUnitWiseAnalysis"]["Value"]["productionMonthDrilldowns"],
        drilldown: {
          series: responsedata["ProductionUnitWiseAnalysis"]["Value"]["productionDrilldownMonthSeries"]
        }
      });
      this.alterationUnit = new Chart({
        chart:{
          width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly Production on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        colors: [
          '#ffb600',
          '#db536a',
          '#e0301e',
          '#eb8c00', 
          '#db536a', 
          '#d93954', 
          '#e0301e', 
          '#d04a02', 
          '#92A8CD'
        ],
        xAxis: {
            // accessibility: {
            //     rangeDescription: 'Range: 2019 to 2021'
            // },
            categories:responsedata["DHUUnitWiseAnalysis"]["Value"]["categories"]
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                size:350
                // pointStart: 2010
            },
            column: {
              colorByPoint: true
          }
        },
    
        series: responsedata["DHUUnitWiseAnalysis"]["Value"]["series"],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
      });
      this.workingUnit = new Chart({
        chart: {
            type: 'column',
            width : 350
        },
        exporting: {
          enabled: false
        },
        yAxis: [{ 
          title: {
              text: 'pcs',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        credits: {enabled: false},
        title: {
            text: 'Monthly Working on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        
        xAxis: {
            type: 'category'
        },
        colors: [
                  '#ffb600',
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
  
        series: responsedata["RejectionUnitWiseAnalysis"]["Value"]["rejectionMonthDrilldowns"],
        drilldown: {
            series: responsedata["RejectionUnitWiseAnalysis"]["Value"]["rejectionDrilldownMonthSeries"]
        }
      });
    })
  }

  getResourceStrengthLineWiseCharts(){
    $("#resourceStrengthLine").show();
    var linewiseChartBackendUrl = environment.backendUrl + 'DrilldownResourceStrengthLinewise';
    var KPIView = {
        Year : [2021],
        Month : [1],
        Line : [1,2,3,4]
    }
    var _this = this;
    this.http.post<any>(linewiseChartBackendUrl, KPIView).subscribe(responsedata => {
      _this.operatorLine = new Chart({
          chart: {
              type: 'spline',
              width: 350,
          },
          yAxis: [{ 
            title: {
                text: 'Nos',
                style: {
                    // color: "#d04a02",
                    style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
                }
              }
            }
          ],
          title: {
              text: 'Monthly Operator Count on 2021',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
          },
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          xAxis: {
              type: 'category',
              // categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          },
          colors: [
                '#ffb600',
                '#db536a',
                '#e0301e',
                '#571f01', 
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
                  size:350,
              column: {
                    colorByPoint: true
                }
              }
          },
          series: responsedata["ProductionLineWiseAnalysis"]["Value"]["productionMonthDrilldowns"],
          drilldown: {
              series: responsedata["ProductionLineWiseAnalysis"]["Value"]["productionDrilldownMonthSeries"]
          }
      });

      _this.helperLine = new Chart({
        chart:{
          width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'Nos',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly Helpers Count on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        colors: [
                  '#ffb600',
                  '#db536a',
                  '#e0301e',
                  '#eb8c00', 
                  '#db536a', 
                  '#d93954', 
                  '#e0301e', 
                  '#d04a02', 
                  '#92A8CD'
          
              ],
    
        // yAxis: {
        //     title: {
        //         text: 'DHU %'
        //     },
            
        //     plotLines: [{
        //     // color: 'red', // Color value
        //     // dashStyle: 'dash', // Style of the plot line. Default to solid
        //     // value: 1.80, // Value of where the line will appear
        //     // width: 2, // Width of the line,
        //     // label: {
        //     //     text: 'Permissible DHU'
        //     // }
        //   }]
        // },
    
        xAxis: {
            // accessibility: {
            //     rangeDescription: 'Range: 2019 to 2021'
            // },
            categories:responsedata["DHULineWiseAnalysis"]["Value"]["categories"]
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                size:350
                // pointStart: 
            },
            column: {
              colorByPoint: true
          }
        },
    
        series: responsedata["DHULineWiseAnalysis"]["Value"]["series"],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
      });

      _this.checkerLine = new Chart({
        chart: {
            type: 'column',
            width : 350
        },
        exporting: {
          enabled: false
        },
        yAxis: [{ 
          title: {
              text: 'Nos',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        credits: {enabled: false},
        title: {
            text: 'Monthly Checkers Count on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
      //   yAxis: {
      //     min: 0,
      //     stackLabels: {
      //         enabled: true,
      //         style: {
      //             // fontWeight: 'bold',
      //             color: ( 
      //                 '#2d2d2d' && '#7d7d7d'
      //             )
      //         }
      //     }
      // },
        xAxis: {
            type: 'category'
        },
        colors: [
              '#ffb600',
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
  
        series: responsedata["RejectionLineWiseAnalysis"]["Value"]["rejectionMonthDrilldowns"],
        drilldown: {
            series: responsedata["RejectionLineWiseAnalysis"]["Value"]["rejectionDrilldownMonthSeries"]
        }
      });
    })
  }

  getResourceStrengthUnitWiseCharts(){
    $("#resourceStrengthLine").hide();
    var linewiseChartBackendUrl = environment.backendUrl + 'DrilldownResourceStengthUnitwise';
    var KPIView = {
        Year : [2021],
        Month : [1],
        Unit : [1,2]
    }
    var _this = this;
    _this.http.post<any>(linewiseChartBackendUrl, KPIView).subscribe(responsedata => {
      this.operatorUnit = new Chart({
        chart: {
            type: 'spline',
            width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'Nos',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly Operator Count on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        xAxis: {
            type: 'category'
        },
        colors: [
              '#ffb600',
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
    
        series: responsedata["ProductionUnitWiseAnalysis"]["Value"]["productionMonthDrilldowns"],
        drilldown: {
          series: responsedata["ProductionUnitWiseAnalysis"]["Value"]["productionDrilldownMonthSeries"]
        }
      });
      this.helperUnit = new Chart({
        chart:{
          width: 350,
        },
        yAxis: [{ 
          title: {
              text: 'Nos',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        title: {
            text: 'Monthly Helpers Count on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        colors: [
          '#ffb600',
          '#db536a',
          '#e0301e',
          '#eb8c00', 
          '#db536a', 
          '#d93954', 
          '#e0301e', 
          '#d04a02', 
          '#92A8CD'
        ],
    
        xAxis: {
            // accessibility: {
            //     rangeDescription: 'Range: 2019 to 2021'
            // },
            categories:responsedata["DHUUnitWiseAnalysis"]["Value"]["categories"]
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                size:350
                // pointStart: 2010
            },
            column: {
              colorByPoint: true
          }
        },
    
        series: responsedata["DHUUnitWiseAnalysis"]["Value"]["series"],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
      });
      this.checkerUnit = new Chart({
        chart: {
            type: 'column',
            width : 350
        },
        yAxis: [{ 
          title: {
              text: 'Nos',
              style: {
                  // color: "#d04a02",
                  style: {'font-family': 'Arial, Helvetica', 'font-size': '8px'}
              }
            }
          }
        ],
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        title: {
            text: 'Monthly Checkers Count on 2021',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '16px'}
        },
        
        xAxis: {
            type: 'category'
        },
        colors: [
                  '#ffb600',
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
  
        series: responsedata["RejectionUnitWiseAnalysis"]["Value"]["rejectionMonthDrilldowns"],
        drilldown: {
            series: responsedata["RejectionUnitWiseAnalysis"]["Value"]["rejectionDrilldownMonthSeries"]
        }
      });
    })
  }


  //activate tabs of sewing module
  activeTab = 'kpi';

  kpi(activeTab){
    this.activeTab = activeTab;
    this.getSewingKPIAnalysis();
  }

  workEfficiency(activeTab){
    this.activeTab = activeTab;
    // this.getLineWiseCharts();
  }

  productivity(activeTab){
    this.activeTab = activeTab;
    this.getProductivityLineWiseCharts();
    // this.getUnitWiseCharts();
  }
  resourceStrength(activeTab){
    this.activeTab = activeTab;
  }
}
