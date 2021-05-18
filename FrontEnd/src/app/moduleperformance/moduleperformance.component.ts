import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import {Chart} from 'angular-highcharts';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.js';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
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
  scatterChart : Chart;
  onclickStyle: any ={
      cursor: "pointer"
  }
  locationOptions :any = [];
  unitOptions : any = [];
  lineOptions : any = [];
  headerTextValue : string = "";

  constructor(private _router: Router, private http: HttpClient) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();

    // $(function() {
    //     // Hide all lists except the outermost.
    //     $('ul.tree ul').hide();
      
    //     $('.tree li > ul').each(function(i) {
    //       var $subUl = $(this);
    //       var $parentLi = $subUl.parent('li');
    //       var $toggleIcon = '<i class="js-toggle-icon" style="cursor:pointer;">+</i>';
      
    //       $parentLi.addClass('has-children');
          
    //       $parentLi.prepend( $toggleIcon ).find('.js-toggle-icon').on('click', function() {
    //         $(this).text( $(this).text() == '+' ? '-' : '+' );
    //         $subUl.slideToggle('fast');
    //       });
    //     });
    // });
    this.getMasterData();
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.moduleOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.moduleOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
    }
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

  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
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
    
    formatUserInputDate(startDate, endDate){
        var StartDate = new Date($('#startDate').val());
        var EndDate = new Date($('#endDate').val());
        var startDay = StartDate.getDate();
        var startmonth = StartDate.getMonth() + 1;
        var startyear = StartDate.getFullYear();
        var startDateTime = startDay + "." + startmonth + '.' + startyear;
        var endDay = EndDate.getDate();
        var endmonth = EndDate.getMonth() + 1;
        var endyear = EndDate.getFullYear();
        var endDateTime = endDay + "." + endmonth + '.' + endyear;
        return {startDateTime : startDateTime, endDateTime : endDateTime}
      }
    
      onLocationChange(event){
        var masterDataUrl = environment.backendUrl + "MasterData";
        var _this = this;
        var locations = [];
        if (event.target.checked){
          this.locationOptions.forEach(element => {
            if(element.Id == event.target.value){
              $("#dropdownLocationMenuButton").html(element.Name);
            }
          });
          locations.push(parseInt(event.target.value))
          var dataViewModel = {
            locations : locations,
            units : []
          }
          this.http.post<any>(masterDataUrl,dataViewModel).subscribe(responsedata =>{
            if(responsedata["statusCode"] == 200){
              responsedata["data"].forEach(element => {
                $("#unit_label_" + element.UnitId).show();
                $("#line_label_1").show();
                $("#line_label_2").show();
                // $("#line_label_" + element.Id).show();
              });
            }
          })
        }
        else{
          $('.option.justone.location:radio').prop('checked', false);
          $('.option.justone.unit:radio').prop('checked', false);
          $(".unit_label").hide();
          $(".line_label").hide();
          $('.option.justone.line:radio').prop('checked', false);
        }
      }
    
      onUnitChange(event){
        if (event.target.checked){
          this.unitOptions.forEach(element => {
            if(element.Id == event.target.value){
              $("#dropdownUnitMenuButton").html(element.Name);
            }
          });
        }
      }
    
      onLineChange(event){
        if (event.target.checked){
          this.lineOptions.forEach(element => {
            if(element.Id == event.target.value){
              $("#dropdownLineMenuButton").html(element.Name);
            }
          });
        }
      }
    navigateToSewingHistorical(){
        this._router.navigate(['module-historical']);
    }
    getSewingKPIAnalysis(){
        var checkedLocations = $('.option.justone.location:radio:checked').map(function() {
          var locationId = parseFloat(this.value);
          return locationId;
        }).get();
        var checkedUnits = $('.option.justone.unit:radio:checked').map(function() {
          var unitId = parseFloat(this.value);
          return unitId;
        }).get();
        var checkedLines = $('.option.justone.line:radio:checked').map(function() {
          var lineId = parseFloat(this.value);
          return lineId;
        }).get();
        var StartDate = new Date($('#startDate').val());
        var EndDate = new Date($('#endDate').val());
    
        if(checkedLocations.length != 0 && checkedLines.length != 0 && checkedUnits.length != 0 && $('#startDate').val() != "" && $('#endDate').val() != ""){
          if(StartDate > EndDate){
            Swal.fire({    
              icon: 'error',  
              title: 'Sorry...',  
              text: 'StartDate can not be greater than EndDate',  
              showConfirmButton: true
            })  
          }
          else{
            var startDay = StartDate.getDate();
            var startmonth = StartDate.getMonth() + 1;
            var startyear = StartDate.getFullYear();
            var startDateTime = startyear + "-" + startmonth + '-' + startDay + " 00:00:00.000";
            var endDay = EndDate.getDate();
            var endmonth = EndDate.getMonth() + 1;
            var endyear = EndDate.getFullYear();
            var endDateTime = endyear + "-" + endmonth + '-' + endDay + " 00:00:00.000";
            var KPIView = {
              Line : checkedLines,
              Location : checkedLocations,
              Unit : checkedUnits,
              StartDate : startDateTime,
              EndDate : endDateTime
            }
            var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
            if($('#startDate').val() == $('#endDate').val()){
              this.headerTextValue = environment.moduleOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
            }
            else{
              this.headerTextValue = environment.moduleOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
            }
            // this.calculateFirstPageKPIs(KPIView);
            // this.calculateSecondPageKPIs(KPIView);
          }
        }
        else{
          Swal.fire({    
            icon: 'error',  
            title: 'Sorry...',  
            text: 'Please select location, unit ,line, start date and end date to view historical data',  
            showConfirmButton: true
          })  
        }
      }
    backToPrevious(){
        window.history.back();
    }
 }
