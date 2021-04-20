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
  selector: 'app-inlinewip',
  templateUrl: './inlinewip.component.html',
  styleUrls: ['./inlinewip.component.css']
})
export class InlinewipComponent implements OnInit {

  StyleA1 : any = [];
  StyleA2 : any = [];
  StyleA3 : any = [];
  StyleA4 : any = [];
  StyleA1Name : string = "";
  StyleA2Name : string = "";
  StyleA3Name : string = "";
  StyleA4Name : string = "";
  OpWIPStyleA: Chart;
  OpWIPStyleB: Chart;
  OpWIPStyleC: Chart;
  OpWIPStyleD : Chart;
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  data : any = [];
  operatorsDetailsList = [];
  KPIView = {};
  locationOptions = [];
  unitOptions = [];
  lineOptions = [];
  constructor(private http: HttpClient,private _router: Router) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    $("#footer").hide();
    $(".footer").hide();
    this.getMasterData();
    this.getFilterData();
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
    this.KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      StartDate : "2021-01-01 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateWIPStyleWise(this.KPIView);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  

  calculateWIPStyleWise(KPIView){
    var _this = this;
    this.StyleA1 = [];
    this.StyleA2 = [];
    this.StyleA3 = [];
    this.StyleA4 = [];
    var url = environment.backendUrl + "InlineWIPOverview";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
        _this.StyleA1Name = responsedata["data"][0]["StyleName"];
        _this.StyleA2Name = responsedata["data"][1]["StyleName"];
        _this.StyleA3Name = responsedata["data"][2]["StyleName"];
        _this.StyleA4Name = responsedata["data"][3]["StyleName"];
        responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA1.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                },
                actualWIPValue : element.LineWIPActualValue.toString()
            })
        });
        responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA2.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                },
                actualWIPValue : element.LineWIPActualValue.toString()
            })
        });
        responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA3.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                },
                actualWIPValue : element.LineWIPActualValue.toString()
            })
        });
        responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
            _this.StyleA4.push({
                lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                styleDate :{
                    'width' : element.LineWIPPercentage.toString() + "%",
                    'background-color' : _this.getRandomColor()
                },
                actualWIPValue : element.LineWIPActualValue.toString()
            })
        });
    })
    // this.calculateOperatorWIPStyleA(KPIView);
    // this.calculateOperatorWIPStyleB(KPIView);
    // this.calculateOperatorWIPStyleC(KPIView);
    // this.calculateOperatorWIPStyleD(KPIView);
  }

  calculateOperatorWIPStyleA(styleName){
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        _this.OpWIPStyleA = new Chart({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: responsedata["categories"]
            },
            exporting: {
                enabled: false
            },
            credits: {enabled: false},
            yAxis: {
                min: 0,
                title: {
                    text: 'Operator Inline WIP'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }
   calculateOperatorWIPStyleB(styleName){
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        _this.OpWIPStyleB = new Chart({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: responsedata["categories"]
            },
            exporting: {
                enabled: false
            },
            credits: {enabled: false},
            yAxis: {
                min: 0,
                title: {
                    text: 'Operator Inline WIP'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }

   calculateOperatorWIPStyleC(styleName){
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        _this.OpWIPStyleC = new Chart({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: responsedata["categories"]
            },
            exporting: {
                enabled: false
            },
            credits: {enabled: false},
            yAxis: {
                min: 0,
                title: {
                    text: 'Operator Inline WIP'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }

   calculateOperatorWIPStyleD(styleName){
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        _this.OpWIPStyleD = new Chart({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: responsedata["categories"]
            },
            exporting: {
                enabled: false
            },
            credits: {enabled: false},
            yAxis: {
                min: 0,
                title: {
                    text: 'Operator Inline WIP'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: ( // theme
                            Highcharts.defaultOptions.title.style &&
                            Highcharts.defaultOptions.title.style.color
                        ) || 'gray'
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total WIP: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }

    sewingNavigation(){
    this._router.navigate(['sewing-module']);
  } 
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }
  navigateWIPOperator(){
    this._router.navigate(['wip-operator']);
  }

  getRecommendation(recommendationId){
    this.data = [];
    var recommendationView ={
      KPIId : 8,
      recommendationId : recommendationId.toString()
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
        _this.recommendationModalTitle = "Recommemdations for Inline WIP"
        _this.getOperatorsName('Moderate');
        responsedata["allRecommendations"].forEach(element => {
            _this.data.push({
              Reasons : element["Reasons"],
              Recommendations : element["Recommendations"],
              SubReasons : element["SubReasons"],
            });
        });
    })
  }
  getOperatorsName(efficiencyLevel){
    this.operatorsDetailsList = [];
    var operatorsDetailsView ={
      efficiencyLevel : efficiencyLevel
    };
    var url = environment.backendUrl + "OperatorsName";
    var _this = this;
    this.http.post<any>(url, operatorsDetailsView).subscribe(responsedata =>{
      responsedata["operatorsDetails"].forEach(element => {
        _this.operatorsDetailsList.push({
          Name : element["Name"],
          Machine : element["Machine"],
          Unit : element["Unit"],
          Location : element["Location"],
          Line : element["Line"]
        });
      });
    })
  }

  navigateWIPSummary(){
    this._router.navigate(['wip-summary']);
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
    var checkedLines = $('.option.justone.line:radio:checked').map(function() {
      var lineId = parseFloat(this.value);
      return lineId;
    }).get();
    var StartDate = new Date($('#startDate').val());
    var startDay = StartDate.getDate();
    var startmonth = StartDate.getMonth() + 1;
    var startyear = StartDate.getFullYear();
    var startDateTime = startyear + "-" + startmonth + '-' + startDay + " 00:00:00.000";
    var EndDate = new Date($('#endDate').val());
    var endDay = EndDate.getDate();
    var endmonth = EndDate.getMonth() + 1;
    var endyear = EndDate.getFullYear();
    var endDateTime = endyear + "-" + endmonth + '-' + endDay + " 00:00:00.000";
    this.KPIView = {
      Line : checkedLines,
      Location : checkedLocations,
      Unit : checkedUnits,
      // StartDate : "2021-01-31 00:00:00.000",
      // EndDate : "2021-01-31 00:00:00.000",
      StartDate : startDateTime,
      EndDate : endDateTime
    }
    this.calculateOperatorWIPStyleA(this.KPIView);
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

}
