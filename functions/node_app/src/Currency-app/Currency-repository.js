const { CurrencyModel } = require('./Currency-model')

class CurrencyRepository {
    add_currency(code,symbol) {
        return CurrencyModel.create({
            code: code,
            symbol: symbol
        })
    }

    isUniqueCode(code) {
        return CurrencyModel.findOne({ where: { code: code } })
    }

    getAllCurrencies(id) {
        return id ? CurrencyModel.findOne({where : { _id : id }}) : CurrencyModel.findAll()
    }

    deleteCurrency(id) {
        return CurrencyModel.destroy({
            where: {
                "_id": id
            }
        })
    }
    
    update_currency(id, query) {
        return CurrencyModel.update( query, {
            where: {
                "_id" : id
            }
        })
    }
}

module.exports.currencyRepository = new CurrencyRepository()