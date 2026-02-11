import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guards/auth/auth.guard';
import { adminGuard } from './guards/auth/admin-guard.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard], // 1. Primero: ¿Estás logueado?
    children: [
      {
        path: 'pos',
        loadComponent: () => import('./pages/pos/pos-page/pos-page.component').then(m => m.PosPageComponent)
      },
      // 🔐 RUTA PROTEGIDA POR ROL
      {
        path: 'register',
        canActivate: [adminGuard], // 2. Segundo: ¿Eres admin?
        loadComponent: () => import('./pages/register/register-page/register-page.component').then(m => m.RegisterPageComponent)
      },
      { path: '', redirectTo: 'pos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];