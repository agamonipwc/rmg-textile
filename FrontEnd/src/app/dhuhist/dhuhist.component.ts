import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
// import * as $ from 'jquery';
// declare var $: any;
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import * as  Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import * as XLSX from 'xlsx';  
declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

@Component({
  selector: 'app-dhuhist',
  templateUrl: './dhuhist.component.html',
  styleUrls: ['./dhuhist.component.css']
})
export class DhuhistComponent implements OnInit {
  @ViewChild('TABLE') TABLE: ElementRef;  
  @ViewChild('dataTable') table;
  dataTable: any;
  recommendationData : any = [];
  recommendationModalTitle : any = "";
  lineOptions : any = []
  unitOptions : any = [];
  locationOptions : any = [];
  data : any = [];
  operatorsDetailsList = [];
  
  dhuLine: Chart;
  defectDHULine: Chart;
  avgDefectsBar: Chart;
  defectLineWise : Chart;
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

  headerTextValue : string = "";

constructor(private http: HttpClient,private _router: Router) { }

ngOnInit() {
  $("#topnavbar").hide();
  $("#footer").css("margin-left", "15%");
  $("#footer").hide();
  $(".footer").hide();
  // this.calculateDHU('KPIView');
  // this.calculateDHUByDefect('KPIView');
  this.getFilterData();
  this.getMasterData();
  $(function() {
    // Hide all lists except the outermost.
    $('ul.tree ul').hide();
  
    $('.tree li > ul').each(function(i) {
      var $subUl = $(this);
      var $parentLi = $subUl.parent('li');
      var $toggleIcon = '<i class="js-toggle-icon" style="cursor:pointer;">+</i>';
  
      $parentLi.addClass('has-children');
      $("#defect_5").prop("checked", true);
      $("#dropdownDefectButton").html("Top 5 Defects");
      $("#period_5").prop("checked", true);
      $("#dropdownLinePeriodButton").html("Last 5 days");
      $parentLi.prepend( $toggleIcon ).find('.js-toggle-icon').on('click', function() {
        $(this).text( $(this).text() == '+' ? '-' : '+' );
        $subUl.slideToggle('fast');
      });
    });
  });
}

getRecommendation(){
  this.data = [];
  var recommendationView ={
    KPIId : 4,
    recommendationId : ""
  };
  var url = environment.backendUrl + "Recommendation";
  var _this = this;
  this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
    _this.recommendationModalTitle = "Recommendations for Defects Per Hundred Units (D.H.U.)"
    responsedata["allRecommendations"].forEach(element => {
      _this.data.push({
        Reasons : element["Reasons"],
        Recommendations : element["Recommendations"],
        SubReasons : element["SubReasons"],
      });
    });
  })
}

ExportToExcelDHU() {  
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);  
  const wb: XLSX.WorkBook = XLSX.utils.book_new();  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
  XLSX.writeFile(wb, 'DHU_Recommendations.xlsx');  
}

  getFilterData(){
    var KPIView = {
      Line : [1,2],
      Location : [1,2],
      Unit : [1,2],
      DefectCount : 5,
      StartDate : "2021-01-27 00:00:00.000",
      EndDate : "2021-01-31 00:00:00.000",
    }
    this.calculateDHUByDefect(KPIView);
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.defectHistoricalOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.defectHistoricalOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
    }
    // this.calculateAvgDefectsDHU(KPIView);
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
  calculateDHU(KPIView){
   var _this = this;
    var url = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      _this.dhuLine = new Chart({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        labels: {
          enabled: false,
        },
        xAxis: {
            categories: responsedata["DHUHistoricalCalculation"]["Value"]["categories"]
          
        },
        yAxis: {
            title: {
                text: 'Defects Per Hundred Units (D.H.U.)	'
            },
            max:13,
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
            name: 'Defects Per Hundred Units (D.H.U.)	',
            showInLegend: false,
            data: responsedata["DHUHistoricalCalculation"]["Value"]["data"],
            color: '#175d2d'
    
        }]
      });
    })
  }

  calculateDHUByDefect(KPIView){
    var _this = this;
    var url = environment.backendUrl + "SewingHistorical";
    this.http.post<any>(url, KPIView).subscribe(responsedata => {
      console.log(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["lineWiseDefectChartViewModel"])
      // console.log(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["data"]);
      // responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["data"].forEach(element => {
      //   for(var index = 0; index < element["data"].length; index++){
      //     if(element["data"][index] == 0){
      //       element["data"][index] = null;
      //     }
      //   }
      // });
      _this.defectDHULine = new Chart(
        {
          chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        labels: {
          enabled: false,
        },
        exporting: {
          enabled: false
        },
        credits: {enabled: false},
        xAxis: {
          categories: responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["categories"],
          visible : true,
          labels: {
            rotation: -45
          }
        },
        yAxis: {
            title: {
                text: 'Total WorkStation'
            },
            max:parseInt(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["maxOccurance"]),
            min:0
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            },
            series: {
              // general options for all series
              connectNulls: true
            }
        },
        series: responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["data"]
      });
      _this.calculateAvgDefectsDHU(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["lineWiseDefectChartViewModel"]["Value"]["categories"], responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["pieChartViewModel"],responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["lineWiseDefectChartViewModel"]["Value"]["lineWiseDefectViews"], parseInt(responsedata["TopFiveDHUHistoricalCalculation"]["Value"]["maxOccurance"]))
    })
  }

  calculateAvgDefectsDHU(defectLineWiseCategories, data, defectLineWiseData, maxOccurance){
    this.avgDefectsBar = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      title: {
          text: ''
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
            valueSuffix: '%'
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'top',
        layout: 'vertical',
        x: 10,
        y: 10,
        style:{
          fontSize:'8px'
        }
      },
      plotOptions: {
        pie: {
            size:180,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              distance: -50,
              // rotation: 80,
              connectorShape: 'crookedLine',
              crookDistance: '10%',
              alignTo: 'plotEdges',
              format: '<b>{point.percentage:.1f}%',
              style: {
                fontSize: '9' + 'px',
                // color: 'black',
                textShadow: false,
                textOutline: false  
              }
            },
            showInLegend: true, 
            // innerSize:'60%'
        }
      },
      series: [data]
    })
    this.defectLineWise = new Chart({
      chart: {
        type: 'column'
      },
      exporting: {
        enabled: false
      },
      credits: {enabled: false},
      title: {
          text: ''
      },
      xAxis: {
          categories: defectLineWiseCategories
      },
      yAxis: {
          min: 0,
          max: 100,
          title: {
              text: 'Defect Distribution (%)'
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
      legend: {
        enabled: false,
        align: 'right',
        x: 10,
        verticalAlign: 'top',
        y: maxOccurance,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}'
      },
      
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                format: '<b>{point.percentage:.0f}%',
                style: {
                  fontSize: '9' + 'px',
                  textShadow: false,
                  textOutline: false  
                }
              },
              
          }
      },
      series: defectLineWiseData
    })
    // this.avgDefectsBar = new Chart(
    // {
    //   chart: {
    //       type: 'bar'
    //   },
    //   exporting: {
    //     enabled: false
    //   },
    //   credits: {enabled: false},
    //   title: {
    //       text: ''
    //   },
    //   xAxis: {
    //       categories: categories
    //   },
    //   yAxis: {
    //       min: 0,
    //       max: 13,
    //       title: {
    //           text: 'Defects Per Hundred Units (D.H.U.)'
    //       }
    //   },
    //   legend: {
    //       reversed: true
    //   },
    //   plotOptions: {
    //       series: {
    //           stacking: 'normal',
    //           dataLabels: {
    //             enabled: true,
    //             color: '#000000'
    //           }
    //       }
    //   },
    //   series: [{
    //           name:'Avg. DHU',
    //           showInLegend: false,
    //           data: data,
    //           dataLabels: {
    //             align: 'left',
    //             enabled: true
    //         }
    //   }]
    // });
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
    var checkedDefect = $('.option.justone.defect:radio:checked').map(function() {
      var defectId = parseFloat(this.value);
      return defectId;
    }).get();
    var StartDate = new Date($('#startDate').val());
    var EndDate = new Date($('#endDate').val());

    if(checkedLocations.length != 0 && checkedLines.length != 0 && checkedUnits.length != 0 && $('#startDate').val() != "" && $('#endDate').val() != "" && checkedDefect.length !=0){
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
        DefectCount : checkedDefect[0],
        StartDate : startDateTime,
        EndDate : endDateTime
      }
      var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
      if($('#startDate').val() == $('#endDate').val()){
        this.headerTextValue = environment.defectHistoricalOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
      }
      else{
        this.headerTextValue = environment.defectHistoricalOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
      }
      this.calculateDHUByDefect(KPIView);
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

  backToPrevious(){
    window.history.back();
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

  onPeriodChange(event){
    if (event.target.checked){
      this.periodOptions.forEach(element => {
        if(element.Id == event.target.value){
          $("#dropdownLinePeriodButton").html(element.Name);
          var checkedPeriod = $('.option.justone.period:radio:checked').map(function() {
            var periodId = parseInt(this.value);
            return periodId;
          }).get();
          if(checkedPeriod[0] != null){
            var EndDate = new Date($('#endDate').val());
            var last = new Date(EndDate.getTime() - (checkedPeriod[0] * 24 * 60 * 60 * 1000));
            var day =last.getDate();
            var month=last.getMonth()+1;
            var year=last.getFullYear();
            var monthString = month.toString();
            var dayString = day.toString();
            if(month < 10){
              monthString = "0" + month;
            }
            if(day < 10){
              dayString = "0" + day;
            }
            var StartDate = year + "-" + monthString + "-" + dayString;
            $('#startDate').val(StartDate)
          }
        }
      });
    }
  }
  defectOptions=[
    {
      Id:5, Name:"Top 5 Defects"
    },
    {
      Id:10, Name:"Top 10 Defects"
    }
  ]
  onDefectChange(event){
    if (event.target.checked){
      this.defectOptions.forEach(element => {
        if(element.Id == event.target.value){
          $("#dropdownDefectButton").html(element.Name);
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
  sewingNavigation(){
    this._router.navigate(['sewing-module']);
  } 
  dashboardNavigation(){
    this._router.navigate(['module-performance']);
  }
  processNavigation(){
    this._router.navigate(['process-overview']);
  }
  navigateToDHUOverview(){
    this._router.navigate(['dhu-overview']);
  }
}
