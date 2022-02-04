
const { ModifiersRepository } = require('./modifier-repository')
const { ModifiersModel } = require('./modifier-model');
module.exports.addModifier = async function (req, res, _) {
    const {modifier_name,price,iva,beans_value,iva_value} = req.body
    let result = await  ModifiersRepository.addModifier(modifier_name,price,iva,iva_value,beans_value,true)
    return res.api(200,"Modifier Added Successfully",result,true);
}
module.exports.getModifiers = async function (req, res, _) {
    const { id } = req.body
    ModifiersRepository.getModifiers(id).then(modifiers => {
        res.api(200, "Modifiers retrived successfully",  modifiers , true)
    })
}

module.exports.getActiveModifiers = async function (req, res, _) {
    let modifiers = await ModifiersModel.findAll({where : { is_deleted : false,is_Active : true }, order : [
        ["createdAt", "DESC"],
    ] })
    return res.api(200, "Modifiers retrived successfully",  modifiers , true)

}
module.exports.updateModifiers = async function (req, res, _) {
    let category =  await ModifiersRepository.getModifiers(req.body._id)
    if(category){
        let result = await ModifiersRepository.updateModifier(req.body)
        return res.api(200, "Modifier Updated", result, true)
    }
    else{
        return res.api(200, "Modifier Not available", null, false)
    }
}
module.exports.updateOnlineStatus = async function (req, res, _) {
    await ModifiersModel.update({is_Active : req.body.is_Active},{where : {_id : req.body._id}})
    return res.api(200, "Status updated Successfully", null, false)
}

module.exports.deleteModifiers = async function (req, res, _) {
    const { id } = req.body
    ModifiersRepository.deleteModifier(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "category deleted successfully", null, true) : res.api(404, "No category found", null, false)
    })
}