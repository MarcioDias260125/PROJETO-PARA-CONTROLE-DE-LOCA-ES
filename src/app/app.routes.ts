import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard';
import { FornecedorComponent } from './component/fornecedor-component/fornecedor-component';
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
  {
    path: 'editar-locacao/:id',
    component: LocacaoFormComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];