const {colorRepository} = require('./Color-repository')

module.exports.add_color = async function (req, res, _) {
    const {color_code} = req.body
    colorRepository.add_color(color_code).then(color => {
        res.api(200,"Your preference saved",{color},true)
    })
}

module.exports.get_colors = async function(req,res,_){
    const {id} = req.body
    colorRepository.getAllColors(id).then(colors_list => {
        res.api(200,"colors retrived successfully",{colors_list},true)
    })
}

module.exports.update_color = async function(req, res, _){
    const {id,value} = req.body
    colorRepository.update_color(id,value).then(update_success => {
        (update_success[0] > 0) ? res.api(200,"color updated successfully",null,true) :  res.api(404,"No color found",null,false)
    })
}

module.exports.delete_color = async function(req, res, _){
    const {id} = req.body
    colorRepository.deleteColor(id).then(delete_count => {
        delete_count > 0 ? res.api(200,"color deleted successfully",null,true) :  res.api(404,"No color found",null,false)
    })
}
