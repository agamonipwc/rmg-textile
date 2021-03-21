import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.js';
import { data } from 'jquery';
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let more = require("highcharts/highcharts-more");
let Exporting = require('highcharts/modules/exporting');
let Sunburst = require('highcharts/modules/sunburst');
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
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
  selector: 'app-moduleperformancehist',
  templateUrl: './moduleperformancehist.component.html',
  styleUrls: ['./moduleperformancehist.component.css']
})
export class ModuleperformancehistComponent implements OnInit {

  operationHistoric : Chart;
  socialHistoric : Chart;
  environmentalHistoric : Chart;
  inwardHistoric : Chart;
  processHistoric : Chart;
  outwardHistoric : Chart;
  fabricTrimHistoric : Chart;
  SpreadingCuttingHistoric : Chart;
  SewingHistoric : Chart;
  FinishingPackagingHistoric : Chart;

  constructor() { }

  ngOnInit() {

    $("#footer").hide();
    $(".footer").hide();
    $("#topnavbar").hide();
    this.createOperationHistoric();
    this.createSocialHistoric();
    this.createEnvironmentalHistoric();
    this.createInwardHistoric();
    this.createProcessHistoric();
    this.createOutwardHistoric();
    this.createFabricTrimHistoric();
    this.createSpreadingCuttingHistoric();
    this.createSewingHistoric();
    this.createFinishingPackagingHistoric();
  }

  createOperationHistoric(){

    this.operationHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
           
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Operations',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createInwardHistoric(){

    this.inwardHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Inward',
            data: [56, 45, 67,89,44,56,60,71,78,73,72,79,69,65,60],
            color: '#ffb600'
    
        }]
    });
  }

  createProcessHistoric(){

    this.processHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Process',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color:'#e0301e'
    
        }]
    });
  }
  createFabricTrimHistoric(){

    this.fabricTrimHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Fabric & Trim Store Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Fabric & Trim Store',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color:'#ffb600'
    
        }]
    });
  }
  createSpreadingCuttingHistoric(){

    this.SpreadingCuttingHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Spreading & Cutting Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Spreading & Cutting',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color: '#175d2d'
    
        }]
    });
  }
  createSewingHistoric(){

    this.SewingHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Sewing Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Sewing',
            data: [50, 45,45,55,51,63,57,64,59,78,68,79,69,65,52],
            color:'#e0301e'
    
        }]
    });
  }
  createFinishingPackagingHistoric(){

    this.FinishingPackagingHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Finishing & Packaging Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Finishing & Packaging',
            data: [67, 45,45,55,69,68,55,64,59,78,68,79,69,65,76],
            color:'#ffb600'
    
        }]
    });
  }

  createOutwardHistoric(){

    this.outwardHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Operations Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Outward',
            data: [67, 45,71,60,69,68,55,73,89,90,88,79,69,65,76],
            color:'#175d2d'
    
        }]
    });
  }

  createSocialHistoric(){

    this.socialHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Social Sustainability Historic Performance',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Social Sustainability',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            colour:'#175d2d'
    
        }]
    });
  }

  createEnvironmentalHistoric(){

    this.environmentalHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Environmental Sustainability',
            style: {'font-family': 'Arial, Helvetica', 'font-size': '13px', 'display': 'none'}
        },
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021','07/01/2021', 
    '08/01/2021', '09/01/2021', '10/01/2021', '11/01/2021', 
    '12/01/2021','13/01/2021','14/01/2021','15/01/2021']
        },
        yAxis: {
            title: {
                text: 'Efficiency'
            },
            max:100,
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: 'Environmental Sustainability',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#e0301e'
    
        }]
    });
  }

}
