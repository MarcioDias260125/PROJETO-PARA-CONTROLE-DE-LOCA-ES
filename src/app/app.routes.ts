import { Routes } from '@angular/router';
import { FornecedorComponent } from './component/fornecedor-component/fornecedor-component';
import { DashboardComponent } from './component/dashboard/dashboard';
import { LocacaoFormComponent } from './locacao-form/locacao-form';
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
    },
    {
    path: 'nova-locacao',
    component: LocacaoFormComponent
},
// Adicione esta linha junto com as outras rotas que você já tem:
{ path: 'editar-locacao/:id', component: LocacaoFormComponent },
];