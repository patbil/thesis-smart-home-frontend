import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/guard/auth.guard";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ReportsComponent } from "./components/reports/reports.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        component: DashboardComponent
    },
    {
        path: 'reports',
        canActivate: [AuthGuard],
        component: ReportsComponent
    },
    {
        path: 'users',
        canActivate: [AuthGuard],
        loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule)
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule { }