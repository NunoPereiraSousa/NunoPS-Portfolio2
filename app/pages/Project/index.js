import Page from "classes/Page";

export default class Project extends Page {
  constructor() {
    super({
      id: "project",
      element: ".project",
      elements: {
        navigation: document.querySelector(".navigation"),
        wrapper: ".project__wrapper"
      }
    });
  }

  create() {
    super.create();
  }
}
