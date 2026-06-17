import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tenis',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'editar-tenis',
    loadComponent: () => import('./editar-tenis/editar-tenis.page').then( m => m.EditarTenisPage)
  },
  {
    path: 'deletar-tenis',
    loadComponent: () => import('./deletar-tenis/deletar-tenis.page').then( m => m.DeletarTenisPage)
  },
];
