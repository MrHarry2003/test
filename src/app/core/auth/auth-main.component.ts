import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-auth-main',
  imports: [RouterOutlet],
  template: `
    <router-outlet />
  `,
})
export class AuthMainComponent {}
