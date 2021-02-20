import { Component, OnInit } from '@angular/core';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sewingmodule',
  templateUrl: './sewingmodule.component.html',
  styleUrls: ['./sewingmodule.component.css']
})
export class SewingmoduleComponent implements OnInit {
  userBackendUrl : any = environment.backendUrl + 'kpicalculation';
  kpiCards : any = [];
  year :any = [
    {id: 2019, name: '2019'}
  ]
  month : any = [
    {id: 1, name: 'January'},
    {id: 2, name: 'February'},
    {id: 3, name: 'March'},
    {id: 4, name: 'April'},
    {id: 5, name: 'May'},
    {id: 6, name: 'June'},
    {id: 7, name: 'July'},
    {id: 8, name: 'August'},
    {id: 9, name: 'September'},
    {id: 10, name: 'October'},
    {id: 11, name: 'November'},
    {id: 12, name: 'December'},
  ]
  line : any = [
    {id: 1, name: 'Line 1'},
    {id: 2, name: 'Line 2'},
    {id: 3, name: 'Line 3'},
    {id: 4, name: 'Line 4'},
    {id: 5, name: 'Line 5'}
  ]
  selectedYear = "2019";
  selectedMonth = "1";
  selectedLine = "1";
  constructor(private http: HttpClient,) { }

  ngOnInit() {
    $("#topnavbar").hide();
    $("#footer").css("margin-left", "15%");
    this.getSewingKPIAnalysis();
  }
  getSewingKPIAnalysis(){
    var _this = this;
    this.kpiCards = [];
    var KPIView = {
      year : parseInt(this.selectedYear),
      month : parseInt(this.selectedMonth),
      lineNo : parseInt(this.selectedLine)
    }
    this.http.post<any>(this.userBackendUrl, KPIView).subscribe(data => {
      if(data.length > 0){
        data.forEach(element => {
          _this.kpiCards.push({
            "kpiname" : element.Value.kpiname,
            "status" : element.Value.status,
            "backgroundColor" : element.Value.backgroundColor,
            "weightageScore" : element.Value.weightageScore
          })
        });
      }
      else{
        // _this.validationMsg = data["message"];
        return;
      }
    })
  }
}
