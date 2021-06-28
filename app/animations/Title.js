import Animation from "classes/Animation";
import GSAP from "gsap";

import { calculate, split } from "utils/text";

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    split({
      element: this.element,
      append: true
    });

    split({
      element: this.element,
      append: true
    });

    this.elementLinesSpans = this.element.querySelectorAll("span span");
  }

  animateIn() {
    GSAP.set(this.element, {
      autoAlpha: 1
    });

    GSAP.fromTo(
      this.elementLines,
      {
        y: "100%"
      },
      {
        autoAlpha: 1,
        duration: 1,
        stagger: 0.2,
        y: "0%"
      }
    );
  }

  animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0
    });
  }

  onResize() {
    this.elementLines = calculate(this.elementLinesSpans);
  }
}
