import GSAP from "gsap";

import Animation from "classes/Animation";

export default class Paragraph extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements
    });
  }

  animateIn() {
    this.timelineIn = GSAP.timeline();

    this.timelineIn.fromTo(
      this.element,
      {
        scaleX: 0
      },
      {
        duration: 1,
        delay: 0.2,
        scaleX: 1
      },
      0
    );
  }
}
