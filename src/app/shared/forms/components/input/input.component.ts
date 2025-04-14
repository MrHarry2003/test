import { NgStyle } from '@angular/common'
import { Component, input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { PhoneNumberDirective } from '@entities/directives'
import { FormComponent } from '@shared/forms/form.component'
import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'app-shared-input',
  imports: [InputTextModule, ReactiveFormsModule, NgStyle, PhoneNumberDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent extends FormComponent {
  enablePhoneValidation = input(false)
}
