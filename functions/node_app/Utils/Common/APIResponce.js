module.exports.apiResponse = function (req, res, next) {
const http = require('http')
const path = require('path')
const { I18n } = require('i18n')
 
const i18n = new I18n({
  locales: ['en', 'es'],
  directory: path.join(__dirname, 'locales')
})
 
  res.api = (status, message, data, success,maintanence = false) => {
    // status = __(status)
    // message = __(message)
    // success = __(data)
    // maintanence = __(maintanence)

    return res.status(200)
      .json({
        status,
        message,
        data,
        maintanence,
        success
      })
  }
  next()
}
