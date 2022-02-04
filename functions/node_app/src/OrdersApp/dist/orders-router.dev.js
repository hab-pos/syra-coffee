"use strict";

var express = require('express');

var _require = require('./orders-controller'),
    add_order = _require.add_order,
    get_orders = _require.get_orders,
    getTransactions = _require.getTransactions,
    filterAPI = _require.filterAPI,
    update_order = _require.update_order,
    get_vat_report = _require.get_vat_report,
    generateAccountPDF = _require.generateAccountPDF,
    sendMail = _require.sendMail,
    get_payout_report = _require.get_payout_report,
    open_cash = _require.open_cash,
    close_cash = _require.close_cash,
    get_flow = _require.get_flow,
    getDiscountsGrouped = _require.getDiscountsGrouped,
    getDicountBaristaGrouped = _require.getDicountBaristaGrouped,
    test = _require.test,
    get_discounts_report = _require.get_discounts_report,
    get_comparision = _require.get_comparision,
    getGlobalSales = _require.getGlobalSales,
    getTotalBillingsGraph = _require.getTotalBillingsGraph,
    CategoryOrdersFiltered = _require.CategoryOrdersFiltered,
    GetBranchGraph = _require.GetBranchGraph,
    change_payment_method = _require.change_payment_method,
    updateDateHour = _require.updateDateHour,
    getDashBoard = _require.getDashBoard,
    ProductOrdersFiltered = _require.ProductOrdersFiltered;

var _require2 = require('../../Utils/validation/validate.middleware'),
    validate = _require2.validate;

var router = express.Router();
router.post('/create_order', add_order);
router.post('/get_orders', get_orders);
router.post('/transactionIn', getTransactions);
router.post("/filter", filterAPI);
router.post("/update_status", update_order);
router.post('/get_vat_report', get_vat_report);
router.post('/get_report_with_payment_mode', get_payout_report);
router.post('/change_payment_method', change_payment_method);
router.post("/test", test);
router.post('/open_cash', open_cash);
router.post('/close_cash', close_cash);
router.post('/get_flow', get_flow);
router.post('/get_applied_discounts_grouped', getDiscountsGrouped);
router.post('/get_barista_grouped_discount', getDicountBaristaGrouped);
router.post('/get_discount_report', get_discounts_report);
router.post('/get_discount_comparsion', get_comparision);
router.post('/send_recipet_mail', sendMail);
router.post('/accounting-report', generateAccountPDF);
router.post('/global-sales', getGlobalSales);
router.post('/category-sales', CategoryOrdersFiltered);
router.post('/product-sales', ProductOrdersFiltered);
router.post('/category-check', updateDateHour);
router.post('/get-dashboard', getDashBoard);
router.post('/get-dashboard-branch-graph', GetBranchGraph);
router.post('/get-dashboard-report-graph', getTotalBillingsGraph);
module.exports.ordersRouter = router;