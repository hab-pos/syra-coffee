const { CategoryModel } = require('./category-model')

class CategoryRepository {
    addcategory(category_name, color, available_branches,is_Active,created_by,order) {
        return CategoryModel.create({
            category_name : category_name,
            color : color,
            available_branches : available_branches,
            is_Active : is_Active,
            created_by : created_by,
            order : order
        });
    }

    getCateogories(id) {
        return id ? CategoryModel.findOne({where : { _id : id }}) : CategoryModel.findAll({where : { is_deleted : false }})
     }

    deleteCategories(id) {
        return CategoryModel.update({is_deleted : true},{
            where: {
                "_id": id
            }
        })
    }

    update_categories(query)
    {
        return CategoryModel.update(query,{
            where : {
                _id : query.id
            }
        })
    }

    updateOrder(order){
        return CategoryModel.update({order : order.order},{where : { _id  : order.id }})
    }

    isUniqueCode(name) {
        return CategoryModel.findOne({ where: { category_name: name, is_deleted : false } })
    }

    get_max_order(){
        return CategoryModel.max('order')
    }
}

module.exports.categoryRepository = new CategoryRepository()