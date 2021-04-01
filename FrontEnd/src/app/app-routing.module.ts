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
import {OperatorRecommendationComponent} from './operator-recommendation/operator-recommendation.component';
import {SewingmodulehistComponent} from './sewingmodulehist/sewingmodulehist.component';
import {DefectComponent} from './defect/defect.component';
import {CapacityutilizationComponent} from './capacityutilization/capacityutilization.component';
import {AbsentismComponent} from './absentism/absentism.component';
import {MultiskillComponent} from './multiskill/multiskill.component';
import {RejectionComponent} from './rejection/rejection.component';
import {DhuComponent} from './dhu/dhu.component';


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
    {path:'defect-overview',component:DefectComponent},
    {path:'capacityutilization-overview', component:CapacityutilizationComponent},
    {path:'absentism-overview', component: AbsentismComponent},
    {path:'mutiskill-overview', component: MultiskillComponent},
    {path:'rejection-overview', component: RejectionComponent},
    {path:'dhu-overview', component:DhuComponent},
    {path:'dhu-historic', component:DhuComponent}

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
   ModuleperformancehistComponent,
   SewingmodulehistComponent,
   CapacityutilizationComponent,
   AbsentismComponent
];