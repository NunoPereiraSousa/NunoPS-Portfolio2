import Component from "classes/Component";
import GSAP from "gsap";
import each from "lodash/each";

export default class Carousel extends Component {
  constructor() {
    super({
      elements: {
        myselfWrapper: ".home__myself__carousel__items",
        myself: document.querySelectorAll(".title")
      }
    });

    // this.rolling();
  }

  rolling() {
    this.animate = GSAP.timeline();

    each(this.elements.myself, entry => {
      let width = this.elements.myselfWrapper.getBoundingClientRect().width;

      let childWidth = entry.getBoundingClientRect().width;

      let initial_offset = ((2 * childWidth) / width) * 100 * -1;

      GSAP.set(this.elements.myselfWrapper, {
        xPercent: `${initial_offset}`
      });

      let duration = 5;

      this.animate.to(this.elements.myselfWrapper, {
        ease: "none",
        duration: duration,
        xPercent: 0,
        repeat: -1
      });
    });
  }
}
