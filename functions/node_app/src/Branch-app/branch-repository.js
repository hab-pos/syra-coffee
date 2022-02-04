const { BrancheModel } = require('./Branch-model')

class BranchRepository {
    addBranch(branch_name, device_id, admin_id,lat,lng,show_on_app,espresso_report_date) {
        return BrancheModel.create({
            created_by : admin_id,
            branch_name : branch_name,
            device_id : device_id,
            lat : lat,
            lng : lng,
            show_on_app : show_on_app,
            espresso_report_date : espresso_report_date
        });
    }

    getBranches(id) {
        return id ? BrancheModel.findOne({where : { _id : id }}) : BrancheModel.findAll({order : [
            ["createdAt", "DESc"]
        ]})
     }

    deleteBranch(id) {
        return BrancheModel.destroy({
            where: {
                "_id": id
            }
        })
    }

    update_branch(id,query)
    {
        return BrancheModel.update(query,{
            where : {
                _id : id
            }
        })
    }

    isUniqueCode(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }

}

module.exports.branchRepository = new BranchRepository()