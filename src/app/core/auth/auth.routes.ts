import { Routes } from '@angular/router'
import { AuthMainComponent } from './auth-main.component'
import { LoginPageLayoutComponent } from './components/login-page-layout/login-page-layout.component'

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthMainComponent,
    children: [
      {
        path: '',
        component: LoginPageLayoutComponent,
      },
      {
        path: 'login',
        component: LoginPageLayoutComponent,
      },
    ],
  },
]
