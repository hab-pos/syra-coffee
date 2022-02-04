const { branchRouter  } = require("./Branch-router")

module.exports.BranchApp = function (app) {
  app.use('/branches', branchRouter)
}