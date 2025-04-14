import { isPlatformBrowser } from '@angular/common'
import { Component, Inject, PLATFORM_ID } from '@angular/core'
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { AuthService } from '@core/auth/services/auth.service'
import { ButtonComponent } from '@shared/components'
import { InputComponent } from '@shared/forms/components'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-login-page-layout',
  imports: [InputComponent, ReactiveFormsModule, ButtonComponent],
  providers: [AuthService],
  templateUrl: './login-page-layout.component.html',
  styleUrl: './login-page-layout.component.scss',
})
export class LoginPageLayoutComponent {
  /** Form here */
  loginForm = this.fb.group({ name: [''], password: [''] })

  /** Other class members and vars */
  layoutImageSrc!: string

  private $subscription = new Subscription()

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Record<string, unknown>,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.getSideBarImage()
    this.layoutImageSrc = 'https://frontend.flydocstest.com/assets/images/login-template-BG.png'
  }

  getSideBarImage() {
    const domain = window?.location.host
    this.$subscription.add(
      this.authService.getSideBarImg(domain).subscribe((res) => {
        this.layoutImageSrc = res?.data?.sideBarImage || ''
      }),
    )
  }

  handleLoginSubmit() {}

  ngOnDestroy() {
    this.$subscription.unsubscribe()
  }
}
