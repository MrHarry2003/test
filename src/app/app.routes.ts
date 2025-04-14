import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  /** TODO: Make a canActivate gaurd whenever BE implements token flow */
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
]
