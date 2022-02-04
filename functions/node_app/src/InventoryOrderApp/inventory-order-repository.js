const { BrancheModel } = require('../Branch-app/Branch-model');
const { InventoryOrderModel } = require('./inventory-order-model')
const { BaristaModel } = require("../BaristaApp/Barista-model");
const { CategoryModel } = require("../Category_app/category-model")
const { InventoryCatelougeModel } = require('../InventoryCatelougesApp/catelouge-model')

const {transactionOutRepository} = require('../Transaction-outApp/transaction-out-repository')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const { constants } = require('../../Utils/constants')

class InventoryOrderRepository {

    createTxn(req){
       return transactionOutRepository.addTxn(
        req.date_of_transaction,
        req.reason,
        req.type,
        req.barista_id,
        req.iva_id,
        req.total_amount,
        req.mode_of_payment,
        req.invoice_number)
    }

    createOrder(requestObj) {
        return InventoryOrderModel.create({
            order_date: requestObj.order_date,
            ordered_branch: requestObj.ordered_branch,
            received_by: requestObj.received_by,
            ordered_by: requestObj.ordered_by,
            delivery_date: requestObj.delivery_date,
            number_of_products: requestObj.number_of_products,
            status: requestObj.status,
            comment_by_barista: requestObj.comment_by_barista,
            admin_msg: requestObj.admin_msg,
            ordered_items: requestObj.ordered_items
        });
    }

    get_branchInfo(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }

    getInventoryOrders(id) {
        return id ? InventoryOrderModel.findOne({
            where: { _id: id }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        }) : InventoryOrderModel.findAll({
            where: { is_deleted: false,
                createdAt : {
                    [Op.gte] : moment().utc().tz(constants.TIME_ZONE).startOf('day')
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        })
    }

    deleteOrder(id) {
        return InventoryOrderModel.update({ is_deleted: true }, {
            where: {
                "_id": id
            }
        })
    }

    updateOrder(query) {
        return InventoryOrderModel.update(query, {
            where: {
                _id: query.id
            }
        })
    }

    get_branchInfo(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }

    get_inventories(id) {
        return id ? InventoryCatelougeModel.findOne({
            where: { _id: id }, include: [{
                model: CategoryModel, as: "category_info"
            }, { model: BrancheModel, as: "branch_info" }]
        }) : InventoryCatelougeModel.findAll({
            include: [{
                model: CategoryModel, as: "category_info"
            }, { model: BrancheModel, as: "branch_info" }],
            order : [
                ["reference", "ASC"],
                ["inventory_name","ASC"]
            ]
        })
    }

    // only branch
    get_branch_orders(branch_id) {
        return InventoryOrderModel.findAll({
            where: { is_deleted: false, ordered_branch: branch_id,
                createdAt : {
                    [Op.gte] : moment().utc().tz(constants.TIME_ZONE).startOf('day')
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        })
    }

    get_branch_orders_not_delivered(branch_id) {
        return InventoryOrderModel.findAll({
            where: { is_deleted: false, ordered_branch: branch_id ,
                status : {
                    [Op.in] : ["approved","pending"]
                },
                createdAt : {
                    [Op.and] : 
                    [
                        {
                            [Op.gte] : moment().subtract('1','months').utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment().subtract('1','days').utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        })
    }

    //only dates both start and end
    get_date_orders(start, end) {
        return InventoryOrderModel.findAll({
            where: {
                is_deleted: false, 
                createdAt:
                {
                    [Op.and] : 
                    [
                        {
                            [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]
                    
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        })
    }

    // both start,end dates and branch-id
    get_branches_and_dates(branch_id, start, end) {
        return InventoryOrderModel.findAll({
            where: {
                is_deleted: false, ordered_branch: {
                    [Op.in] : branch_id
                }, createdAt:
                {
                    [Op.and] : 
                    [
                        {
                            [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]
                    
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        })
    }

    //branch and start date only
    get_branches_and_StartDate(branch_id, start) {
        return InventoryOrderModel.findAll({
            where: {
                is_deleted: false, ordered_branch: {
                    [Op.in] : branch_id
                }, createdAt:
                {   
                    [Op.and] : 
                    [
                        {
                            [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]                     
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ],
            order : [
                ["order_date", "DESC"]
            ]
        })
    }
    //only start 
    get_orders_only_with_start_date(start) {
        console.log(start)
        console.log(moment(start).utc().tz(constants.TIME_ZONE).startOf('day'))
        console.log(moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))
        return InventoryOrderModel.findAll({
            where: {
                is_deleted: false, createdAt:
                {                       
                    [Op.and] : 
                    [
                        {
                            [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]              
                }
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "ordered_by_details" },
                { model: BaristaModel, as: "recieved_by_details" }
            ]
            ,order : [
                ["order_date", "DESC"]
            ]
        })
    }
}

module.exports.inventoryOrderRepository = new InventoryOrderRepository()