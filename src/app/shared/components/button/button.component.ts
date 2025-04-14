import { Component, input, output } from '@angular/core'
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'app-shared-button',
  imports: [ButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  /**
   * Label for the button
   */
  label = input('')
  /**
   * Pass this as true if the button is rounded
   */
  rounded = input(true)
  /**
   * Min-width of the button
   */
  minWidth = input('5%')
  /**
   * Height of the button
   */
  height = input('32px')
  /**
   * Loading for async processess
   */
  loading = input(false)
  /**
   * If the button is disabled or not
   */
  disabled = input(false)

  /**
   * onClick event-emitter when button is clicked
   */
  onClick = output<MouseEvent>()

  handleButtonClick(event: MouseEvent) {
    event.stopPropagation()
    this.onClick.emit(event)
  }
}
