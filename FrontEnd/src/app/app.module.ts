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
import solidGauge from 'highcharts/modules/solid-gauge.src';
import { SewingmoduleComponent } from './sewingmodule/sewingmodule.component';
import{NgDatepickerModule} from 'ng2-datepicker';
import { EfficiencyComponent } from './efficiency/efficiency.component';
import { OperatorRecommendationComponent } from './operator-recommendation/operator-recommendation.component';
import { DataTableModule } from "ng2-data-table";
import { ModuleperformancehistComponent } from './moduleperformancehist/moduleperformancehist.component';
import { SewingmodulehistComponent } from './sewingmodulehist/sewingmodulehist.component';
import { AbsentismComponent } from './absentism/absentism.component';
import { DefectComponent } from './defect/defect.component';
import { CapacityutilizationComponent } from './capacityutilization/capacityutilization.component';
import { MultiskillComponent } from './multiskill/multiskill.component';
import { RejectionComponent } from './rejection/rejection.component';
import { DhuComponent } from './dhu/dhu.component';
import { DhuhistComponent } from './dhuhist/dhuhist.component';
import { MachinedowntimeComponent } from './machinedowntime/machinedowntime.component';
import { MachinedowntimecurvefitComponent } from './machinedowntimecurvefit/machinedowntimecurvefit.component';
import { MachinedowntimehistComponent } from './machinedowntimehist/machinedowntimehist.component';
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
    EfficiencyComponent,
    OperatorRecommendationComponent,
    ModuleperformancehistComponent,
    SewingmodulehistComponent,
    AbsentismComponent,
    DefectComponent,
    CapacityutilizationComponent,
    MultiskillComponent,
    RejectionComponent,
    DhuComponent,
    DhuhistComponent,
    MachinedowntimeComponent,
    MachinedowntimecurvefitComponent,
    MachinedowntimehistComponent
  ],
  imports: [
    BrowserModule, SharedModule, AppRoutingModule, FormsModule, HttpClientModule, 
    DataTableModule,
    HighchartsChartModule,
    ChartModule,
    NgDatepickerModule,
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } // add as factory to your providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
