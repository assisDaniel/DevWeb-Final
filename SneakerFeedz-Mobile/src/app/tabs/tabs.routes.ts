import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'criar',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('../editar-tenis/editar-tenis.page').then((m) => m.EditarTenisPage),
      },
      {
        path: 'deletar/:id',
        loadComponent: () =>
          import('../deletar-tenis/deletar-tenis.page').then((m) => m.DeletarTenisPage),
      },
      {
        path: '',
        redirectTo: '/tenis/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tenis/home',
    pathMatch: 'full',
  },
];
