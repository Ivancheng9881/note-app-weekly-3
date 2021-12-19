const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const path = require("path");

require("dotenv").config();
const config = require("./config.json").development;

const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

const viewsPath = path.join(__dirname, "./views");
const AuthChallenger = require("./AuthChallenger");
const NoteService = require("./NoteService/NoteService");
const NoteRouter = require("./NoteRouter/NoteRouter");

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", viewsPath);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  basicAuth({
    authorizeAsync: true,
    authorizer: AuthChallenger(knex),
    challenge: true,
    realm: "Note taking with knex",
  })
);

const noteService = new NoteService(knex);

//Homepage
app.get("/", async (req, res) => {
  let data = await noteService.list(req.auth.user);

  let arr = data.map((x) => x.content);
  console.log(arr);

  res.render("index", {
    user: req.auth.user,
    notes: Array,
  });
});

//Log out for basic auth -- return 401 error and redirect page
app.get("/loguut", (req, res) => {
  console.log("logging out");
  res.status(401).render("logOut");
});

app.use("/api/notes/", new NoteRouter(noteService).router());

app.listen(config.port, () =>
  console.log(`App listening to port ${config.port}`)
);

module.exports.app = app;
