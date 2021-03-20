import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { data } from 'jquery';

@Component({
  selector: 'app-operator-recommendation',
  templateUrl: './operator-recommendation.component.html',
  styleUrls: ['./operator-recommendation.component.css']
})
export class OperatorRecommendationComponent implements OnInit {
  data : any = [];
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
  }

  getRecommendation(){
    var recommendationView ={
      KPIId : 1
    };
    var url = environment.backendUrl + "Recommendation";
    var _this = this;
    this.http.post<any>(url, recommendationView).subscribe(responsedata =>{
      console.log(responsedata);
      // _this.recommendationData = responsedata;
    })
  }

}
