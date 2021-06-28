import each from "lodash/each";
import map from "lodash/map";

import GSAP from "gsap";
import NormalizeWheel from "normalize-wheel";
import Prefix from "prefix";
import Line from "animations/Line";
import Title from "animations/Title";
import Paragraph from "animations/Paragraph";

/**
 * this.selector: parent element (.home, .about)
 * this.selectorChildren: children elements (.home__title, .about__title, ...)
 */
export default class Page {
  constructor({ id, element, elements }) {
    this.id = id;

    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: "[data-animation='title']",
      animationsParagraphs: "[data-animation='paragraph']",
      animationsLines: "[data-animation='line']"
    };

    this.onMouseWheelEvent = this.onMouseWheel.bind(this);
    this.transformPrefix = Prefix("transform");
  }

  /**
   * Query selector everything I have on the page
   */
  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      // first position
      current: 0,
      // where the mouse goes to
      target: 0,
      // last position
      last: 0,
      limit: 0
    };

    let currentColor = JSON.parse(localStorage.getItem("color"));

    GSAP.to("body", {
      backgroundColor: currentColor
    });

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

    this.createAnimations();
  }

  createAnimations() {
    this.animations = [];

    this.animationsTitles = map(this.elements.animationsTitles, element => {
      return new Title({
        element
      });
    });

    this.animations.push(...this.animationsTitles);

    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      element => {
        return new Paragraph({
          element
        });
      }
    );

    this.animations.push(...this.animationsParagraphs);

    this.animationsLines = map(this.elements.animationsLines, element => {
      return new Line({
        element
      });
    });

    this.animations.push(...this.animationsParagraphs);
  }

  /**
   * Default animate-in function for all the pages
   */
  show() {
    return new Promise(resolve => {
      this.animateIn = GSAP.timeline();

      // this.animateIn.fromTo(
      //   this.element,
      //   {
      //     autoAlpha: 0
      //   },
      //   {
      //     autoAlpha: 1
      //   }
      // );

      this.animateIn.call(_ => {
        this.addEventListeners();

        resolve();
      });
    });
  }

  /**
   * Default animate-out function for all the pages
   */
  hide() {
    return new Promise(resolve => {
      this.removeEventListeners();

      this.animateOut = GSAP.timeline();

      this.animateOut.to(this.element, {
        duration: 0.2,
        autoAlpha: 0,
        onComplete: resolve
      });
    });
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, animation => animation.onResize());
  }

  onMouseWheel(event) {
    const { pixelY } = NormalizeWheel(event);

    this.scroll.target += pixelY;
  }

  update() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.04
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseWheelEvent);
  }

  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMouseWheelEvent);
  }
}
