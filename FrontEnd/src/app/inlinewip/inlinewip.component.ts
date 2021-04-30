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
import * as XLSX from 'xlsx';  
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
  @ViewChild('TABLE') TABLE: ElementRef;  
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
  periodOptions : any=[
    {
      Id : 5, Name:"Last 5 days"
    },
    {
      Id : 10, Name:"Last 10 days"
    },
    {
      Id : 15, Name:"Last 15 days"
    },
    {
      Id : 20, Name:"Last 20 days"
    }
  ];
  isShownStyleA1 : boolean = false;
  isShownStyleA2 : boolean = false;
  isShownStyleA3 : boolean = false;
  isShownStyleA4 : boolean = false;
  headerTextValue : string = "";
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
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.inlineOverViewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.inlineOverViewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
    }
  }
  formatUserInputDate(startDate, endDate){
    var StartDate = new Date(startDate);
    var EndDate = new Date(endDate);
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

  getRandomColor(lineUnitName) {
    var letters = '0123456789ABCDEF';
    var color = "";
    var colorArray = ["#933401","#c28a00", "#a43e50", "#aa2417", "#ae6800", "#deb8ff", "#2c8646", "#0060d7"];
    if(lineUnitName == "Line1 Unit1"){
        color = colorArray[6];
    }
    else if(lineUnitName == "Line1 Unit2"){
        color = colorArray[1];
    }
    else if(lineUnitName == "Line2 Unit2"){
        color = colorArray[2];
    }
    else if(lineUnitName == "Line2 Unit1"){
        color = colorArray[7];
    }
    // for (var i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    return color;
  }
  

  calculateWIPStyleWise(KPIView){
    this.isShownStyleA1 = false;
    this.isShownStyleA2 = false;
    this.isShownStyleA3 = false;
    this.isShownStyleA4 = false;
    var _this = this;
    this.StyleA1 = [];
    this.StyleA2 = [];
    this.StyleA3 = [];
    this.StyleA4 = [];
    var url = environment.backendUrl + "InlineWIPOverview";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
        console.log("-----------Response Data--------",responsedata);
        if(responsedata["data"].length == 1){
            if(typeof(responsedata["data"][0] != -1)){
                if(responsedata["data"][0]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
        }
        

        if(responsedata["data"].length == 2){
            if(typeof(responsedata["data"][0] != -1)){
                if(responsedata["data"][0]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
            if(typeof(responsedata["data"][1] != -1)){
                if(responsedata["data"][1]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
        }
        
        if(responsedata["data"].length == 3){
            if(typeof(responsedata["data"][0] != -1)){
                if(responsedata["data"][0]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
            if(typeof(responsedata["data"][1] != -1)){
                if(responsedata["data"][1]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
            if(typeof(responsedata["data"][2] != -1)){
                console.log("--------Inside this-------");
                if(responsedata["data"][2]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][2]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][2]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][2]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
        }
        
        if(responsedata["data"].length == 4){
            if(typeof(responsedata["data"][0] != -1)){
                if(responsedata["data"][0]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][0]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][0]["StyleName"];
                    responsedata["data"][0]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
            if(typeof(responsedata["data"][1] != -1)){
                if(responsedata["data"][1]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][1]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][1]["StyleName"];
                    responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
            if(typeof(responsedata["data"][2] != -1)){
                console.log("--------Inside this-------");
                if(responsedata["data"][2]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][2]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][2]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][2]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][2]["StyleName"];
                    responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
            if(typeof(responsedata["data"][3] != -1)){
                console.log("--------Inside this-------");
                if(responsedata["data"][3]["StyleName"] == "Style A"){
                    _this.isShownStyleA1 = true;
                    _this.StyleA1Name = responsedata["data"][3]["StyleName"];
                    responsedata["data"][3]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA1.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][3]["StyleName"] == "Style B"){
                    _this.isShownStyleA2 = true;
                    _this.StyleA2Name = responsedata["data"][3]["StyleName"];
                    responsedata["data"][3]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA2.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][3]["StyleName"] == "Style C"){
                    _this.isShownStyleA3 = true;
                    _this.StyleA3Name = responsedata["data"][3]["StyleName"];
                    responsedata["data"][3]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA3.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
                else if(responsedata["data"][3]["StyleName"] == "Style D"){
                    _this.isShownStyleA4 = true;
                    _this.StyleA4Name = responsedata["data"][3]["StyleName"];
                    responsedata["data"][3]["StyleWIPViewModel"].forEach(element => {
                        var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
                        _this.StyleA4.push({
                            lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
                            styleDate :{
                                'width' : element.LineWIPPercentage.toString() + "%",
                                'background-color' : _this.getRandomColor(lineUnitName)
                            },
                            actualWIPValue : element.LineWIPActualValue.toString()
                        })
                    });
                }
            }
        }
        
        
        console.log(_this.isShownStyleA1, _this.isShownStyleA2, _this.isShownStyleA3, _this.isShownStyleA4);
        // _this.StyleA2Name = responsedata["data"][1]["StyleName"];
        // _this.StyleA3Name = responsedata["data"][2]["StyleName"];
        // _this.StyleA4Name = responsedata["data"][3]["StyleName"];
        
        // responsedata["data"][1]["StyleWIPViewModel"].forEach(element => {
        //     var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
        //     _this.StyleA2.push({
        //         lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
        //         styleDate :{
        //             'width' : element.LineWIPPercentage.toString() + "%",
        //             'background-color' : _this.getRandomColor(lineUnitName)
        //         },
        //         actualWIPValue : element.LineWIPActualValue.toString()
        //     })
        // });
        // responsedata["data"][2]["StyleWIPViewModel"].forEach(element => {
        //     var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
        //     _this.StyleA3.push({
        //         lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
        //         styleDate :{
        //             'width' : element.LineWIPPercentage.toString() + "%",
        //             'background-color' : _this.getRandomColor(lineUnitName)
        //         },
        //         actualWIPValue : element.LineWIPActualValue.toString()
        //     })
        // });
        // responsedata["data"][3]["StyleWIPViewModel"].forEach(element => {
        //     var lineUnitName = "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString();
        //     _this.StyleA4.push({
        //         lineName : "Line"+element.LineName.toString() + " " + "Unit" + element.Unit.toString() + " (" + element.LineWIPPercentage + "%" + ")",
        //         styleDate :{
        //             'width' : element.LineWIPPercentage.toString() + "%",
        //             'background-color' : _this.getRandomColor(lineUnitName)
        //         },
        //         actualWIPValue : element.LineWIPActualValue.toString()
        //     })
        // });
    })
  }

  backToPrevious(){
    window.history.back();
  }

  calculateOperatorWIPStyleA(styleName){
    var _this = this;
    console.log("---------KPIView-----------",this.KPIView);
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        responsedata["inlineWIPOperatorsDataList"].forEach(outerElement => {
            for(var index = 0; index < outerElement["data"].length; index++){
                if(outerElement["data"][index] == 0){
                    outerElement["data"][index] = null;
                }
            }
        });
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
                // visible : false,
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
                pointFormat: '<b>{series.name}</b> has WIP Level : {point.y}<br/>'
            },
            legend: {
                enabled: false
             },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }
   calculateOperatorWIPStyleB(styleName){
    console.log("---------KPIView-----------",this.KPIView);
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        responsedata["inlineWIPOperatorsDataList"].forEach(outerElement => {
            for(var index = 0; index < outerElement["data"].length; index++){
                if(outerElement["data"][index] == 0){
                    outerElement["data"][index] = null;
                }
            }
        });
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
                // visible : false,
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
                pointFormat: '{series.name} has WIP Level : {point.y}<br/>'
            },
            legend: {
                enabled: false
             },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }

   calculateOperatorWIPStyleC(styleName){
    console.log("---------KPIView-----------",this.KPIView);
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        responsedata["inlineWIPOperatorsDataList"].forEach(outerElement => {
            for(var index = 0; index < outerElement["data"].length; index++){
                if(outerElement["data"][index] == 0){
                    outerElement["data"][index] = null;
                }
            }
        });
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
                // visible : false,
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
                pointFormat: '{series.name} has WIP Level : {point.y}<br/>'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: responsedata["inlineWIPOperatorsDataList"]
        });
    })
   }

   calculateOperatorWIPStyleD(styleName){
    console.log("---------KPIView-----------",this.KPIView);
    var _this = this;
    this.KPIView["StyleName"] = styleName;
    var url = environment.backendUrl + "OperatorWIP";
    this.http.post<any>(url, this.KPIView).subscribe(responsedata => {
        responsedata["inlineWIPOperatorsDataList"].forEach(outerElement => {
            for(var index = 0; index < outerElement["data"].length; index++){
                if(outerElement["data"][index] == 0){
                    outerElement["data"][index] = null;
                }
            }
        });
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
                // visible : false,
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
                pointFormat: '{series.name} has WIP Level : {point.y}<br/>'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
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
                sessionStorage.setItem("KPIView",JSON.stringify(KPIView));
                this._router.navigate(['wip-operator']);
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
    // this._router.navigate(['wip-operator']);
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
  ExportToExcelLowEfficiency() {  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
    XLSX.writeFile(wb, 'InLine_WIP_Recommendation.xlsx');  
  }

  navigateWIPSummary(){
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
            sessionStorage.setItem("KPIView",JSON.stringify(KPIView));
            this._router.navigate(['wip-summary']);
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
            this.KPIView = KPIView;
            var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
            if($('#startDate').val() == $('#endDate').val()){
            this.headerTextValue = environment.inlineOverViewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
            }
            else{
            this.headerTextValue = environment.inlineOverViewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
            }
            this.calculateWIPStyleWise(KPIView);
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
