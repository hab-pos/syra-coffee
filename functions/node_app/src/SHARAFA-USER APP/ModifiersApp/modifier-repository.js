const { ModifiersModel } = require('./modifier-model')

class ModifiersRepository {
    addModifier(modifier_name,price,iva,iva_value,beans_value,is_Active) {
        return ModifiersModel.create({
            modifier_name : modifier_name,
            price : price,
            iva : iva,
            beans_value : beans_value,
            iva_value : iva_value,
            is_Active : is_Active
        });
    }

    getModifiers(id) {
        return id ? ModifiersModel.findOne({where : { _id : id }}) : ModifiersModel.findAll({where : { is_deleted : false }, order : [
            ["createdAt", "DESC"],
        ] })
     }

    deleteModifier(id) {
        return ModifiersModel.update({is_deleted : true},{
            where: {
                "_id": id
            }
        })
    }

    updateModifier(query)
    {
        return ModifiersModel.update(query,{
            where : {
                _id : query._id
            }
        })
    }
    isUniqueCode(name) {
        return UserCategories.findOne({ where: { category_name: name, is_deleted : false } })
    }
}

module.exports.ModifiersRepository = new ModifiersRepository()