import Page from "classes/Page";
import Button from "classes/Button";

export default class About extends Page {
  constructor() {
    super({
      // passing the id to the parent Class (Page.js)
      id: "about",
      element: ".about",
      elements: {
        navigation: document.querySelector(".navigation"),
        title: ".about__intro__title",
        wrapper: ".about__wrapper",
        button: ".home__link"
      }
    });
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.button
    });
  }
}
