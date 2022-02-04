const { IVAModel,DiscountModel,ExpenseModel } = require('./setup-model')

class SetupRepository {
    async addIva(iva_precent,created_by){
        let count = await IVAModel.count()
        var color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
        var colorString = '#' + ('000000' + color).slice(-6);
        return IVAModel.create({
            iva_percent : iva_precent,
            created_by : created_by,
            color : colorString
        })
    }
     check_uniquenes_iva(iva_precent){
        return IVAModel.findAll({where : {
            iva_percent : iva_precent,
            is_deleted : false,
        }})
    }

    deleteIVA(id){
        return IVAModel.update({is_deleted : true},{where : {
            _id : id
        }})
    }

    get_iva(){
        return IVAModel.findAll({where : {is_deleted : false},order: [
            ["createdAt", "DESC"]
        ]})
    }


    addExpense(expense_name,created_by){
        return ExpenseModel.create({
            expense_name : expense_name,
            created_by : created_by
        })
    }
    check_uniquenes_Expense(expense_name){
        return ExpenseModel.findAll({where : {
            expense_name : expense_name,
            is_deleted : false
        }})
    }

    deleteExpense(_id){
        return ExpenseModel.update({is_deleted : true},{where : {
            _id : _id
        }})
    }
    get_Expense(){
        return ExpenseModel.findAll({where : {is_deleted : false},order: [
            ["createdAt", "DESC"]
        ]})
    }

    async addDiscount(discount_name,amount,type,created_by){
        let count = await DiscountModel.count()
        var color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
        var colorString = '#' + ('000000' + color).slice(-6);
        return DiscountModel.create({
            discount_name : discount_name,
            amount : amount,
            type : type,
            created_by : created_by,
            color : colorString
        })
    }
    check_uniquenes_discount(discount_name){
        return DiscountModel.findAll({where : {
            discount_name : discount_name,
            is_deleted : false
        }})
    }

    deleteDiscount(_id){
        console.log(_id)
        return DiscountModel.update({is_deleted : true},{where : {
            _id : _id
        }})
    }
    async get_Discounts(){
        return DiscountModel.findAll({where : {is_deleted : false},order: [
            ["position", "ASC"]
        ]})
    }

}

module.exports.setupRepository = new SetupRepository()