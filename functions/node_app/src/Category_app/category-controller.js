
const { categoryRepository } = require('./category-repository')
const { sequelize } = require('../db');
const { productsModel } = require("../ProductApp/product-model");
const { CategoryModel } = require('./category-model');
var loadsh = require('lodash');

module.exports.add_Category = async function (req, res, _) {
    const { category_name, color, available_branches, is_Active, created_by } = req.body

    categoryRepository.isUniqueCode(category_name).then(category => {
        if (category) {
            res.api(200, "already available", null, false)
        }
        else {
            let orders = []
            let array = available_branches.split(',')
            for (let index = 0; index < array.length; index++) {
                const element = { branch_id: array[index], order: 0 }
                orders.push(element)
            }
            categoryRepository.addcategory(category_name, color, available_branches, is_Active, created_by, JSON.stringify(orders)).then(info => {
                res.api(200, "category saved", { info }, true)
            })
        }
    })
}

module.exports.test_order = async function (req, res, _) {
    let data = await CategoryModel.findAll({})
    let array = []
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        for (let index_branch = 0; index_branch < element.available_branches.length; index_branch++) {
            const element_prod = element.available_branches[index_branch];
            let item = { branch_id: element_prod, order: 0 }
            array.push(item)
        }
        console.log(array, "index", index)
        await CategoryModel.update({ order: JSON.stringify(array) }, {
            where: {
                "_id": element._id
            }
        })
        array = []
    }

    res.api(200, "category saved", "", true)

}


module.exports.get_category = async function (req, res, _) {
    const { id } = req.body
    categoryRepository.getCateogories(id).then(category => {
        res.api(200, "categories retrived successfully", { category }, true)
    })
}
module.exports.update_category = async function (req, res, _) {
    const { id, available_branches } = req.body
    let category = await categoryRepository.getCateogories(id)
    let branch_list = available_branches.split(",")

    let to_insert = branch_list.filter((element) => {
        return !category.available_branches.includes(element)
    })

    let to_remove = category.available_branches.filter((element) => {
        return !branch_list.includes(element)
    })

    let json_to_do = JSON.parse(JSON.stringify(category.order))

    to_insert.forEach(element => {
        json_to_do.push({ branch_id: element, order: 0 })
    });
    json_to_do.forEach((element, index) => {
        if (to_remove.includes(element.branch_id)) {
            json_to_do.splice(index, 1);
        }
    });


    console.log("inser", to_insert, "remove", to_remove)

    if (to_insert.length > 0) {
        console.log("adding products also wait a moment .....")
        sequelize.query("SELECT * from Products where FIND_IN_SET('" + category._id + "',categories) AND is_deleted = false", { type: sequelize.QueryTypes.SELECT })
            .then(products => {
                products.forEach(element => {
                    let branches_to_insert = element.available_branches.split(",").concat(to_insert)
                    let order = JSON.parse(element.order)

                    to_insert.forEach((element) => {
                        let item = { branch_id: element, order: 0 }
                        order.push(item)
                    });

                    console.log("before", element.available_branches.split(","), "new ", to_insert, "combained", branches_to_insert);
                    productsModel.update({ available_branches: branches_to_insert.join(","), order: JSON.stringify(order) }, {
                        where: {
                            _id: element._id
                        }
                    })
                });
            })
    }
    if (to_remove.length > 0) {
        console.log("adding products also wait a moment .....")
        sequelize.query("SELECT * from Products where FIND_IN_SET('" + category._id + "',categories) AND is_deleted = false", { type: sequelize.QueryTypes.SELECT })
            .then(products => {
                products.forEach(element => {
                    let branches_to_insert = element.available_branches.split(",").filter((item) => {
                        return !to_remove.includes(item)
                    })
                    let order_list = JSON.parse(element.order)
                    let order = []
                    order_list.forEach((element) => {
                        if (!to_remove.includes(element.branch_id)) {
                            order.push(element)
                        }
                    });
                    console.log("before", element.available_branches.split(","), "new ", to_remove, "combained", branches_to_insert);
                    productsModel.update({ available_branches: branches_to_insert.join(","), order: JSON.stringify(order) }, {
                        where: {
                            _id: element._id
                        }
                    })
                });
            })
    }
    let obj = JSON.parse(JSON.stringify(req.body))
    obj.order = JSON.stringify(json_to_do)

    categoryRepository.update_categories(obj).then(update_success => {
        (update_success[0] > 0) ? res.api(200, "category updated successfully", null, true) : res.api(404, "no category found", null, false)
    })
}

module.exports.delete_category = async function (req, res, _) {
    const { id } = req.body
    categoryRepository.deleteCategories(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "category deleted successfully", null, true) : res.api(404, "No category found", null, false)
    })
}

module.exports.update_order = async function (req, res, _) {
    const { order, branch_id } = req.body
    iterationCount = 0
    let array = []
    for (let index = 0; index < order.length; index++) {
        const element = order[index];
        let category = await CategoryModel.findOne({ where: { _id: element.id } })
        let mutable_category = JSON.parse(JSON.stringify(category))
        console.log(mutable_category)
        for (let index_order = 0; index_order < mutable_category.order.length; index_order++) {
            let item = mutable_category.order[index_order]
            if (item.branch_id == branch_id) {
                item.order = element.order
            }
            array.push(item)
        }
        let data = await CategoryModel.update({ order: JSON.stringify(array) }, {
            where: { "_id": element.id }
        })
        array = []
    }
    res.api(200, "updated successfully", null, true)
}

module.exports.getBranchCategories = async function (req, res, _) {

    const { branch_id, branch_list } = req.body

    if (branch_list) {
        let array = []
        for (let index = 0; index < branch_list.length; index++) {
            const bid = branch_list[index];
            let category = await sequelize.query("SELECT * from Categories where FIND_IN_SET('" + bid + "',available_branches) AND `Categories`.`is_deleted` = false ORDER BY `Categories`.`order` ASC", { type: sequelize.QueryTypes.SELECT })
            let mutable_category_list = JSON.parse(JSON.stringify(category))
            for (let index = 0; index < mutable_category_list.length; index++) {
                let order_json = JSON.parse(mutable_category_list[index].order) || []
                order_json.forEach(element => {
                    if (branch_list.includes(element.branch_id)) {
                        mutable_category_list[index].order = element.order
                        console.log(mutable_category_list[index].category_name, mutable_category_list[index].order)
                    }
                });
            }

            let sorted = loadsh.sortBy(mutable_category_list,
                [function (o) { return o.order; }]);
            for (let index = 0; index < sorted.length; index++) {
                const element = sorted[index];
                let index_elem = array.map(function (element) { return element._id; }).indexOf(element._id)
                if (index_elem < 0) {
                    array.push(element)
                }
            }
        }
        res.api(200, "products retrived successfully", { category: array }, true)
    }
    else {
        sequelize.query("SELECT * from Categories where FIND_IN_SET('" + branch_id + "',available_branches) AND `Categories`.`is_deleted` = false ORDER BY `Categories`.`order` ASC", { type: sequelize.QueryTypes.SELECT })
            .then(category => {
                let mutable_category_list = JSON.parse(JSON.stringify(category))
                for (let index = 0; index < mutable_category_list.length; index++) {
                    let order_json = JSON.parse(mutable_category_list[index].order) || []
                    order_json.forEach(element => {
                        if (element.branch_id == branch_id) {
                            mutable_category_list[index].order = element.order
                            console.log(mutable_category_list[index].category_name, mutable_category_list[index].order)
                        }
                    });
                }

                let sorted = loadsh.sortBy(mutable_category_list,
                    [function (o) { return o.order; }]);

                res.api(200, "products retrived successfully", { category: sorted }, true)
            })
    }

}
