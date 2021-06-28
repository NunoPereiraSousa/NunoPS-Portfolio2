import Component from "classes/Component";

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: ".navigation",
      elements: {
        links: ".navigation__link"
      }
    });

    this.onChange(template);
  }

  onChange(template) {
    console.log(template);
  }
}
