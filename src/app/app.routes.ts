import { Routes } from '@angular/router';
import { ConexaoComponent } from './views/core/conexao/conexao.component';
import { HomeComponent } from './views/core/home/home.component';

export const routes: Routes = [
  {
    path: '', // rota padrão
    redirectTo: 'home',
    pathMatch: 'full', // ⚠ obrigatório para redirecionamentos na raiz
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'conexao',
    component: ConexaoComponent,
  },
  {
    path: '**', // rota para páginas não encontradas
    redirectTo: 'chat',
  },
];
