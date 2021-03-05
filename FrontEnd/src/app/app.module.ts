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
import { HighchartsChartModule } from 'highcharts-angular';
import { OrgChartModule } from 'ng2-org-chart';
// import more from 'highcharts/highcharts-more.src';
import solidGauge from 'highcharts/modules/solid-gauge.src';
import { SewingmoduleComponent } from './sewingmodule/sewingmodule.component';
import{NgDatepickerModule} from 'ng2-datepicker';
import { EfficiencyComponent } from './efficiency/efficiency.component';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [solidGauge];
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ModuleperformanceComponent,
    SewingmoduleComponent,
    EfficiencyComponent
  ],
  imports: [
    BrowserModule, SharedModule, AppRoutingModule, FormsModule, HttpClientModule, 
    HighchartsChartModule,
    ChartModule,
    NgDatepickerModule,
    OrgChartModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } // add as factory to your providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
