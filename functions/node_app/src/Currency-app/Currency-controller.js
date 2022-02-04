const {currencyRepository} = require('./Currency-repository')

module.exports.add_currency = async function (req, res, _) {
    const {code, symbol} = req.body
    currencyRepository.add_currency(code,symbol).then(currency => {
        res.api(200,"Your preference saved",{currency},true)
    })
}

module.exports.get_currencies = async function(req,res,_){
    const {id} = req.body
    currencyRepository.getAllCurrencies(id).then(currency_list => {
        res.api(200,"currencies retrived successfully",{currency_list},true)
    })
}

module.exports.update_currency = async function(req, res, _){
    const {id,code,symbol} = req.body

    var query = (code != null && code != undefined && symbol != null && symbol != undefined) ?
    {"code" : code,"symbol" : symbol} : (code != null && code != undefined) ? {"code" : code} : {"symbol" : symbol}

    currencyRepository.update_currency(id,query).then(update_success => {
        (update_success[0] > 0) ? res.api(200,"currency updated successfully",null,true) :  res.api(404,"No currency found",null,false)
    })
}

module.exports.delete_currency = async function(req, res, _){
    const {id} = req.body
    currencyRepository.deleteCurrency(id).then(delete_count => {
        delete_count > 0 ? res.api(200,"currency deleted successfully",null,true) :  res.api(404,"No currency found",null,false)
    })
}
