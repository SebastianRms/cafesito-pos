import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guards/auth/auth.guard';
import { adminGuard } from './guards/auth/admin-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'pos',
        loadComponent: () =>
          import('./pages/pos/pos-page/pos-page.component').then(
            (m) => m.PosPageComponent,
          ),
      },
      {
        path: 'register',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/register/register-page/register-page.component').then(
            (m) => m.RegisterPageComponent,
          ),
      },
      {
        path: 'admin/inventory',
        loadComponent: () =>
          import('./pages/inventory/inventory/inventory.component').then(
            (m) => m.InventoryComponent,
          ),
        canActivate: [authGuard, adminGuard],
      },
      { path: '', redirectTo: 'pos', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
