import Component from "classes/Component";
import each from "lodash/each";
import GSAP from "gsap";
import { split } from "utils/text";

export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__name",
        label: ".preloader__title",
        graphics: document.querySelectorAll(".stars"),
        images: document.querySelectorAll("img")
      }
    });

    split({
      element: this.elements.title,
      append: true
    });

    split({
      element: this.elements.title,
      append: true
    });

    this.elements.titleSpans =
      this.elements.title.querySelectorAll("span span");

    this.length = 0;

    this.onCounterLoaded();
  }

  createLoader() {
    // each(this.elements.images, element => {
    //   const image = new Image();
    //   image.onload = _ => this.onAssetLoaded(image);
    //   image.src = element.getAttribute("data-src");
    // });
  }

  // onAssetLoaded(image) {
  //   this.length += 1;

  //   const percent = this.length / this.elements.images.length;

  //   this.elements.label.innerHTML = `${Math.round(percent * 100)}%`;

  //   if (percent === 1) {
  //     this.onLoaded();
  //   }
  // }

  /**
   * Loading animation increment
   */
  onCounterLoaded() {
    let percent = this.length;

    // this.beforeLoaded();

    setTimeout(() => {
      this.onLoaded();
    }, 1); // 2000
  }

  /**
   * Preloader animations
   * @returns a Promise
   */
  onLoaded() {
    return new Promise(resolve => {
      this.animateOut = GSAP.timeline();

      // this.animateOut.to(this.elements.titleSpans, {
      //   y: "100%",
      //   duration: 1,
      //   stagger: 0.12,
      //   ease: "expo.in"
      // });

      // each(this.elements.graphics, svg => {
      //   this.animateOut.to(
      //     svg,
      //     {
      //       autoAlpha: 0,
      //       filter: "blur(10px)",
      //       duration: 0.8,
      //       stagger: 0.05,
      //       ease: "expo.out"
      //     },
      //     "-=0.75"
      //   );
      // });

      // this.animateOut.to(this.elements.label, {
      //   autoAlpha: 0,
      //   filter: "blur(10px)",
      //   duration: 0.8,
      //   ease: "expo.out"
      // });

      // this.animateOut.to(
      //   this.element,
      //   {
      //     scaleY: 0,
      //     transformOrigin: "0% 0%",
      //     ease: "expo.out",
      //     duration: 1.5,
      //     delay: 1
      //   },
      //   "-=0.9"
      // );

      this.animateOut.call(_ => {
        this.emit("completed");
      });
    });
  }

  beforeLoaded() {
    return new Promise(resolve => {
      this.animateIn = GSAP.timeline({
        duration: 0.5
      });

      // this.animateIn.fromTo(
      //   this.elements.title,
      //   {
      //     autoAlpha: 0,
      //     filter: "blur(10px)"
      //   },
      //   {
      //     autoAlpha: 1,
      //     filter: "blur(0)",
      //     ease: "expo.out"
      //   }
      // );

      this.animateIn.fromTo(
        this.elements.titleSpans,
        {
          y: "100%"
        },
        {
          y: "0%",
          duration: 2,
          stagger: 0.18,
          ease: "expo.out"
        }
      );

      each(this.elements.graphics, svg => {
        this.animateIn.fromTo(
          svg,
          {
            autoAlpha: 0,
            filter: "blur(10px)"
          },
          {
            autoAlpha: 1,
            filter: "blur(0)",
            ease: "expo.out"
          }
        );
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
