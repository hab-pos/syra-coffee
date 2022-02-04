const { TransactionOutModel } = require('./transaction-out-model')
const {IVAModel} = require("../SetupApp/setup-model")
const {BaristaModel} = require("../BaristaApp/Barista-model")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const { constants } = require('../../Utils/constants')

class TransactionOutRepository {
    addTxn(date_of_transaction,reason,type,barista_id,iva_id,total_amount,mode_of_payment,invoice_number,branch_id,expense_id){
        return TransactionOutModel.create({
            date_of_transaction : date_of_transaction,
            reason : reason,
            type  : type,
            barista_id : barista_id,
            iva_id : iva_id,
            total_amount : total_amount,
            mode_of_payment : mode_of_payment,
            invoice_number : invoice_number,
            branch_id : branch_id,
            expense_id : expense_id
        })
    }
   

    deleteTxn(id){
        return TransactionOutModel.update({is_deleted : true},{where : {
            _id : id
        }})
    }

    getTxns(){
        return TransactionOutModel.findAll({where : {
            createdAt : {
                [Op.gte] : moment().utc().tz(constants.TIME_ZONE).startOf('day')
            },
            type : "expense"
        },order : [
            ["createdAt", "DESC"]
        ],include: [{
            model: IVAModel, as: "iva_info"
        }, { model: BaristaModel, as: "barista_info" }]})
    }   

    get_branch_wise_txn(branch){
        return TransactionOutModel.findAll({where : {
            branch_id : {[Op.in] : branch}, 
            type : "expense",
            date_of_transaction:{
            [Op.and] : 
            [
                {
                    [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                },
                {
                    [Op.lte]: moment().utc().tz(constants.TIME_ZONE).endOf('day')
                }
            ],
        }
        },order : [
            ["date_of_transaction", "DESC"]
        ],include : [{
            model: IVAModel, as: "iva_info"
        }, { model: BaristaModel, as: "barista_info" }]})
    }
    filter_with_start_end_branch(start,end,branch_id){
        console.log(branch_id,"branch_id_search")
        return TransactionOutModel.findAll({where : {
            branch_id : {[Op.in] : branch_id}, 
            date_of_transaction:
            {
                [Op.and] : 
                [
                    {
                        [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    {
                        [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                    }
                ],
            },
            type : "expense"
        },order : [
            ["date_of_transaction", "DESC"],
        ],include : [{
            model: IVAModel, as: "iva_info"
        }, { model: BaristaModel, as: "barista_info" }]})
    }
    filter_with_start_and_end(start, end){
        
        return TransactionOutModel.findAll({where : {
            date_of_transaction:
            {
                
                [Op.and] : 
                [
                    {
                        [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    {
                        [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                    }

                ],
            },
            type : "expense"
        },order : [
            ["date_of_transaction", "DESC"],
        ],include : [{
            model: IVAModel, as: "iva_info"
        }, { model: BaristaModel, as: "barista_info" }]})
    }
    filter_with_start(start){
        console.log(moment(start).utc().tz(constants.TIME_ZONE).startOf('day'))
        return TransactionOutModel.findAll({where : {
            date_of_transaction:
            {
                [Op.and] : 
                [
                    {
                        [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    {
                        [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                    }
                ],
            },
            type : "expense"
        },order : [
            ["date_of_transaction", "DESC"],
        ],include : [{
            model: IVAModel, as: "iva_info"
        }, { model: BaristaModel, as: "barista_info" }]})
    }
    filter_with_start_branch(start,branch_id){
        return TransactionOutModel.findAll({where : {
            branch_id : {[Op.in] : branch_id}, 
            date_of_transaction:
            {
                [Op.and] : 
                [
                    {
                        [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    {
                        [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                    }
                ],
            },
            type : "expense"
        },order : [
            ["date_of_transaction", "DESC"],
        ],include : [{
            model: IVAModel, as: "iva_info"
        }, { model: BaristaModel, as: "barista_info" }]})
    }


    async filterHelper (branch, dates) {
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {
                   return this.filter_with_start_end_branch(dates.start, dates.end, branch)
                }
                else {
                    return this.filter_with_start_and_end(dates.start, dates.end)
                }
            }
            else {
                if (branch != null) {
                    return this.filter_with_start_branch(dates.start, branch)
                }
                else {
                    console.log(branch, dates)
                    return this.filter_with_start(dates.start)
                }
            }
        }
        else if (branch == null && dates == null) {
            return this.getTxns()
        }
        else {
            return this.get_branch_wise_txn(branch)
        }
    }

}

module.exports.transactionOutRepository = new TransactionOutRepository()