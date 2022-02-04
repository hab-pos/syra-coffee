const { SettingsModel } = require('./Settings-model')

class SettingsRepository {
    add_settings(code, value) {
        return SettingsModel.create({
            code: code,
            value: value
        })
    }

    isUniqueCode(code) {
        return SettingsModel.findOne({ where: { code: code } })
    }

    getAllSettings(id) {
        return id ? SettingsModel.findOne({where : { _id : id }}) : SettingsModel.findAll()
    }

    deleteSettings(id) {
        return SettingsModel.destroy({
            where: {
                "_id": id
            }
        })
    }
    
    update_settings(id, value) {
        return SettingsModel.update({ value: value }, {
            where: {
                "_id" : id
            }
        })
    }
    update_logo(value){
        return SettingsModel.update({ value: value }, {
            where: {
                "code" : 'logo'
            }
        })
    }
    get_logo(){
        return SettingsModel.findOne({where : { code : 'logo' }})
    }
}

module.exports.settingsRepository = new SettingsRepository()