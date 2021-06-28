import Component from "classes/Component";
import GSAP from "gsap";

export default class Color extends Component {
  constructor({ template }) {
    super({
      element: ".about__link"
    });

    this.addEventListener();
  }

  addEventListener(template) {
    this.element.addEventListener("click", this.changeTheme());
  }

  changeTheme() {}
}
