const { productsModel } = require('./product-model')
const { CategoryModel } = require('../Category_app/category-model');
const { BrancheModel } = require("../Branch-app/Branch-model")
const Sequelize = require('sequelize');
const { IVAModel } = require('../SetupApp/setup-model');
const Op = Sequelize.Op;
class ProductsRepository {
    addProduct(product_name, price, iva, categories, color, available_branches, created_by,price_with_iva,order) {
        return productsModel.create({
            product_name: product_name,
            price: price,
            iva: iva,
            categories: categories,
            color: color,
            available_branches: available_branches,
            created_by: created_by,
            price_with_iva : price_with_iva,
            order : order
        });
    }

    async get_branchInfo(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }


    getProducts(id) {
        return id ? productsModel.findOne({
            where: { _id: id }, include: [{
                model: IVAModel, as: "iva_info"
            }]
        }) : productsModel.findAll({
            where: { is_deleted: false }, order: [
                ["order", "ASC"]
            ], include: [{
                model: IVAModel, as: "iva_info"
            }]
        })
    }

    deleteProduct(id) {
        return productsModel.update({ is_deleted: true }, {
            where: {
                "_id": id
            }
        })
    }

    updateOrder(order) {
        return productsModel.update({ order: order.order }, { where: { _id: order.id } })
    }

    update_Product(query) {
        return productsModel.update(query, {
            where: {
                _id: query.id
            }
        })
    }

    isUniqueproduct(name) {
        return productsModel.findOne({ where: { product_name: name, is_deleted: false } })
    }
    getCateogories() {
        return CategoryModel.findAll({
            where: { is_deleted: false, is_Active: true }, order: [
                ["order", "ASC"]
            ]
        })
    }
    get_active_products() {
        return productsModel.findAll({
            where: { is_deleted: false, is_Active: true }, order: [
                ["order", "ASC"]
            ],
            include: [{
                model: IVAModel, as: "iva_info"
            }]
        })
    }
}

module.exports.ProductsRepository = new ProductsRepository()