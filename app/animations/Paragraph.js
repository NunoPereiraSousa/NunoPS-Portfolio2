import GSAP from "gsap";

import Animation from "classes/Animation";
import { calculate, split } from "utils/text";
import each from "lodash/each";

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements
    });

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
    this.timelineIn = GSAP.timeline({
      delay: 0.3
    });

    GSAP.set(this.element, {
      autoAlpha: 1
    });

    each(this.elementLines, (line, index) => {
      this.timelineIn.fromTo(
        line,
        {
          y: "100%"
        },
        {
          duration: 1,
          delay: index * 0.2,
          y: "0%"
        },
        0
      );
    });
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
