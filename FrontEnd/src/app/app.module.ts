import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule, RoutingComponent } from './app-routing.module'; 
import {LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModuleperformanceComponent } from './moduleperformance/moduleperformance.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import more from 'highcharts/highcharts-more.src';
import solidGauge from 'highcharts/modules/solid-gauge.src';
import { SewingmoduleComponent } from './sewingmodule/sewingmodule.component';
import{NgDatepickerModule} from 'ng2-datepicker';
// import drilldown from 'highcharts/modules/drilldown.src';
// import exporting from 'highcharts/modules/exporting.src';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [more, solidGauge];
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ModuleperformanceComponent,
    SewingmoduleComponent
  ],
  imports: [
    BrowserModule, SharedModule, AppRoutingModule, FormsModule, HttpClientModule, ChartModule,NgDatepickerModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } // add as factory to your providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
