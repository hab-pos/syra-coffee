const { ColorModel } = require('./Color-model')

class ColorRepository {
    add_color(color_code) {
        return ColorModel.create({
            color_code: color_code,
        })
    }

    isUniqueCode(color_code) {
        return ColorModel.findOne({ where: { color_code: color_code } })
    }

    getAllColors(id) {
       return id ? ColorModel.findOne({where : { _id : id }}) : ColorModel.findAll()
    }

    deleteColor(id) {
        return ColorModel.destroy({
            where: {
                "_id": id
            }
        })
    }
    
    update_color(id, value) {
        return ColorModel.update({ color_code: value }, {
            where: {
                "_id" : id
            }
        })
    }
}

module.exports.colorRepository = new ColorRepository()