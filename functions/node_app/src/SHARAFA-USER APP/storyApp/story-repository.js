const { StoryModel } = require('./story-model')
const { UserProducts } = require('../Products_app/products-model');

// {_id,title,products,thumbnail_name,thumbnail_url,story_name,story_url,story_content,order,is_deleted}
class StoryReporstory {
    addStory(data) {
        console.log(data)
        return StoryModel.create({
            title : data.title,
            products : data.products[0],
            thumbnail_name : data.thumbnail_name,
            thumbnail_url : data.thumbnail_url,
            story_name : data.story_name,
            story_url : data.story_url,
            story_content : data.story_content,
            order : data.order,
            is_deleted : data.is_deleted,
        })
    }

    // include: [
    //     { model: UserProducts, as: "product_info"},
    // ] 
    getStory(id) {
        return id ? StoryModel.findOne({where : { _id : id },include: [{
            model: UserProducts, as: "product_info"
        }]}) : StoryModel.findAll({where : { is_deleted : false }, order : [
            ["order", "ASC"],
            ["createdAt", "DESC"],
        ],
        include: [{
            model: UserProducts, as: "product_info"
        }]})
     }

    deleteStory(id) {
        return StoryModel.update({is_deleted : true},{
            where: {
                "_id": id
            }
        })
    }

    updateStory(query)
    {
        return StoryModel.update(query,{
            where : {
                _id : query._id
            }
        })
    }
}

module.exports.StoryReporstory = new StoryReporstory()