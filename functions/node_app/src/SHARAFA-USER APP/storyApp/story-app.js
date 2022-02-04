const { storyRouter  } = require("./story-router")

module.exports.StoryApp = function (app) {
  app.use('/story', storyRouter)
}