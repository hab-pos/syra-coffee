const { MyCartModel } = require('../../User_App/User-model')
const { ModifiersModel } = require('../ModifiersApp/modifier-model')
const { UserProducts } = require('../Products_app/products-model')
const { EventProducts,SyraEvents } = require('./events-model')

class EventRepository {
    addEvent(data) {
        return SyraEvents.create({
            event_name : data.event_name,
            start_date : data.start_date,
            end_date : data.end_date,
            reward_mode : data.reward_mode,
            amount : data.amount,
            products : data.products,
            thumbnail_name : data.thumbnail_name,
            thumbnail_url : data.thumbnail_url,
            cover_name : data.cover_name,
            cover_url : data.cover_url,
            description : data.description,
            order : data.order,
            is_deleted : data.is_deleted,
        })
    }

    // include: [
    //     { model: IVAModel, as: "iva_info"},
    //     {model: UserCategories, as: "category_details"}
    // ] 

    
    // include: [{
    //     model: UserProducts, as: "product_info"
    // }],

    getEvent(id) {
        return id ? SyraEvents.findOne({where : { _id : id },include: [{
            model: UserProducts, as: "product_info"
        }]}) : SyraEvents.findAll({where : { is_deleted : false }, order : [
            ["createdAt", "DESC"]
        ],include: [{
                model: UserProducts, as: "product_info"
            }]})
     }

    deleteEvent(id) {
        return SyraEvents.update({is_deleted : true},{
            where: {
                "_id": id
            }
        })
    }

    updateEvent(query)
    {
        return SyraEvents.update(query,{
            where : {
                _id : query._id
            }
        })
    }
}

module.exports.EventRepository = new EventRepository()