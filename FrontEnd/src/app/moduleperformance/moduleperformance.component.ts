import { Component, OnInit } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { style } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-moduleperformance',
  templateUrl: './moduleperformance.component.html',
  styleUrls: ['./moduleperformance.component.css']
})
export class ModuleperformanceComponent implements OnInit {
  operationGaugeFormat: Chart;
  socialSustainabilityGaugeFormat : Chart;
  environmentalSustainabilityGaugeChart : Chart;
  fabricStoreGaugeFormat : Chart;
  trimStoreGaugeFormat : Chart;
  spreadingCuttingGaugeFormat : Chart;
  sewingGaugeFormat : Chart;
  finishingPackingGaugeFormat : Chart;
  gaugeInline: Chart;
  gaugeOutward: Chart;
  gaugeProcess: Chart;
  constructor(private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.createOperationOverView();
    this.createSocialSustainablityOverview();
    this.createEnvironmentalSustainablityOverview();
    this.createFabricStoreOverview();
    this.createTrimStoreOverview();
    this.createSpreadingCuttingOverview();
    this.createSewingOverview();
    this.createFinishingPackingOverview();
    this.createOperationoduleChart();
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

  navigateToOperation(destTabId){
    var activatedhref = $(".nav-link.active").map(function() {
        return this.id;
    }).get();
    $("#"+activatedhref[0]).removeClass('active');
    $("#" + destTabId+"_href").addClass('active');
    var all = $(".tab-pane.fade.show.active").map(function() {
        return this.id;
      }).get();
      $("#"+all[0]).removeClass('show').removeClass('active');
      $("#"+destTabId).addClass('show').addClass('active');
      $("#"+destTabId).show();
      var allHideShowClass = $(".hide-show.tab-pane.fade").map(function() {
        return this.id;
      }).get();
      allHideShowClass.forEach(element => {
        if($("#"+element).hasClass('active') == false){
          $("#"+element).hide();
        }
      });
  }

  createOperationOverView(){
    //create gauge chart format
    this.operationGaugeFormat = new Chart({
      chart: {
          type: 'solidgauge',
          height: '100%',
          width: 300,
          backgroundColor: 'transparent'
      },
      credits: {enabled: false},
      title: {
          text: 'Operations Overview <br>',
          y: 250,
          style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: 'white',
            innerRadius: '60%',
            outerRadius: '90%',
            shape: 'arc',
            borderColor: 'transparent',
        }
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
          length: 5,
          lineWidth: 0,
          minorTicks: false,
          tickAmount: 0,
          tickColor: 'transparent',
          labels: {
              enabled: true,
          },
          // title: {
          //   text: 'Performance'
          // },
          min: 0,
          max: 100,
          plotBands: [
              { from: 0, to: 35, color: '#e0301e', outerRadius: '132'},
              { from: 36, to: 69, color: '#ffb600', outerRadius: '132'},
              { from: 70, to: 100, color: '#175d2d', outerRadius: '132'},
          ]
      },
      plotOptions: {
          solidgauge: {
              threshold: 50,
              dataLabels: {
                style: {'fontSize': '36px', 'font-family': 'Arial, Helvetica', 'fontWeight': 'light'},
                y: -50,
                borderWidth: 0
              }
          }
      },
      series: [
        {
          data: [80],
          dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:25px">{y}</span><br/>' +
            '</div>'
          },
        }
      ]
    });
  }

  createSocialSustainablityOverview(){
    this.socialSustainabilityGaugeFormat = new Chart({
      chart: {
          type: 'solidgauge',
          height: '100%',
          width: 300,
          backgroundColor: 'transparent'
      },
      credits: {enabled: false},
      title: {
          text: 'Social Sustainability <br>',
          y: 250,
          style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
      },
      subtitle: {
        text: '(In Percentage)',
        y: 300,
        style: {'font-family': 'Arial, Helvetica', 'font-size': '14px'}
    },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: 'white',
            innerRadius: '60%',
            outerRadius: '90%',
            shape: 'arc',
            borderColor: 'transparent',
        }
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
          length: 5,
          lineWidth: 0,
          minorTicks: false,
          tickAmount: 0,
          tickColor: 'transparent',
          labels: {
              enabled: true,
          },
          min: 0,
          max: 100,
          // title: {
          //   text: 'Performance'
          // },
          plotBands: [
              { from: 0, to: 35, color: '#e0301e', outerRadius: '132'},
              { from: 36, to: 69, color: '#ffb600', outerRadius: '132'},
              { from: 70, to: 100, color: '#175d2d', outerRadius: '132'},
          ]
      },
      plotOptions: {
          solidgauge: {
              threshold: 50,
              dataLabels: {
                style: {'fontSize': '36px', 'font-family': 'Arial, Helvetica', 'fontWeight': 'light'},
                y: -50,
                borderWidth: 0
              }
          }
      },
      series: [
        {
          data: [25],
          dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:25px">{y}</span><br/>' +
            '</div>'
          },
        }
      ]
    });
  }

  createEnvironmentalSustainablityOverview(){
    this.environmentalSustainabilityGaugeChart = new Chart({
      chart: {
          type: 'solidgauge',
          height: '100%',
          width: 300,
          backgroundColor: 'transparent'
      },
      credits: {enabled: false},
      title: {
          text: 'Environmental Sustainability<br>',
          y: 250,
          style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: 'white',
            innerRadius: '60%',
            outerRadius: '90%',
            shape: 'arc',
            borderColor: 'transparent',
        }
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
          length: 5,
          lineWidth: 0,
          minorTicks: false,
          tickAmount: 0,
          tickColor: 'transparent',
          labels: {
              enabled: true,
          },
          min: 0,
          max: 100,
          plotBands: [
              { from: 0, to: 35, color: '#e0301e', outerRadius: '132'},
              { from: 36, to: 69, color: '#ffb600', outerRadius: '132'},
              { from: 70, to: 100, color: '#175d2d', outerRadius: '132'},
          ]
      },
      plotOptions: {
          solidgauge: {
              threshold: 50,
              dataLabels: {
                style: {'fontSize': '36px', 'font-family': 'Arial, Helvetica', 'fontWeight': 'light'},
                y: -50,
                borderWidth: 0
              }
          }
      },
      series: [
        {
          data: [55],
          dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<span style="font-size:25px">{y}</span><br/>' +
            '</div>'
          },
        }
      ]
    });
  }

  createFabricStoreOverview(){
    this.fabricStoreGaugeFormat = new Chart({
      chart: {
        type: 'gauge',
        height: '100%',
        width: 300,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {enabled: false},
      title: {
          text: 'Fabric Store Overview',
          style: {'font-family': 'Arial, Helvetica',},
      },

      pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      },

      // the value axis
      yAxis: {
          min: 0,
          max: 100,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 7,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
              step: 2,
              rotation: 'auto'
          },
          title: {
              text: 'percentage'
          },
          plotBands: [{
              from: 0,
              to: 35,
              color: '#e0301e'
          }, {
              from: 36,
              to: 69,
              color: '#ffb600' // yellow
          }, {
              from: 70,
              to: 100,
              color: '#175d2d' // red
          }]
      },

      series: [{
          name: 'Process Overview',
          data: [80],
          tooltip: {
              valueSuffix: ' percentage'
          }
      }]
    });
  }

  createTrimStoreOverview(){
    this.trimStoreGaugeFormat = new Chart({
      chart: {
        type: 'gauge',
        height: '100%',
        width: 300,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {enabled: false},
      title: {
          text: 'Trim Store Overview',
          style: {'font-family': 'Arial, Helvetica',},
      },

      pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      },

      // the value axis
      yAxis: {
          min: 0,
          max: 100,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 7,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
              step: 2,
              rotation: 'auto'
          },
          title: {
              text: 'percentage'
          },
          plotBands: [{
              from: 0,
              to: 35,
              color: '#e0301e'
          }, {
              from: 36,
              to: 69,
              color: '#ffb600' // yellow
          }, {
              from: 70,
              to: 100,
              color: '#175d2d' // red
          }]
      },

      series: [{
          name: 'Process Overview',
          data: [30],
          tooltip: {
              valueSuffix: ' percentage'
          }
      }]
    });
  }

  createSpreadingCuttingOverview(){
    this.spreadingCuttingGaugeFormat = new Chart({
      chart: {
        type: 'gauge',
        height: '100%',
        width: 300,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {enabled: false},
      title: {
          text: 'Spreading & Cutting Overview',
          style: {'font-family': 'Arial, Helvetica',},
      },

      pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      },

      // the value axis
      yAxis: {
          min: 0,
          max: 100,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 7,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
              step: 2,
              rotation: 'auto'
          },
          title: {
              text: 'percentage'
          },
          plotBands: [{
              from: 0,
              to: 35,
              color: '#e0301e'
          }, {
              from: 36,
              to: 69,
              color: '#ffb600' // yellow
          }, {
              from: 70,
              to: 100,
              color: '#175d2d' // red
          }]
      },

      series: [{
          name: 'Process Overview',
          data: [59],
          tooltip: {
              valueSuffix: ' percentage'
          }
      }]
    });
  }
  
  createSewingOverview(){
    this.sewingGaugeFormat = new Chart({
      chart: {
        type: 'gauge',
        height: '100%',
        width: 300,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {enabled: false},
      title: {
          text: 'Sewing Overview',
          style: {'font-family': 'Arial, Helvetica',},
      },

      pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      },

      // the value axis
      yAxis: {
          min: 0,
          max: 100,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 7,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
              step: 2,
              rotation: 'auto'
          },
          title: {
              text: 'percentage'
          },
          plotBands: [{
              from: 0,
              to: 35,
              color: '#e0301e'
          }, {
              from: 36,
              to: 69,
              color: '#ffb600' // yellow
          }, {
              from: 70,
              to: 100,
              color: '#175d2d' // red
          }]
      },

      series: [{
          name: 'Process Overview',
          data: [25],
          tooltip: {
              valueSuffix: ' percentage'
          }
      }]
    });
  }

  createFinishingPackingOverview(){
    this.finishingPackingGaugeFormat = new Chart({
      chart: {
        type: 'gauge',
        height: '100%',
        width: 300,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {enabled: false},
      title: {
          text: 'Finishing & Packing Overview',
          style: {'font-family': 'Arial, Helvetica',},
      },

      pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 0,
              outerRadius: '109%'
          }, {
              backgroundColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0.3, '#e0301e'],
                    [0.6, '#ffb600'],
                    [1, '#175d2d']
                  ]
              },
              borderWidth: 1,
              outerRadius: '107%'
          }, {
              // default background
          }, {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
          }]
      },

      // the value axis
      yAxis: {
          min: 0,
          max: 100,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 7,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
              step: 2,
              rotation: 'auto'
          },
          title: {
              text: 'percentage'
          },
          plotBands: [{
              from: 0,
              to: 35,
              color: '#e0301e'
          }, {
              from: 36,
              to: 69,
              color: '#ffb600' // yellow
          }, {
              from: 70,
              to: 100,
              color: '#175d2d' // red
          }]
      },

      series: [{
          name: 'Process Overview',
          data: [55],
          tooltip: {
              valueSuffix: ' percentage'
          }
      }]
    });
  }

  sewingNavigation(){
      this._router.navigate(['sewing-module']);
  }

  createOperationoduleChart(){

        this.gaugeInline = new Chart({
            chart: {
                type: 'solidgauge',
                height: '100%',
                width: 300,
                backgroundColor: 'transparent'
            },
            credits: {enabled: false},
            title: {
                text: 'Inward',
                y: 250,
                style: {'font-family': 'Arial, Helvetica',},
            },
            pane: {
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: 'white',
                    innerRadius: '60%',
                    outerRadius: '90%',
                    shape: 'arc',
                    borderColor: 'transparent',
                }
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
                length: 5,
                lineWidth: 0,
                minorTicks: false,
                tickAmount: 0,
                tickColor: 'transparent',
                labels: {
                    enabled: true,
                },
                min: 0,
                max: 100,
                plotBands: [
                    { from: 0, to: 35, color: '#e0301e', outerRadius: '132'},
                    { from: 36, to: 69, color: '#ffb600', outerRadius: '132'},
                    { from: 70, to: 100, color: '#175d2d', outerRadius: '132'},
                ]
            },
            plotOptions: {
                solidgauge: {
                    threshold: 50,
                    dataLabels: {
                        style: {'fontSize': '36px', 'font-family': 'Arial, Helvetica', 'fontWeight': 'light'},
                        y: -50,
                        borderWidth: 0
                      }
                }
            },
            series: [
                {
                    data: [80],
                    tooltip: {
                        valueSuffix: ' percentage'
                    }
                },
            ]
        });

        this.gaugeProcess = new Chart({
            chart: {
                type: 'solidgauge',
                height: '100%',
                width: 300,
                backgroundColor: 'transparent'
            },
            credits: {enabled: false},
            title: {
                text: 'Process',
                y: 250,
                style: {'font-family': 'Arial, Helvetica',},
            },
            pane: {
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: 'white',
                    innerRadius: '60%',
                    outerRadius: '90%',
                    shape: 'arc',
                    borderColor: 'transparent',
                }
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
                length: 5,
                lineWidth: 0,
                minorTicks: false,
                tickAmount: 0,
                tickColor: 'transparent',
                labels: {
                    enabled: true,
                },
                min: 0,
                max: 100,
                plotBands: [
                    { from: 0, to: 35, color: '#e0301e', outerRadius: '132'},
                    { from: 36, to: 69, color: '#ffb600', outerRadius: '132'},
                    { from: 70, to: 100, color: '#175d2d', outerRadius: '132'},
                ]
            },
            plotOptions: {
                solidgauge: {
                    threshold: 50,
                    dataLabels: {
                        style: {'fontSize': '36px', 'font-family': 'Arial, Helvetica', 'fontWeight': 'light'},
                        y: -50,
                        borderWidth: 0
                      }
                }
            },
            series: [
                {
                    data: [30],
                    tooltip: {
                        valueSuffix: ' percentage'
                    }
                }
            ]
        });

        this.gaugeOutward = new Chart({
            chart: {
                type: 'solidgauge',
                height: '100%',
                width: 300,
                backgroundColor: 'transparent'
            },
            credits: {enabled: false},
            title: {
                text: 'Outward',
                y: 250,
                style: {'font-family': 'Arial, Helvetica',},
            },
            pane: {
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: 'white',
                    innerRadius: '60%',
                    outerRadius: '90%',
                    shape: 'arc',
                    borderColor: 'transparent',
                }
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
                length: 5,
                lineWidth: 0,
                minorTicks: false,
                tickAmount: 0,
                tickColor: 'transparent',
                labels: {
                    enabled: true,
                },
                min: 0,
                max: 100,
                plotBands: [
                    { from: 0, to: 35, color: '#e0301e', outerRadius: '132'},
                    { from: 36, to: 69, color: '#ffb600', outerRadius: '132'},
                    { from: 70, to: 100, color: '#175d2d', outerRadius: '132'},
                ]
            },
            plotOptions: {
                solidgauge: {
                    threshold: 50,
                    dataLabels: {
                        style: {'fontSize': '36px', 'font-family': 'Arial, Helvetica', 'fontWeight': 'light'},
                        y: -50,
                        borderWidth: 0
                      }
                }
            },
            series: [
                {
                    data: [68]
                }
            ]
        });
    }
}
