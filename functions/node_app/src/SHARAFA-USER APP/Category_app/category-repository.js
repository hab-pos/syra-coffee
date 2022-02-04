const { UserCategories } = require('./category-model')

class CategoryRepository {
    addcategory(category_name, image_name, image_url,is_Active,order) {
        return UserCategories.create({
            category_name : category_name,
            image_name : image_name,
            image_url : image_url,
            is_Active : is_Active,
            order : order
        });
    }

    getCateogories(id) {
        return id ? UserCategories.findOne({where : { _id : id }}) : UserCategories.findAll({where : { is_deleted : false }, order : [
            ["ORDER", "ASC"],
        ] })
     }

    deleteCategories(id) {
        return UserCategories.update({is_deleted : true},{
            where: {
                "_id": id
            }
        })
    }

    update_categories(query)
    {
        return UserCategories.update(query,{
            where : {
                _id : query._id
            }
        })
    }

    updateOrder(order){
        return UserCategories.update({order : order.order},{where : { _id  : order.id }})
    }

    isUniqueCode(name) {
        return UserCategories.findOne({ where: { category_name: name, is_deleted : false } })
    }
}

module.exports.categoryRepository = new CategoryRepository()