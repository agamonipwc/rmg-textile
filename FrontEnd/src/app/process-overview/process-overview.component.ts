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
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 

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
  headerTextValue : string = "";

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
    var userFormattedDateOutput = this.formatUserInputDate($('#startDate').val(), $('#endDate').val())
    if($('#startDate').val() == $('#endDate').val()){
      this.headerTextValue = environment.processOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
    }
    else{
      this.headerTextValue = environment.processOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
    }
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
              visisble : false,
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
            visible : false,
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
                },
                enabled : false,
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
                  align: 'center',
                  format: '{point.y:.1f}', // one decimal
                  y: 5,
                  x: 3,
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
        visisble : false,
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
        visisble : false,
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
              align: 'center',
              format: '{point.y:.1f}', // one decimal
              y: 5,
              x: 3,
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
          this.headerTextValue = environment.processOverviewHeaderText + " on " + userFormattedDateOutput["startDateTime"];
        }
        else{
          this.headerTextValue = environment.processOverviewHeaderText + " from " + userFormattedDateOutput["startDateTime"] + " to " + userFormattedDateOutput["endDateTime"];
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
  backToPrevious(){
    window.history.back();
  }
}

