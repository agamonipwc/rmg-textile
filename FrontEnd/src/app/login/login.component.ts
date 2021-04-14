import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username : any;
  password : any;
  input : any;
  userBackendUrl : any = environment.backendUrl + 'login';
  validationMsg : any;
  login(){
    var _this = this;
    var check = true;
    for(var i=0; i<this.input.length; i++) {
      if(this.validate(this.input[i]) == false){
        this.showValidate(this.input[i]);
        check=false;
      }
    } 
    if(check != false){
      var UserLoginView = {
        Name : "",
        Email : "",
        Username : _this.username,
        Password : _this.password,
        ConfirmPassword : ""
      }
      this.http.post<any>(this.userBackendUrl, UserLoginView).subscribe(data => {
        if(data["statusCode"] == 200){
          _this._router.navigate(['module-performance']);
        }
        else{
          _this.validationMsg = data["message"];
          return;
        }
      })
    }
    return check;
    
  }

  showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
  }

  hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
  }
  
  validateEachInput(){
    var _this = this;
    $('.validate-form .input100').each(function(){
      $(this).focus(function(){
         _this.hideValidate(this);
         $(this).parent().removeClass('true-validate');
      });
    });
  }

  validate(input){
    if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          return false;
      }
    }
    else {
        if($(input).val().trim() == ''){
            return false;
        }
    }
  }
  constructor(private http: HttpClient, private _router: Router) { }

  ngOnInit() {
    this.input = $('.validate-input .input100');
    this.validateEachInput();
    $(".footer").hide();
    $("#footer").hide();
  }

}
