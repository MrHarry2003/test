import { Directive, HostListener, Input } from '@angular/core'
import { NgControl } from '@angular/forms'

@Directive({
  selector: '[appPhoneNumber]',
})
export class PhoneNumberDirective {
  @Input() appPhoneNumber = true // Conditional flag to enable/disable the directive

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.appPhoneNumber) return // Skip if directive is not active

    const input = event.target as HTMLInputElement
    const value = input.value.replace(/\D/g, '') // Remove non-digit characters
    const formattedValue = this.formatPhoneNumber(value)

    if (this.control.control) {
      this.control.control.setValue(formattedValue, { emitEvent: false })
    }
  }

  private formatPhoneNumber(value: string): string {
    return value
  }
}
