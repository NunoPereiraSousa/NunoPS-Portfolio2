import each from "lodash/each";
import About from "pages/About";
import Home from "pages/Home";
import Preloader from "components/Preloader";
import Carousel from "components/Carousel";
import Navigation from "components/Navigation";

class App {
  constructor() {
    this.createContent();

    this.createPreloader();
    this.createNavigation();
    this.createPages();

    // this.createCarousel();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template
    });
  }

  /**
   * Function that instantiates the Preloader
   * Fires the preloader function once it's completed
   */
  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createCarousel() {
    this.carousel = new Carousel();
  }

  /**
   * Set up the page content and template
   */
  createContent() {
    // get the current ".content" element
    this.content = document.querySelector(".content");

    // get the current template based on the page I am in
    this.template = this.content.getAttribute("data-template");
  }

  /**
   * Creates the pages. Instantiates its Classes
   */
  createPages() {
    this.pages = {
      about: new About(),
      home: new Home()
    };

    // get the current page = Class I'm on -> this.pages["about"] or this.pages["home"]
    this.page = this.pages[this.template];

    this.page.create();

    this.page.show();
  }

  /**
   * Preloader animation
   */
  onPreloaded() {
    this.preloader.destroy();

    this.onResize();

    this.page.show();
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }

    window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  /**
   * Function that looks for all links and renders the page that is going to be loaded
   * href: is the link of the next page
   */
  addLinkListeners() {
    const links = document.querySelectorAll(".navigation__link");

    each(links, link => {
      link.onclick = event => {
        event.preventDefault();

        const { href } = link;

        this.onChange(href);
      };
    });
  }

  /**
   * Function that receive the url of the page that needs to be loaded
   * Receives the content of the next page without jumping into the next page
   * Append the content to a new div
   * Change the current content (.home or .about) to the next element (.about or .home)
   * @param {String} url is the link of the next page
   */
  async onChange(url) {
    // Animate-out the current page
    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();

      const div = document.createElement("div");
      div.innerHTML = html;

      const divContent = div.querySelector(".content");

      this.template = divContent.getAttribute("data-template");

      // call navigation onChange (check for current template and link)
      this.navigation.onChange(this.template);

      this.content.setAttribute("data-template", this.template);
      // change the current content
      this.content.innerHTML = divContent.innerHTML;

      this.page = this.pages[this.template];

      this.page.create();
      this.onResize();
      this.page.show();

      this.addLinkListeners();
    } else {
      console.log("ERROR");
    }
  }
}

new App();
