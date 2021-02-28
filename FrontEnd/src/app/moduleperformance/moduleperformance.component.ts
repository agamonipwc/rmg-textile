import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { style } from '@angular/animations';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let Exporting = require('highcharts/modules/exporting');
// let Accessibility = require('highcharts/modules/');
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Exporting(Highcharts);
// import * as  Highcharts from 'highcharts';
// import more from 'highcharts/highcharts-more';
// more(Highcharts);
// import Drilldown from 'highcharts/modules/drilldown';
// Drilldown(Highcharts);
// import Exporting from 'highcharts/modules/exporting';
// Exporting(Highcharts);

@Component({
  selector: 'app-moduleperformance',
  templateUrl: './moduleperformance.component.html',
  styleUrls: ['./moduleperformance.component.css']
})
export class ModuleperformanceComponent implements OnInit {
@ViewChild("processBubble", { read: ElementRef }) processBubble: ElementRef;
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
//   processBubble : Chart;
  onclickStyle: any ={
      cursor: "pointer"
  }
  constructor(private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();
    this.createOperationOverView();
    this.createSocialSustainablityOverview();
    this.createEnvironmentalSustainablityOverview();
    this.createFabricStoreOverview();
    this.createTrimStoreOverview();
    this.createSpreadingCuttingOverview();
    this.createSewingOverview();
    this.createFinishingPackingOverview();
    this.createOperationoduleChart();
    this.createProcessOverview();
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
            width:300
        },
    
        title: {
            text: 'Operation',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
        },
    
        pane: {
            center: ['50%', '85%'],
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
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
            min: 0,
            max: 100,
            stops: [
                [0.1, '#e0301e'], // green
                [0.5, '#ffb600'], // yellow
                [0.9, '#175d2d'] // red
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
            }
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'Environmental Sustainability',
            data: [60],
            dataLabels: {
                format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:25px">{y}%</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4"></span>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: '%'
            }
        }],
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    });
  }

  createSocialSustainablityOverview(){
    this.socialSustainabilityGaugeFormat = new Chart({
        chart: {
            type: 'solidgauge',
            height: '100%',
            width:300
        },
    
        title: {
            text: 'Social Sustainability',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
        },
    
        pane: {
            center: ['50%', '85%'],
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
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
            min: 0,
            max: 100,
            stops: [
                [0.1, '#e0301e'], // green
                [0.5, '#ffb600'], // yellow
                [0.9, '#175d2d'] // red
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
            }
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'Environmental Sustainability',
            data: [30],
            dataLabels: {
                format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:25px">{y}%</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4"></span>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: '%'
            }
        }],
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    });
  }

  createEnvironmentalSustainablityOverview(){
    this.environmentalSustainabilityGaugeChart = new Chart({
        chart: {
            type: 'solidgauge',
            height: '100%',
            width:300
        },
    
        title: {
            text: 'Environmental Sustainability',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
        },
    
        pane: {
            center: ['50%', '85%'],
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: '#EEE',
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
            min: 0,
            max: 100,
            stops: [
                [0.1, '#e0301e'], // green
                [0.5, '#ffb600'], // yellow
                [0.9, '#175d2d'] // red
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
            }
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'Environmental Sustainability',
            data: [80],
            dataLabels: {
                format:
                    '<div style="text-align:center">' +
                    '<span style="font-size:25px">{y}%</span><br/>' +
                    '<span style="font-size:12px;opacity:0.4"></span>' +
                    '</div>'
            },
            tooltip: {
                valueSuffix: '%'
            }
        }],
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
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

  createProcessOverview(){
      Highcharts.chart(this.processBubble.nativeElement,{
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: {
            text: 'Carbon emissions around the world (2014)'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
        },
        plotOptions: {
            packedbubble: {
                minSize: '20%',
                maxSize: '100%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    gravitationalConstant: 0.05,
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [
        {
            name: 'Europe',
            data: [{
                name: 'Germany',
                value: 767.1
            }, {
                name: 'Croatia',
                value: 20.7
            },
            {
                name: "Belgium",
                value: 97.2
            },
            {
                name: "Czech Republic",
                value: 111.7
            },
            {
                name: "Netherlands",
                value: 158.1
            }]
        }, 
        {
            name: 'Africa',
            data: [{
                name: "Senegal",
                value: 8.2
            },
            {
                name: "Cameroon",
                value: 9.2
            },
            {
                name: "Zimbabwe",
                value: 13.1
            },
            {
                name: "Ghana",
                value: 14.1
            },
            {
                name: "Kenya",
                value: 14.1
            }]
        }, 
        {
            name: 'Oceania',
            data: [{
                name: "Australia",
                value: 409.4
            },
            {
                name: "New Zealand",
                value: 34.1
            },
            {
                name: "Papua New Guinea",
                value: 7.1
            }]
        }, 
        {
            name: 'North America',
            data: [{
                name: "Costa Rica",
                value: 7.6
            },
            {
                name: "Honduras",
                value: 8.4
            },
            {
                name: "Jamaica",
                value: 8.3
            },
            {
                name: "Panama",
                value: 10.2
            },
            {
                name: "Guatemala",
                value: 12
            }]
        }, 
        {
            name: 'South America',
            data: [{
                name: "El Salvador",
                value: 7.2
            },
            {
                name: "Uruguay",
                value: 8.1
            },
            {
                name: "Bolivia",
                value: 17.8
            },
            {
                name: "Trinidad and Tobago",
                value: 34
            },
            {
                name: "Ecuador",
                value: 43
            }]
        }
        ]
      })
    // this.processBubble = new Chart({
    //     chart: {
    //         polar: true,
    //         type: 'line',
    //     },
    //     title: {
    //         text: "Let's see where each process stands",
    //         style: {'font-family': 'Arial, Helvetica'},
    //         // x: -80
    //     },
    //     credits: {enabled: false},
    //     exporting: {
    //         enabled: false
    //     },
    //     pane: {
    //         size: '100%'
    //     },
    
    //     xAxis: {
    //         categories: ['Fabric Store', 'Spreading & Cutting', 'Trim Store', 'Sewing', 'Finishing & Packing'],
    //         tickmarkPlacement: 'on',
    //         lineWidth: 0
    //     },
    
    //     yAxis: {
    //         gridLineInterpolation: 'polygon',
    //         lineWidth: 1,
    //         min: 0
    //     },
    
    //     tooltip: {
    //         shared: true,
    //         pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}%</b><br/>'
    //     },
    
    //     legend: {
    //         align: 'right',
    //         verticalAlign: 'middle',
    //         layout: 'vertical'
    //     },
    
    //     series: [{
    //         name: 'Market Score',
    //         color:'black',
    //         data: [89, 70, 70, 75, 85],
    //         pointPlacement: 'on'
    //     }, {
    //         name: 'Actual Score',
    //         color:'#eb8c00',
    //         data: [73, 62, 31, 30, 74],
    //         pointPlacement: 'on'
    //     }],
    
    //     responsive: {
    //         rules: [{
    //             condition: {
    //                 maxWidth: 500
    //             },
    //             chartOptions: {
    //                 legend: {
    //                     align: 'center',
    //                     verticalAlign: 'bottom',
    //                     layout: 'horizontal'
    //                 },
    //                 pane: {
    //                     size: '70%'
    //                 }
    //             }
    //         }]
    //     }
    
    // });
  }

  sewingNavigation(){
      this._router.navigate(['sewing-module']);
  }

  createOperationoduleChart(){

        this.gaugeInline = new Chart({
            chart: {
                type: 'solidgauge',
                height: '100%',
                width:300
            },
        
            title: {
                text: 'Inward',
                style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
            },
        
            pane: {
                center: ['50%', '85%'],
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
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
                min: 0,
                max: 100,
                stops: [
                    [0.1, '#e0301e'], // green
                    [0.5, '#ffb600'], // yellow
                    [0.9, '#175d2d'] // red
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
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Inward',
                data: [60],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}%</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4"></span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }],
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        });

        this.gaugeProcess = new Chart({
            chart: {
                type: 'solidgauge',
                height: '100%',
                width:300
            },
        
            title: {
                text: 'Process',
                style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
            },
        
            pane: {
                center: ['50%', '85%'],
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
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
                min: 0,
                max: 100,
                stops: [
            [0.1, '#e0301e'], // green
            [0.5, '#ffb600'], // yellow
            [0.9, '#175d2d'] // red
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
        }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Environmental Sustainability',
                data: [35],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}%</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4"></span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }],
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    },
                    color:"#175d2d"
                }
            }
        });

        this.gaugeOutward = new Chart({
            chart: {
                type: 'solidgauge',
                height: '100%',
                width:300
            },
        
            title: {
                text: 'Outward',
                style: {'font-family': 'Arial, Helvetica', 'font-size': '17px'}
            },
        
            pane: {
                center: ['50%', '85%'],
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
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
                min: 0,
                max: 100,
                stops: [
                    [0.1, '#e0301e'], // green
                    [0.5, '#ffb600'], // yellow
                    [0.9, '#175d2d'] // red
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
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Environmental Sustainability',
                data: [80],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">{y}%</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4"></span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }],
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    },
                    color:"#175d2d"
                }
            }
        });
    }
}
