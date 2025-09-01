import { Routes } from '@angular/router';
import { ChatComponent } from './views/chat/chat';
import { HomeComponent } from './views/home/home.component';
import { ConexaoComponent } from './views/conexao/conexao.component';

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
    path: 'chat',
    component: ChatComponent,
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
