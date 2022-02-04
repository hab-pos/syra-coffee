"use strict";

var _require = require("./story-router"),
    storyRouter = _require.storyRouter;

module.exports.StoryApp = function (app) {
  app.use('/story', storyRouter);
};