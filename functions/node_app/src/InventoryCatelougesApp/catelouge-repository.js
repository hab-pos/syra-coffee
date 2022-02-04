const { InventoryCatelougeModel } = require('./catelouge-model')
const { inventoryBranchModel } = require('./catelouge-model')
const { CategoryModel } = require("../Category_app/category-model")
const { BrancheModel } = require('../Branch-app/Branch-model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class InventoryCatelougeRepoistory {
    addInventory(inventory_name, reference, unit, price, category_id, available_branches, created_by) {
        return InventoryCatelougeModel.create({
            inventory_name: inventory_name,
            reference: reference,
            unit: unit,
            price: price,
            category_id: category_id,
            available_branches: available_branches,
            created_by: created_by
        });
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
                ["createdAt", "DESC"]
            ]
        })
    }

    get_inventories_sorted(id) {
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

    delete_inventory(id) {
        return InventoryCatelougeModel.destroy({
            where: {
                "_id": id
            }
        })
    }

    update_inventory(query) {
        console.log(JSON.stringify(query));
        return InventoryCatelougeModel.update(query, {
            where: {
                _id: query.id
            }
        })
    }
    isUniqueCode(reference) {
        return InventoryCatelougeModel.findOne({ where: { inventory_name: reference} })
    }
    insert_middelware(branch_id, product_id) {
        return inventoryBranchModel.create({ BranchId: branch_id, catelouge_id: product_id })
    }
    checkUniquenessinMiddleware(branch_id, product_id) {
        return inventoryBranchModel.findAll({ where: { BranchId: branch_id, catelouge_id: product_id } })
    }

    delete_Relation(product_id) {
        return inventoryBranchModel.destroy({
            where: {
                "catelouge_id": product_id
            }
        })
    }

    search(string) {

        let ans =  InventoryCatelougeModel.findAll({
            where: {
                [Op.or]:
                [
                    {
                        inventory_name:
                        {
                            [Op.like]: "%" + string + "%"
                        }
                    },
                    {
                        reference:
                        {
                            [Op.like]: "%" + string + "%"
                        }
                    }
                ]
            }, 
            include: [{
                model: CategoryModel, as: "category_info"
            }, { model: BrancheModel, as: "branch_info" }]
        })

        ans.then(res => {
            console.log(res)
        })
        return ans
    }

    async get_branchInfo(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }

}

module.exports.catelougeRepository = new InventoryCatelougeRepoistory()