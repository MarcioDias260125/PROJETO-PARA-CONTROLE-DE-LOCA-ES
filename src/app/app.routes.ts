import { Routes } from '@angular/router';
import { FornecedorComponent } from './component/fornecedor-component/fornecedor-component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'fornecedores',
        pathMatch: 'full'
    },
    {
        path: 'fornecedores',
        component: FornecedorComponent
    }
];