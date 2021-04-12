import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { LoginModule } from './login/login.module';
import {RegisterModule} from './register/register.module'
import { ModuleperformanceComponent } from './moduleperformance/moduleperformance.component';
import {SewingmoduleComponent} from './sewingmodule/sewingmodule.component';
import { EfficiencyComponent } from './efficiency/efficiency.component';
import {ModuleperformancehistComponent} from './moduleperformancehist/moduleperformancehist.component';
import{OperatorRecommendationComponent} from './operator-recommendation/operator-recommendation.component';
import{SewingmodulehistComponent} from './sewingmodulehist/sewingmodulehist.component';
import {DefectComponent} from './defect/defect.component';
import {CapacityutilizationComponent} from './capacityutilization/capacityutilization.component';
import {AbsentismComponent} from './absentism/absentism.component';
import { ProcessOverviewComponent } from './process-overview/process-overview.component';
import {RejectionComponent} from './rejection/rejection.component';
import {DhuComponent} from './dhu/dhu.component';
import {DhuhistComponent} from './dhuhist/dhuhist.component';
import {MachinedowntimeComponent} from './machinedowntime/machinedowntime.component';
import {MachinedowntimehistComponent} from './machinedowntimehist/machinedowntimehist.component';
import {MachinedowntimecurvefitComponent} from './machinedowntimecurvefit/machinedowntimecurvefit.component';
import {InlinewipComponent} from './inlinewip/inlinewip.component';
import {InlinewipsummaryComponent} from './inlinewipsummary/inlinewipsummary.component';
import {InlinewipoperatorComponent} from './inlinewipoperator/inlinewipoperator.component';
import {OperatordefecteffComponent} from './operatordefecteff/operatordefecteff.component';

const routes: Routes = [ 
    {path:"login", component:LoginComponent}, 
    {path:"register", component:RegisterComponent}, 
    {path: '',   redirectTo: '/login', pathMatch: 'full' },
    {path:'module-performance', component:ModuleperformanceComponent},
    {path:'sewing-module', component:SewingmoduleComponent},
    {path:'efficiency-overview', component: EfficiencyComponent},
    {path:'operator-recommendation', component: OperatorRecommendationComponent},
    {path:'module-historical', component: ModuleperformancehistComponent},
    {path:'sewing-historical', component: SewingmodulehistComponent},
    {path:'defect-overview', component: DefectComponent},
    {path:'capacity-utilization-overview', component: CapacityutilizationComponent},
    {path:'absentism-overview', component: AbsentismComponent},
    {path:'process-overview', component: ProcessOverviewComponent},
    {path:'rejection-overview', component: RejectionComponent},
    {path:'dhu-overview', component:DhuComponent},
    {path:'dhu-historic', component:DhuhistComponent},
    {path:'downtime-overview', component: MachinedowntimeComponent},
    {path:'downtime-historic', component: MachinedowntimehistComponent},
    {path:'downtime-curvefit', component: MachinedowntimecurvefitComponent},
    {path:'wip-overview', component: InlinewipComponent},
    {path:'wip-summary', component: InlinewipsummaryComponent},
    {path:'wip-operator', component: InlinewipoperatorComponent},
    {path:'operator-eff-defect', component: OperatordefecteffComponent}
 ];
@NgModule({ 
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [RouterModule] 
}) 
export class AppRoutingModule { } export const
RoutingComponent = [
   LoginModule, 
   RegisterModule, 
   ModuleperformanceComponent, 
   SewingmoduleComponent, 
   OperatorRecommendationComponent, 
   ModuleperformancehistComponent
];