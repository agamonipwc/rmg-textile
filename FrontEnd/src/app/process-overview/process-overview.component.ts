import { Component, OnInit,ViewChild, ElementRef, } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as  Highcharts from 'highcharts';
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

@Component({
  selector: 'app-process-overview',
  templateUrl: './process-overview.component.html',
  styleUrls: ['./process-overview.component.css']
})
export class ProcessOverviewComponent implements OnInit {
  @ViewChild("mmrContainer", { read: ElementRef }) mmrContainer: ElementRef;
  @ViewChild("defectContainer", { read: ElementRef }) defectContainer: ElementRef;
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];

  constructor(private http: HttpClient,private _router: Router) { }

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
    this.getMasterData();
    this.calculateProcessKPIs();
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
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  }
  calculateProcessKPIs(){
    Highcharts.chart(this.mmrContainer.nativeElement, {
          colors: [
            "#e0301e"
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
              max : 2,
              title: {
                  text: 'Value',
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
              pointFormat: 'MMR: <b>{point.y:.1f}</b>',
              enabled: false,
          },
          series: [{
              name: 'MMR',
              data: [
                1.6
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
        "#175d2d"
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
            7.5
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
  navigateDefectPercentage(){
    this._router.navigate(['defect-overview']); 
  }
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }
}
