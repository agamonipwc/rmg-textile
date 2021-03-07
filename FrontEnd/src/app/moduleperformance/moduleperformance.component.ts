import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let more = require("highcharts/highcharts-more");
let Exporting = require('highcharts/modules/exporting');
let Sunburst = require('highcharts/modules/sunburst');
Boost(Highcharts);
noData(Highcharts);
more(Highcharts);
noData(Highcharts);
Exporting(Highcharts);
const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);
const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
Sunburst(Highcharts);
@Component({
  selector: 'app-moduleperformance',
  templateUrl: './moduleperformance.component.html',
  styleUrls: ['./moduleperformance.component.css']
})
export class ModuleperformanceComponent implements OnInit {
    Highcharts = Highcharts;
    // @ViewChild("processBubble", { read: ElementRef }) processBubble: ElementRef;
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
  processBubble : Chart;
  onclickStyle: any ={
      cursor: "pointer"
  }

  constructor(private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();

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

    this.to_left();
    this.to_right();
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
    var data = [
        {
            id: '0.0',
            parent: '',
            name: 'Alpine Garments',
            value : 50
        }, 
        {
            id: '1.3',
            parent: '0.0',
            name: 'Operations',
            value : 30
        }, 
        {
            id: '1.1',
            parent: '0.0',
            name: 'Social Sustainability',
            value : 70
        }, 
        {
            id: '1.2',
            parent: '0.0',
            name: 'Environmental Sustainability',
            value : 60
        },
        {
            id: '2.1',
            parent: '1.3',
            name: 'Inward',
            value : 30
        },
        {
            id: '2.2',
            parent: '1.3',
            name: 'Processes',
            value : 40
        },
        {
            id: '2.3',
            parent: '1.3',
            name: 'Processes',
            value : 60
        },
        //starting nested chart
        {
            id: '3.1',
            parent: '2.3',
            name: 'Fabric & Trims store ',
            value : 30
        },
        {
            id: '3.2',
            parent: '2.3',
            name: 'Spreading & Cutting',
            value : 40
        },
        {
            id: '3.3',
            parent: '2.3',
            name: 'Sewing',
            value : 60
        },
        {
            id: '3.4',
            parent: '2.3',
            name: 'Finishing & packaging',
            value : 60
        },
        // starting sub modules of Social Sustain
        {
            id: '3.5',
            parent: '1.1',
            name: 'Worker health & safety',
            value : 60
        },
        {
            id: '3.6',
            parent: '1.1',
            name: 'Worker health & safety',
            value : 30
        },
        {
            id: '3.7',
            parent: '1.1',
            name: 'Working hrs',
            value : 36
        },
        {
            id: '3.8',
            parent: '1.1',
            name: 'Compensation & benefits',
            value : 65
        },
        {
            id: '3.9',
            parent: '1.1',
            name: 'Skill developement',
            value : 45
        },
        {
            id: '4.1',
            parent: '1.1',
            name: 'HR Practices',
            value : 33
        },
        {
            id: '4.2',
            parent: '1.1',
            name: 'Facilites',
            value : 55
        },
        //starting submoudule of enviroment
        {
            id: '4.3',
            parent: '1.2',
            name: 'Resource Management',
            value : 57
        },
        {
            id: '4.4',
            parent: '1.2',
            name: 'Waste Management',
            value : 23
        },
        {
            id: '4.5',
            parent: '1.2',
            name: 'Environment Management Plan',
            value : 78
        }
    ];
    
    // Splice in transparent for the center circle
    Highcharts.getOptions().colors.splice(0, 0, 'transparent');
    
    
    this.processBubble = new Chart( {
        chart: {
            // height: '100%'
        },
        colors: ['#dedede','#e0301e', '#ffb600', '#175d2d', '#e0301e','#ffb600', '#175d2d', '#e0301e', '#ffb600'],
        credits: {enabled: false},
        exporting: {
          enabled: false
        },
        title: {
            text: 'Overall Performance of Factory'
        },
        // subtitle:{
        //     text: '<li>Status Green : Good Performance</li><li>Status Yellow : Moderate Performance</li>'
        // },
        series: [{
            type: "sunburst",
            data: data,
            size: 500,
            allowDrillToNode: true,
            cursor: 'pointer',
            dataLabels: {
                format: '{point.name}',
                filter: {
                    property: 'innerArcLength',
                    operator: '>',
                    value: 16
                },
                rotationMode: 'circular'
            },
            levels: [{
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                    color : "#000000"
                    // filter: {
                    //     property: 'outerArcLength',
                    //     operator: '>',
                    //     value: 64
                    // }
                }
            }, {
                level: 2,
                colorByPoint: true
            },
            {
                level: 3,
                colorVariation: {
                    key: 'brightness',
                    to: -0.3
                }
            }, {
                level: 4,
                colorVariation: {
                    key: 'brightness',
                    to: 0.3
                }
            }]
    
        }],
        tooltip: {
            headerFormat: "",
            pointFormat: 'Performance of <b>{point.name}</b> is <b>{point.value}%</b>'
        }
    });
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
    shift_left(){
        $('#animationTextDisplay').removeClass('slide-right').addClass('slide-left');
    }
    shitft_right(){
        $('#animationTextDisplay').removeClass('slide-left').addClass('slide-right');
    }
    to_left() {
        setInterval(this.shift_left, 10000);
    };
    to_right() {
        setInterval(this.shitft_right, 20000);
    };
}
