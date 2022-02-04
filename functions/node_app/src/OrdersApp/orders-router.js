const express = require('express')
const {applyPOSBeans,add_order,get_orders,getTransactions,filterAPI,update_order,get_vat_report,generateAccountPDF,
    sendMail,get_payout_report,open_cash,close_cash,get_flow,getDiscountsGrouped,getDicountBaristaGrouped,
    test,get_discounts_report,get_comparision,getGlobalSales,getTotalBillingsGraph,CategoryOrdersFiltered,GetBranchGraph,change_payment_method,updateDateHour,getDashBoard ,ProductOrdersFiltered } = require('./orders-controller')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/create_order',add_order)
router.post('/get_orders',get_orders)
router.post('/transactionIn',getTransactions)
router.post("/filter",filterAPI)
router.post("/update_status",update_order)
router.post('/get_vat_report',get_vat_report)
router.post('/get_report_with_payment_mode',get_payout_report)
router.post('/change_payment_method',change_payment_method)
router.post("/test",test)
router.post('/open_cash',open_cash)
router.post('/close_cash',close_cash)
router.post('/get_flow',get_flow)

router.post('/get_applied_discounts_grouped',getDiscountsGrouped)
router.post('/get_barista_grouped_discount',getDicountBaristaGrouped)
router.post('/get_discount_report',get_discounts_report)
router.post('/get_discount_comparsion',get_comparision)

router.post('/send_recipet_mail',sendMail)
router.post('/accounting-report',generateAccountPDF)

router.post('/global-sales',getGlobalSales)
router.post('/category-sales',CategoryOrdersFiltered)
router.post('/product-sales',ProductOrdersFiltered)
router.post('/category-check',updateDateHour)
router.post('/get-dashboard',getDashBoard)
router.post('/get-dashboard-branch-graph',GetBranchGraph)
router.post('/get-dashboard-report-graph',getTotalBillingsGraph)
router.post('/apply_bean',applyPOSBeans)


module.exports.ordersRouter = router


