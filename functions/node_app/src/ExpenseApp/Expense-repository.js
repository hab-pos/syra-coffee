const { ExpenseTableModel } = require('./Expense-model')
const { BrancheModel } = require('../Branch-app/Branch-model');
const { BaristaModel } = require("../BaristaApp/Barista-model");
const {IVAModel,ExpenseModel} = require("../SetupApp/setup-model")
const {transactionOutRepository} = require("../Transaction-outApp/transaction-out-repository")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
class ExpenseRepository {

    createTxn(req){
        return transactionOutRepository.addTxn(
         req.date_of_transaction,
         req.reason,
         req.type,
         req.barista_id,
         req.iva_id,
         req.total_amount,
         req.mode_of_payment,
         req.invoice_number,
         req.branch_id,
         req.expense_id)
     }
     
    createExpense(requestObj) {
        return ExpenseTableModel.create({
            expense_date: requestObj.expense_date,
            motive: requestObj.motive,
            iva_id: requestObj.iva_id,
            price: requestObj.price,
            payment: requestObj.payment,
            branch_id: requestObj.branch_id,
            barista_id: requestObj.barista_id,
        });
    }


    getExpenses(id,branch_id,openTime) {
        console.log(openTime)
        return id ? ExpenseTableModel.findOne({
            where: { _id: id, is_deleted : false
            }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "barista_info" },
                { model: IVAModel, as: "iva_info" },
                { model: ExpenseModel, as: "expense_info" }
            ]
        }) : ExpenseTableModel.findAll({
            where: { is_deleted: false, branch_id : branch_id,
                createdAt: {
                    [Op.gte]: openTime
                }
             }, include: [
                { model: BrancheModel, as: "branch_info" },
                { model: BaristaModel, as: "barista_info" },
                { model: IVAModel, as: "iva_info" },
                { model: ExpenseModel, as: "expense_info" }
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        })
    }

    deleteExpense(id) {
        return ExpenseTableModel.update({ is_deleted: true }, {
            where: {
                "_id": id
            }
        })
    }

    updateExpense(query) {
        return ExpenseTableModel.update(query, {
            where: {
                _id: query.id
            }
        })
    }

    get_branchInfo(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }
}

module.exports.expenseRepository = new ExpenseRepository()