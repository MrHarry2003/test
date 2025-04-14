import { provideHttpClient, withFetch } from '@angular/common/http'
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
import Aura from '@primeng/themes/aura'
import { providePrimeNG } from 'primeng/config'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
}
