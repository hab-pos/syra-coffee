const { UserProducts } = require('./products-model')
const { IVAModel } = require("../../SetupApp/setup-model");
const { UserCategories } = require("../Category_app/category-model");
const {ModifiersModel} = require("../ModifiersApp/modifier-model");
const { MyCartModel } = require('../../User_App/User-model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// {
//     _id,
//       product_name,
//       price,
//       iva,
//       beans_value,
//       category,
//       image_name,
//       image_url,
//       setup_selected,
//       required_modifier,
//       optional_modifier,
//       grinds,
//       orgin_text,
//       notes,
//       notes_enabled,
//       origin_enabled,
//       description,
//       order,
//       is_Active,
//       is_deleted
//   }
class ProductRepository {
    addProduct(data) {
        return UserProducts.create({
            product_name : data.product_name,
            price : data.price,
            iva : data.iva,
            beans_value : data.beans_value,
            category : data.category,
            image_name : data.image_name,
            image_url : data.image_url,
            setup_selected : data.setup_selected,
            required_modifier : data.required_modifier,
            optional_modifier : data.optional_modifier,
            grinds : data.grinds,
            orgin_text : data.orgin_text,
            notes : data.notes,
            notes_enabled : data.notes_enabled,
            origin_enabled : data.origin_enabled,
            description : data.description,
            order : data.order,
            is_Active : data.is_Active,
            is_deleted : data.is_deleted,
            reference : data.reference
        })
    }

    getProducts(id,user_id = "") {
        return id ? UserProducts.findOne({where : { _id : id }}) : UserProducts.findAll({where : { is_deleted : false },include: [
            { model: IVAModel, as: "iva_info"},
            {model: UserCategories, as: "category_details"},
            {model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false, is_Active : true},required : false },
            {model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false, is_Active : true},required : false },
            {model: MyCartModel, as: "cart_info",where : {"user_id" : user_id,"is_claiming_gift" : false,"is_claim_wallet" : false, 
            [Op.or]:
            [
                { is_reorder : false },
                { is_reorder : null }
            ], event_id : null},required : false, include: [
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
            ]}
        ],  order: [
            ["order", "ASC"]
        ] })
     }

    deleteProduct(id) {
        return UserProducts.update({is_deleted : true},{
            where: {
                "_id": id
            }
        })
    }

    updateProduct(query)
    {
        return UserProducts.update(query,{
            where : {
                _id : query._id
            }
        })
    }
    isUniqueCode(name) {
        return UserProducts.findOne({ where: { category_name: name, is_deleted : false } })
    }
    getFeaturedProducts(){
        return UserProducts.findAll({where : { is_deleted : false,is_featured : true }, order : [
            ["order", "ASC"],
        ],include: [
            { model: IVAModel, as: "iva_info"},
            {model: UserCategories, as: "category_details"},
            {model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false},
            {model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false},required : false}
        ] })
    }
}

module.exports.ProductRepository = new ProductRepository()