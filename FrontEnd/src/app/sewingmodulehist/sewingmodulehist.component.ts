import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import * as  Highcharts from 'highcharts';
import  More from 'highcharts/highcharts-more';
import { Chart } from 'angular-highcharts';
More(Highcharts);
declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let more = require("highcharts/highcharts-more");
let Exporting = require('highcharts/modules/exporting');
Boost(Highcharts);
noData(Highcharts);
more(Highcharts);
noData(Highcharts);
Exporting(Highcharts);
const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);
const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

@Component({
  selector: 'app-sewingmodulehist',
  templateUrl: './sewingmodulehist.component.html',
  styleUrls: ['./sewingmodulehist.component.css']
})
export class SewingmodulehistComponent implements OnInit {

  constructor(private http: HttpClient,private _router: Router) { }

  efficiencyHistoric : Chart;
  capacityHistoric : Chart;
  wipHistoric : Chart;
  machineDowntimeHistoric : Chart;
  dhuHistoric : Chart;
  defectsHistoric : Chart;
  rejectionHistoric: Chart;
  absentismHistoric: Chart;

  ngOnInit() {

    $("#footer").hide();
    $(".footer").hide();
    $("#topnavbar").hide();   
    this.createEfficiencyHistoric();
    this.createCapacityHistoric();
    this.createWIPHistoric();
    this.createMachineDowntimeHistoric();
    this.createDHUHistoric();
    this.createDefectsHistoric();
    this.createRejectionHistoric();
    this.createAbsentismHistoric();
  }

  createEfficiencyHistoric(){

    this.efficiencyHistoric = new Chart({
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
                text: 'Efficiency %'
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
            name: 'Efficiency',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createCapacityHistoric(){
    this.capacityHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
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
                text: 'Capacity %'
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
            name: 'Capacity Utilization',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createWIPHistoric(){
    this.wipHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Inline WIP Level',
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
                text: 'WIP %'
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
            name: 'Inline WIP Level',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createMachineDowntimeHistoric(){

    this.machineDowntimeHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Inline WIP Level',
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
                text: 'Downtime %'
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
            name: 'Machine Downtime',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createDHUHistoric(){

    this.dhuHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Inline WIP Level',
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
                text: 'DHU %'
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
            name: 'DHU',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createDefectsHistoric(){

    this.defectsHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: '',
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
                text: 'Defects %'
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
            name: 'Defects %',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createRejectionHistoric(){

    this.rejectionHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: '',
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
                text: 'Rejection %'
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
            name: 'Rejection',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  createAbsentismHistoric(){

    this.absentismHistoric = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: '',
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
                text: 'Absentism %'
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
            name: 'Absentism',
            data: [36, 71, 78,87,35,86,89,76,78,73,72,79,69,65,60],
            color: '#175d2d'
    
        }]
    });
  }

  navigateEfficiency(){
    this._router.navigate(['efficiency-overview']);
  }

  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }

}
