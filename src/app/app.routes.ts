import { Routes } from '@angular/router';
import { FornecedorComponent } from './component/fornecedor-component/fornecedor-component';
import { DashboardComponent } from './component/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'fornecedores',
        component: FornecedorComponent
    }
];