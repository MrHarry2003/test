import { Component, computed, input } from '@angular/core'
import { AbstractControl, ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DEFAULT_FORM_SETTINGS } from './constants/form-default.const'
import { FormSettings } from './types/form.type'

@Component({
  imports: [ReactiveFormsModule],
  template: '',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  /**
   * ControlName of formControl provided here
   */
  controlName = input('')
  /**
   * Label of the corresponding control
   */
  label = input()
  /**
   * Pass this as true if you want the default label space when passing no label
   */
  isEmptyLabel = input(false)
  /**
   * Loading is the state of data which is linked to form being loaded
   */
  loading = input(false)
  /**
   * Props which is used to set basic configurations
   */
  props = input<FormSettings>(DEFAULT_FORM_SETTINGS)

  /**
   * Reference to parent's form
   */
  parentForm!: FormGroup
  /**
   * Reference to self's form-control
   */
  inputControl!: AbstractControl | undefined | null

  _props = computed(() => ({ ...DEFAULT_FORM_SETTINGS, ...this.props() }))

  constructor(protected controlContainer: ControlContainer) {}

  /**
   * Doing all the necessary Configurations in the initialization of the component
   */
  ngOnInit() {
    this.initForm()
  }

  /**
   * Assigning the basic values and references here
   */
  initForm() {
    this.parentForm = this.controlContainer.control as FormGroup
    this.inputControl = this.controlContainer.control?.get(this.controlName())
  }
}
