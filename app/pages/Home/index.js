import Page from "classes/Page";
import Button from "classes/Button";
import GSAP from "gsap";

export default class Home extends Page {
  constructor() {
    super({
      // passing the id to the parent Class (Page.js)
      id: "home",
      element: ".home",
      elements: {
        navigation: document.querySelector(".navigation"),
        title: ".home__title",
        wrapper: ".home__wrapper",
        button: ".home__link",
        canvas: ".webgl"
      }
    });
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.button
    });

    // this.title = new Slider();

    this.myselfCarousel();
    this.worksCarousel();
  }

  myselfCarousel() {
    let spans = document.querySelectorAll(".spans");

    let containerWidth = document
      .querySelector(".home__myself__title")
      .getBoundingClientRect().width;

    let titleWidth = spans[0].getBoundingClientRect().width;

    let initial_offset = ((2 * titleWidth) / containerWidth) * 100 * -1;

    GSAP.set(".home__myself__title", {
      xPercent: `${initial_offset}`
    });

    this.animate = GSAP.timeline();

    this.animate.to(".home__myself__title", {
      xPercent: 0,
      duration: 8,
      repeat: -1,
      ease: "none"
    });
  }

  worksCarousel() {
    let spans = document.querySelectorAll(".work__spans");

    let containerWidth = document
      .querySelector(".home__works__title")
      .getBoundingClientRect().width;

    let titleWidth = spans[0].getBoundingClientRect().width;

    let initial_offset = ((2 * titleWidth) / containerWidth) * 100 * -1;

    GSAP.set(".home__works__title", {
      xPercent: `${initial_offset}`
    });

    this.animate = GSAP.timeline();

    this.animate.to(".home__works__title", {
      xPercent: 0,
      duration: 8,
      repeat: -1,
      ease: "none"
    });
  }
}
