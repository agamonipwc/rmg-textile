import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from '../../assets/lib/jquery/dist/jquery.js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  fullname : any;
  emailaddress : any;
  username : any;
  password : any;
  confirmpassword : any;
  input : any;
  userBackendUrl : any = environment.backendUrl + 'registration';
  validationMsg : any;
  register(){
    var _this = this;
    var check = true;
    for(var i=0; i<this.input.length; i++) {
      if(this.validate(this.input[i]) == false){
        this.showValidate(this.input[i]);
        check=false;
      }
    } 
    if(check != false){
      var UserView = {
        Name : _this.fullname,
        Email : _this.emailaddress,
        Username : _this.username,
        Password : _this.password,
        ConfirmPassword : _this.confirmpassword
      }
      this.http.post<any>(this.userBackendUrl, UserView).subscribe(data => {
        if(data["statusCode"] == 200){
          _this._router.navigate(['login']);
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
  }

}
