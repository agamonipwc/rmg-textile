import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as frLocale from 'date-fns/locale/fr';
import { Router } from '@angular/router';
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
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

@Component({
  selector: 'app-sewingmodule',
  templateUrl: './sewingmodule.component.html',
  styleUrls: ['./sewingmodule.component.css']
})
export class SewingmoduleComponent implements OnInit {
  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  @ViewChild("dhuContainer", { read: ElementRef }) dhuContainer: ElementRef;
  @ViewChild("efficiencyContainer", { read: ElementRef }) efficiencyContainer: ElementRef;
  @ViewChild("defectContainer", { read: ElementRef }) defectContainer: ElementRef;
  @ViewChild("rejectionContainer", { read: ElementRef }) rejectionContainer: ElementRef;
  @ViewChild("multiskillContainer", { read: ElementRef }) multiskillContainer: ElementRef;
  @ViewChild("wipContainer", { read: ElementRef }) wipContainer: ElementRef;
  @ViewChild("capacityUtilizationContainer", { read: ElementRef }) capacityUtilizationContainer: ElementRef;
  @ViewChild("mmrContainer", { read: ElementRef }) mmrContainer: ElementRef;
  @ViewChild("machineDowntimeContainer", { read: ElementRef }) machineDowntimeContainer: ElementRef;
  @ViewChild("absentismContainer", { read: ElementRef }) absentismContainer: ElementRef;
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

  constructor(private http: HttpClient,private _router: Router) {
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
    this.kpipag1("kpipag1");
    // this.kpi("kpi");
    // this.getSewingKPIAnalysis();
    
  }
  getFilterData(){
    var KPIView = {
      Year : [2021],
      Month : [1,2,3],
      Line : [1,2,3,4]
      // Line : _this.selectedLine
    }
    this.calculateFirstPageKPIs(KPIView);
    // var _this = this;
    // this.http.get<any>(this.userBackendUrl).subscribe(data=>{
    //   if(data.statusCode == 200){
    //     data.responseData.lineMasterData.forEach(element => {
    //       _this.line.push({id:element.Id, name: element.Name});
    //     });
    //     data.responseData.unitMasterData.forEach(element => {
    //       _this.unit.push({id:element.Id, name: element.Name});
    //     });
    //     data.responseData.locationMasterData.forEach(element => {
    //       _this.location.push({id:element.Id, name: element.Name})
    //     });
    //     var year= this.startDate.getFullYear();
    //     var month = this.startDate.getMonth();
    //     $("#year_"+year).prop('checked', true);
    //     $("#month_"+month).prop('checked', true);
    //     _this.line.forEach(element => {
    //       var id = element.id.toString();
    //       $("#line_"+id).prop('checked', true);
    //     });
    //     _this.selectedYear.push(parseInt($("#year_"+year).val()));
    //     _this.selectedMonth.push(parseInt($("#month_"+month).val()));
    //     _this.selectedLine.push(1);
    //   }
    // });
  }
  
  // getSewingKPIAnalysis(){
  //   var _this = this;
  //   var lineSelected = [];
  //   var monthSelected = [];
  //   var  yearSelected = [];
  //   $('input[name="options[line]"]:checked').each(function(i){
  //     lineSelected.push(parseInt($(this).val()));
  //   });
  //   $('input[name="options[month]"]:checked').each(function(i){
  //     monthSelected.push(parseInt($(this).val()));
  //   });
  //   $('input[name="options[year]"]:checked').each(function(i){
  //     yearSelected.push(parseInt($(this).val()));
  //   });
  //   this.selectedYear = yearSelected;
  //   this.selectedLine = lineSelected;
  //   this.selectedMonth = monthSelected;
  //   var KPIView = {
  //     Year : this.selectedYear,
  //     Month : this.selectedMonth,
  //     Line : [1,2,3,4]
  //   }
  //   this.calculateFirstPageKPIs(KPIView);
  //   // this.callEfficiencyCalculationApi(KPIView);
  // }

  calculateFirstPageKPIs(KPIView){
    var _this = this;
    this.http.post<any>(this.userBackendUrl, KPIView).subscribe(responsedata => {
      if(responsedata.StatusCode == 200){
        $("#efficiencyVisual").show();
        $("#capacityVisual").show();
        $("#wipVisual").show();
        $("#mmrVisual").show();
        $("#machineDowntimeVisual").show();
        Highcharts.chart(this.efficiencyContainer.nativeElement, {
          colors: [
            responsedata["Efficiency"]["Value"]["colorCode"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: '% Efficiency',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px','display': 'none'},
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              max: 5,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Efficiency: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Efficiency',
              data: [
                responsedata["Efficiency"]["Value"]["efficiencyResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.capacityUtilizationContainer.nativeElement, {
          colors: [
            responsedata["CapaCityCalculation"]["Value"]["colorCode"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: '% Utilized Capacity',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display':'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Capacity Utilization: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Capacity Utilization',
              data: [
                responsedata["CapaCityCalculation"]["Value"]["capacityUtilizationResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.wipContainer.nativeElement, {
          colors: [
            responsedata["MMRWIPInline"]["Value"]["wipColorCode"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: 'Inline WIP',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Inline WIP: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Inline WIP',
              data: [
                responsedata["MMRWIPInline"]["Value"]["inlineWIPResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.mmrContainer.nativeElement, {
          colors: [
            responsedata["MMRWIPInline"]["Value"]["mmrColorCode"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: 'Man Machine Ratio',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'MMR: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'MMR',
              data: [
                responsedata["MMRWIPInline"]["Value"]["mmrResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });
        
        Highcharts.chart(this.machineDowntimeContainer.nativeElement, {
          colors: [
            responsedata["MMRWIPInline"]["Value"]["machineDowntimeColorCode"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: 'Machine Downtime',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Machine Downtime: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Machine Downtime',
              data: [
                responsedata["MMRWIPInline"]["Value"]["machineDowntimeRespponse"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });
      }
      else{
        return;
      }
    })

  }

  calculateSecondPageKPIs(KPIView){
    var _this = this;
    var url = environment.backendUrl + "SecondPageKPI";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      if(responsedata.StatusCode == 200){
        $("#dhuVisual").show();
        $("#defectVisual").show();
        $("#rejectionVisual").show();
        $("#absentismVisual").show();
        $("#multiskillVisual").show();
        Highcharts.chart(this.dhuContainer.nativeElement, {
          colors: [
            responsedata["DefectRejectDHUPercentage"]["Value"]["dhuColor"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: '% DHU',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% DHU: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'DHU',
              data: [
                responsedata["DefectRejectDHUPercentage"]["Value"]["percentageDHU"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.rejectionContainer.nativeElement, {
          colors: [
            responsedata["DefectRejectDHUPercentage"]["Value"]["rejectColor"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: '% Rejection',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Rejection: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Rejection',
              data: [
                responsedata["DefectRejectDHUPercentage"]["Value"]["percentageRejection"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.defectContainer.nativeElement, {
          colors: [
            responsedata["DefectRejectDHUPercentage"]["Value"]["defectColor"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: '% Defect',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display':'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Defect: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: '% Defect',
              data: [
                responsedata["DefectRejectDHUPercentage"]["Value"]["percentageDefection"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.absentismContainer.nativeElement, {
          colors: [
            responsedata["AbsentismMultiskill"]["Value"]["absentismColor"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: 'Absentism',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display':'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Absentism: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Absentism',
              data: [
                responsedata["AbsentismMultiskill"]["Value"]["absentismData"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });

        Highcharts.chart(this.multiskillContainer.nativeElement, {
          colors: [
            responsedata["AbsentismMultiskill"]["Value"]["multiskillColor"]
          ],
          exporting: {
            enabled: false
          },
          credits: {enabled: false},
          chart: {
            type: 'column'
          },
          title: {
              text: '% Multi Skill',
              style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display':'none'}
          },
          xAxis: {
              type: 'category',
              labels: {
                  rotation: -45,
                  style: {
                      fontSize: '10px',
                      'font-family': 'Arial, Helvetica'
                  },
                  enabled : false
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '% score',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                }
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Multi Skill: <b>{point.y:.1f}</b>'
          },
          series: [{
              name: 'Multi Skill',
              data: [
                responsedata["AbsentismMultiskill"]["Value"]["multiskillData"]
              ],
              dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#FFFFFF',
                  align: 'right',
                  format: '{point.y:.1f}', // one decimal
                  y: 10, // 10 pixels down from the top
                  style: {
                      fontSize: '10px',
                      fontFamily: 'Verdana, sans-serif'
                  }
              }
          }]
        });
      }
      else{
        return;
      }
    })

  }

  tabNavigation(event){
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.id.split('_')[0];
    var all = $(".tab-pane.fade.show.active").map(function() {
      return this.id;
    }).get();
    $("#"+all[0]).removeClass('show').removeClass('active');
    $("#"+idAttr).addClass('show').addClass('active');
    $("#"+idAttr).show();
    var allHideShowClass = $(".hide-show.tab-pane.fade").map(function() {
      return this.id;
    }).get();
    allHideShowClass.forEach(element => {
      if($("#"+element).hasClass('active') == false){
        $("#"+element).hide();
      }
    });
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
    // this.getSewingKPIAnalysis();
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
  kpipag1(activeTab){
    this.activeTab = activeTab;
    var activatedhref = $(".submodule.active").map(function() {
      return this.id;
    }).get();
    activatedhref.forEach(element => {
      if(element != activeTab){
        $("#"+ element).removeClass('active');
        $("#" + element.split('_')[0]).hide();
      }
    });
    var KPIView = {
      Year : this.selectedYear,
      Month : this.selectedMonth,
      Line : [1,2,3,4]
    }
    this.calculateFirstPageKPIs(KPIView);
    $("#"+ activeTab).show();
  }

  kpipag2(activeTab){
    var activatedhref = $(".submodule.active").map(function() {
      return this.id;
    }).get();
    activatedhref.forEach(element => {
      if(element != activeTab){
        $("#"+ element).removeClass('active');
        $("#" + element.split('_')[0]).hide();
      }
    });
    this.activeTab = activeTab;
    var KPIView = {
      Year : this.selectedYear,
      Month : this.selectedMonth,
      Line : [1,2,3,4]
    }
    this.calculateSecondPageKPIs(KPIView);
    $("#kpipage2").show();
  }

  navigateEfficiency(){
    this._router.navigate(['efficiency-overview']);
  }
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
}
