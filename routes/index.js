const comment = require("../controller/comment");
const post = require("../controller/post");
const search = require("../controller/search");
const story = require("../controller/story");
const suggestion = require("../controller/suggestion");
const user = require("../controller/user");
const like = require("../controller/like");

const message = require("../controller/message");

const importDataRouter = require("../dataraw/mockdata.js");

module.exports = (app) => {
  app.use("/api/comment", comment);
  app.use("/api/post", post);
  app.use("/api/search", search);
  app.use("/api/story", story);
  app.use("/api/suggestion", suggestion);
  app.use("/api/user", user);
  app.use("/api/like", like);
  app.use("/api/msg", message);
  app.use("/import", importDataRouter);
};
