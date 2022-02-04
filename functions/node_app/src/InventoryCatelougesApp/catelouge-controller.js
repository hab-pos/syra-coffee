const { catelougeRepository } = require('./catelouge-repository')
const { catelouge_inserted } = require("./catelouge-emitter")
module.exports.add_inventory = async function (req, res, _) {
    const { inventory_name, reference, unit, price, category_id, available_branches, created_by } = req.body
    console.log(req.body)
    catelougeRepository.isUniqueCode(inventory_name).then(response => {
        if (response) {
            res.api(200, "already available", null, false)
        }
        else {
            catelougeRepository.addInventory(inventory_name, reference, unit, price, category_id, available_branches, created_by).then(info => {
                res.api(200, "inventory saved", { info }, true)
                catelouge_inserted({ ids: available_branches.split(","), catelouge: info })
            })
        }
    });

}

module.exports.get_inventories_sorted = async function (req, res, _) {
    let result = await catelougeRepository.get_inventories_sorted(null)
    res.api(200, "retrived successfully", {inventories : result}, true)

}


module.exports.get_inventories = async function (req, res, _) {
    const { id, device_id, branch_list } = req.body

    if (device_id) {
        catelougeRepository.get_branchInfo(device_id).then(branch_info => {
            if (branch_info) {
                let branch_id = branch_info._id
                let inventories = []
                catelougeRepository.get_inventories(id).then(inventories_list => {
                    inventories_list.forEach(element => {
                        if (element.available_branches.includes(branch_id)) {
                            inventories.push(element)
                        }
                    });
                    res.api(200, "branch inventory retrived successfully", { inventories }, true)
                })
            }
            else {
                res.api(200, "IPAD Not registered to Branch", null, false)
            }
        })
    }
    else if (branch_list) {
        if (branch_list.length == 0) {
            catelougeRepository.get_inventories(id).then(inventories => {
                res.api(200, "inventory retrived successfully", { inventories }, true)
            })
        } else {
            let inventories = []
            catelougeRepository.get_inventories(id).then(inventories_list => {
                branch_list.forEach(element_branch => {
                    inventories_list.forEach(element => {
                        if (element.available_branches.includes(element_branch)) {
                            let index = inventories.map(function (iv) { return iv._id; }).indexOf(element._id);
                            if (index < 0) {
                                inventories.push(element)
                            }
                        }
                    });
                });

                res.api(200, "branch inventory retrived successfully", { inventories }, true)
            })
        }

    }
    else {
        catelougeRepository.get_inventories(id).then(inventories => {
            res.api(200, "inventory retrived successfully", { inventories }, true)
        })
    }

}
module.exports.update_inventory = async function (req, res, _) {
    catelougeRepository.update_inventory(req.body).then(update_success => {
        (update_success[0] > 0) ? res.api(200, "inventory updated successfully", null, true) : res.api(404, "no inventory found", null, false)
        catelouge_inserted({ ids: req.body.available_branches.split(","), catelouge: req.body })
    })
}

module.exports.delete_inventory = async function (req, res, _) {
    const { id } = req.body
    catelougeRepository.delete_inventory(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "inventory deleted successfully", null, true) : res.api(404, "No inventory found", null, false)
    })
}

module.exports.search_inventory = async function (req, res, _) {
    const { search_string } = req.body
    catelougeRepository.search(search_string).then(response => {
        res.api(200, "inventory read successfully", response, true)
    })
}