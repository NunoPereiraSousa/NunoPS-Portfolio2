require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("errorhandler");
const app = express();
const path = require("path");
const port = 3000;
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const logger = require("morgan");

const Prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");
const { query } = require("express");

app.use(cors());
app.use(logger("dev"));
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req
  });
};

const handleLinkResolver = doc => {
  if (doc.type === "about") return "/about";

  return "/";
};

app.use((req, res, next) => {
  res.locals.Link = handleLinkResolver;
  res.locals.PrismicDOM = PrismicDOM;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const handleRequest = async api => {
  const footer = await api.getSingle("footer");
  const meta = await api.getSingle("meta");
  const navigation = await api.getSingle("navigation");
  const preloader = await api.getSingle("preloader");

  return {
    footer,
    meta,
    navigation,
    preloader
  };
};

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const home = await api.getSingle("home");

  // console.log(home.data.body);

  home.data.body.forEach(el => {
    console.log(el.items);
  });

  res.render("pages/home", {
    home,
    ...defaults
  });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);
  const about = await api.getSingle("about");
  const defaults = await handleRequest(api);

  res.render("pages/about", {
    about,
    ...defaults
  });
});

app.get("/project/:uid", async (req, res) => {
  let uid = req.params.uid;

  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const project = await api.getByUID("project", uid, {
    fetchLinks: "project.works.project"
  });

  console.log(project.data);

  res.render("pages/project", {
    project,
    ...defaults
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
