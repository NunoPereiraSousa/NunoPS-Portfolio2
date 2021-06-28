import each from "lodash/each";
import EventEmitter from "events";
import GSAP from "gsap";

export default class Component extends EventEmitter {
  constructor({ element, elements }) {
    super();

    this.selector = element;
    this.selectorChildren = { ...elements };

    this.create();

    this.addEventListeners();
  }

  /**
   * Query selector everything I have on the page
   */
  create() {
    if (
      this.selector instanceof window.HTMLElement ||
      this.selector instanceof window.SVGSVGElement
    ) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });
  }

  addEventListeners() {}

  removeEventListeners() {}
}
