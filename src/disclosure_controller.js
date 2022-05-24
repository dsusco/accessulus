import { Controller } from '@hotwired/stimulus'
import animateCSS from '/src/animate-css'

// Connects to data-controller="disclosure"
export default class extends Controller {
  static id = 0
  static targets = ['trigger', 'content']
  static values = {
    hidden: { type: Boolean, default: true },
    hidingClass: { type: String, default: 'hiding' },
    hidingTriggerClass: { type: String, default: 'content-hiding' },
    hidingAnimationClass: { type: String, default: '' },
    hiddenClass: { type: String, default: 'hidden' },
    hiddenTriggerClass: { type: String, default: 'content-hidden' },
    showingClass: { type: String, default: 'showing' },
    showingTriggerClass: { type: String, default: 'content-showing' },
    showingAnimationClass: { type: String, default: '' },
    shownClass: { type: String, default: 'shown' },
    shownTriggerClass: { type: String, default: 'content-shown' }
  }

  connect () {
    // add an ID to the content if it doesn't have one
    if (!this.contentTarget.hasAttribute('id')) {
      this.constructor.id += 1
      this.contentTarget.setAttribute('id', `disclosure_${this.constructor.id}`)
    }
    // set the trigger's aria-controls to the content's ID
    this.triggerTarget.setAttribute('aria-controls', this.contentTarget.getAttribute('id'))

    // use these options for all dispatched events
    this.eventOptions = {
      bubbles: true,
      cancelable: true,
      detail: {
        disclosureContent: this.contentTarget,
        disclosureTrigger: this.triggerTarget,
        originalEvent: undefined
      }
    }

    // show/hide the content, and set appropriate classes and attributes based on hidden value
    if (this.hiddenValue) {
      this.contentTarget.setAttribute('hidden', '')
      this.triggerTarget.setAttribute('aria-expanded', false)

      this.#setClass(this.contentTarget, 'hiddenClassValue')
      this.#setClass(this.triggerTarget, 'hiddenTriggerClassValue')
    } else {
      this.contentTarget.removeAttribute('hidden')
      this.triggerTarget.setAttribute('aria-expanded', true)

      this.#setClass(this.contentTarget, 'shownClassValue')
      this.#setClass(this.triggerTarget, 'shownTriggerClassValue')
    }
  }

  hide (event) {
    this.#dispatchEvent('hiding', event)

    this.#setClass(this.contentTarget, 'hidingClassValue')
    this.#setClass(this.triggerTarget, 'hidingTriggerClassValue')

    animateCSS(this.contentTarget, this.hidingAnimationClassValue).finally(() => {
      this.contentTarget.setAttribute('hidden', '')
      this.triggerTarget.setAttribute('aria-expanded', false)

      this.#setClass(this.contentTarget, 'hiddenClassValue')
      this.#setClass(this.triggerTarget, 'hiddenTriggerClassValue')

      this.#dispatchEvent('hidden', event)
    })
  }

  show (event) {
    this.#dispatchEvent('showing', event)

    this.#setClass(this.contentTarget, 'showingClassValue')
    this.#setClass(this.triggerTarget, 'showingTriggerClassValue')

    this.contentTarget.removeAttribute('hidden')
    this.triggerTarget.setAttribute('aria-expanded', true)

    animateCSS(this.contentTarget, this.showingAnimationClassValue).finally(() => {
      this.#setClass(this.contentTarget, 'shownClassValue')
      this.#setClass(this.triggerTarget, 'shownTriggerClassValue')

      this.#dispatchEvent('shown', event)
    })
  }

  toggle (event) {
    this.contentTarget.hasAttribute('hidden') ? this.show(event) : this.hide(event)
  }

  #dispatchEvent (type, event) {
    this.eventOptions.detail.originalEvent = event
    this.contentTarget.dispatchEvent(new CustomEvent(type, this.eventOptions))
  }

  #setClass (element, value) {
    element.classList.remove(
      this.hidingClassValue,
      this.hidingTriggerClassValue,
      this.hiddenClassValue,
      this.hiddenTriggerClassValue,
      this.showingClassValue,
      this.showingTriggerClassValue,
      this.shownClassValue,
      this.shownTriggerClassValue
    )
    element.classList.add(this[value])
  }
}
