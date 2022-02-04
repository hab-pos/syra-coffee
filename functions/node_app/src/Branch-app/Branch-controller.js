const { branchRepository } = require('./branch-repository')

module.exports.add_branch = async function (req, res, _) {
    const { created_by, branch_name, device_id,lat,lng,show_on_app,espresso_report_date } = req.body
    branchRepository.addBranch(branch_name,device_id,created_by,lat,lng,show_on_app,espresso_report_date).then( branchInfo => {
        res.api(200,"Branch saved",{branchInfo},true)
    })
}

module.exports.get_branch = async function(req,res,_){
    const {id} = req.body
    branchRepository.getBranches(id).then(branch_list => {
        res.api(200,"branches retrived successfully",{branch_list},true)
    })
}
module.exports.update_branch = async function(req, res, _){
    console.log(req.body)
    const {id,branch_name,device_id,lat,lng,show_on_app,espresso_report_date} = req.body

    var query = (branch_name != null && branch_name != undefined && device_id != null && device_id != undefined) ?
    {"branch_name" : branch_name,"device_id" : device_id,"lat" : lat,"lng" : lng,"show_on_app" : show_on_app,"espresso_report_date" : espresso_report_date} : (branch_name != null && branch_name != undefined) ? {"branch_name" : branch_name,"lat" : lat,"lng" : lng,"show_on_app" : show_on_app,"espresso_report_date" : espresso_report_date} : {"device_id" : device_id,"lat" : lat,"lng" : lng,"show_on_app" : show_on_app,"espresso_report_date" : espresso_report_date}

    branchRepository.update_branch(id,query).then(update_success => {
        (update_success[0] > 0) ? res.api(200,"branch updated successfully",null,true) :  res.api(404,"no branch found",null,false)
    })
}

module.exports.delete_branch = async function(req, res, _){
    const {id} = req.body
    branchRepository.deleteBranch(id).then(delete_count => {
        delete_count > 0 ? res.api(200,"currency deleted successfully",null,true) :  res.api(404,"No currency found",null,false)
    })
}