import Page from "classes/Page";
import Button from "classes/Button";

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
