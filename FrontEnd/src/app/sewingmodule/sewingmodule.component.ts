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
Drilldown(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);
declare var anime: any;

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

  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  
  selectedLine = [];
  selectedUnit = [];
  selectedLocation = [];

  dhuStyle : any = {};
  defectStyle : any= {};
  rejectStyle : any = {};

  constructor(private http: HttpClient,private _router: Router) {
    this.startDate = new Date();
    this.endDate = new Date();
   }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.selectAllOptions();
    this.getFilterData();
    this.getMasterData();
    $("#footer").hide();
    $(".footer").hide();
  var textWrapper = document.querySelector('.ml1 .letters');
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

  anime.timeline({loop: true})
  .add({
      targets: '.ml1 .letter',
      scale: [0.3,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 600,
      delay: (el, i) => 70 * (i+1)
  }).add({
      targets: '.ml1 .line',
      scaleX: [0,1],
      opacity: [0.5,1],
      easing: "easeOutExpo",
      duration: 700,
      offset: '-=875',
      delay: (el, i, l) => 80 * (l - i)
  }).add({
      targets: '.ml1',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
  });
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
      StartDate : "2021-01-31 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateFirstPageKPIs(KPIView);
    this.calculateSecondPageKPIs(KPIView);
  }

  calculateFirstPageKPIs(KPIView){
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
              max: 100,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Efficiency: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'Efficiency',
              data: [
                responsedata["Efficiency"]["Value"]["efficiencyResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  
                  color: '#000000',
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
              max: 100,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Capacity Utilization: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'Capacity Utilization',
              data: [
                responsedata["CapaCityCalculation"]["Value"]["capacityUtilizationResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  color: '#000000',
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
            responsedata["InlineWIPLevel"]["Value"]["wipColorCode"]
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
              max: 5,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Inline WIP: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'Inline WIP',
              data: [
                responsedata["InlineWIPLevel"]["Value"]["inlineWIPResponse"]
              ],
              dataLabels: {
                  enabled: true,
                  color: '#000000',
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

        // Highcharts.chart(this.mmrContainer.nativeElement, {
        //   colors: [
        //     responsedata["ManMachineRatio"]["Value"]["mmrColorCode"]
        //   ],
        //   exporting: {
        //     enabled: false
        //   },
        //   credits: {enabled: false},
        //   chart: {
        //     type: 'column'
        //   },
        //   title: {
        //       text: 'Man Machine Ratio',
        //       style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        //   },
        //   xAxis: {
        //       type: 'category',
        //       labels: {
        //           rotation: -45,
        //           style: {
        //               fontSize: '10px',
        //               'font-family': 'Arial, Helvetica'
        //           },
        //           enabled : false
        //       }
        //   },
        //   yAxis: {
        //       min: 0,
        //       max : 2,
        //       title: {
        //           text: 'Value',
        //           enabled : false
        //       },
        //       labels: {
        //         style: {
        //             fontSize: '10px',
        //             'font-family': 'Arial, Helvetica'
        //         }
        //     }
        //   },
        //   legend: {
        //       enabled: false
        //   },
        //   tooltip: {
        //       pointFormat: 'MMR: <b>{point.y:.1f}</b>',
        //       enabled: false,
        //   },
        //   series: [{
        //       name: 'MMR',
        //       data: [
        //         responsedata["ManMachineRatio"]["Value"]["mmrResponse"]
        //       ],
        //       dataLabels: {
        //           enabled: true,
        //           
        //           color: '#000000',
        //           align: 'right',
        //           format: '{point.y:.1f}', // one decimal
        //           y: 10, // 10 pixels down from the top
        //           style: {
        //               fontSize: '10px',
        //               fontFamily: 'Verdana, sans-serif'
        //           }
        //       }
        //   }]
        // });
        
        Highcharts.chart(this.machineDowntimeContainer.nativeElement, {
          colors: [
            responsedata["MachineDownTime"]["Value"]["machineDowntimeColorCode"]
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
              max: 20,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Machine Downtime: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'Machine Downtime',
              data: [
                responsedata["MachineDownTime"]["Value"]["machineDowntimeRespponse"]
              ],
              dataLabels: {
                  enabled: true,
                  
                  color: '#000000',
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
              max: 13,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% DHU: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'DHU',
              data: [
                responsedata["DefectRejectDHUPercentage"]["Value"]["percentageDHU"]
              ],
              dataLabels: {
                  enabled: true,
                  
                  color: '#000000',
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
              max : 15,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Rejection: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'Rejection',
              data: [
                responsedata["DefectRejectDHUPercentage"]["Value"]["percentageRejection"]
              ],
              dataLabels: {
                  enabled: true,
                  
                  color: '#000000',
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
              max:50,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: '% Defect: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: '% Defect',
              data: [
                responsedata["DefectRejectDHUPercentage"]["Value"]["percentageDefection"]
              ],
              dataLabels: {
                  enabled: true,
                  
                  color: '#000000',
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
            responsedata["Absentism"]["Value"]["absentismColor"]
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
              max : 100,
              title: {
                  text: 'Value',
                  enabled : false
              },
              labels: {
                style: {
                    fontSize: '10px',
                    'font-family': 'Arial, Helvetica'
                },
                enabled : false
            }
          },
          legend: {
              enabled: false
          },
          tooltip: {
              pointFormat: 'Absentism: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'Absentism',
              data: [
                responsedata["Absentism"]["Value"]["absentismData"]
              ],
              dataLabels: {
                  enabled: true,
                  
                  color: '#000000',
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

        // Highcharts.chart(this.multiskillContainer.nativeElement, {
        //   colors: [
        //     responsedata["Multiskill"]["Value"]["multiskillColor"]
        //   ],
        //   exporting: {
        //     enabled: false
        //   },
        //   credits: {enabled: false},
        //   chart: {
        //     type: 'column'
        //   },
        //   title: {
        //       text: '% Multi Skill',
        //       style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display':'none'}
        //   },
        //   xAxis: {
        //       type: 'category',
        //       labels: {
        //           rotation: -45,
        //           style: {
        //               fontSize: '10px',
        //               'font-family': 'Arial, Helvetica'
        //           },
        //           enabled : false
        //       }
        //   },
        //   yAxis: {
        //     min: 0,
        //     max : 100,
        //       title: {
        //           text: 'Value',
        //           enabled : false
        //       },
        //       labels: {
        //         style: {
        //             fontSize: '10px',
        //             'font-family': 'Arial, Helvetica'
        //         }
        //     }
        //   },
        //   legend: {
        //       enabled: false
        //   },
        //   tooltip: {
        //       pointFormat: 'Multi Skill: <b>{point.y:.1f}</b>',
        //       enabled: false,
        //   },
        //   series: [{
        //       name: 'Multi Skill',
        //       data: [
        //         responsedata["Multiskill"]["Value"]["multiskillData"]
        //       ],
        //       dataLabels: {
        //           enabled: true,
        //           
        //           color: '#000000',
        //           align: 'right',
        //           format: '{point.y:.1f}', // one decimal
        //           y: 10, // 10 pixels down from the top
        //           style: {
        //               fontSize: '10px',
        //               fontFamily: 'Verdana, sans-serif'
        //           }
        //       }
        //   }]
        // });
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
  //activate tabs of sewing module
  activeTab = 'kpi';

  kpi(activeTab){
    this.activeTab = activeTab;
    // this.getSewingKPIAnalysis();
  }

  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  } 

  navigateEfficiency(){
    this._router.navigate(['efficiency-overview']);
  }

  navigateCapacityUtilization(){
    this._router.navigate(['capacity-utilization-overview']);
  }

  navigateAbsentismUtilization(){
    this._router.navigate(['absentism-overview']);
  }

  dashboardNavigation(){
    this._router.navigate(['module-performance']);
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

  getSewingKPIAnalysis(){
    var checkedLocations = $('.option.justone.location:checkbox:checked').map(function() {
      var locationId = parseFloat(this.value);
      return locationId;
    }).get();
    var checkedUnits = $('.option.justone.unit:checkbox:checked').map(function() {
      var unitId = parseFloat(this.value);
      return unitId;
    }).get();
    var checkedLines = $('.option.justone.line:checkbox:checked').map(function() {
      var lineId = parseFloat(this.value);
      return lineId;
    }).get();
    var StartDate = new Date().toDateString();
    var EndDate = new Date().toDateString();
    var KPIView = {
      Line : checkedLines,
      Location : checkedLocations,
      Unit : checkedUnits,
      StartDate : "2021-01-31 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000"
    }
    this.calculateFirstPageKPIs(KPIView);
    this.calculateSecondPageKPIs(KPIView);
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

  navigateDefectPercentage(){
    this._router.navigate(['defect-overview']); 
  }
  
}
