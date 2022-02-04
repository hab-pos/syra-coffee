"use strict";

var express = require('express');

var morgan = require('morgan');

var app = express(); // const fileUpload = require('express-fileupload');

var fileMiddleware = require('express-multipart-file-parser');

var cwd = process.cwd();

var cors = require('cors'); // const bodyParser = require('body-parser')


var _require = require('./Admin_app/Admin-app'),
    AdminApp = _require.AdminApp;

var _require2 = require('./Settings-app/Settings-app'),
    SettingsApp = _require2.SettingsApp;

var _require3 = require('./Colors-app/Color-app'),
    ColorsApp = _require3.ColorsApp;

var _require4 = require('../Utils/Common/APIResponce'),
    apiResponse = _require4.apiResponse;

var _require5 = require('./Currency-app/Currency-app'),
    CurrencysApp = _require5.CurrencysApp;

var _require6 = require('./Branch-app/Branch-app'),
    BranchApp = _require6.BranchApp;

var _require7 = require('./BaristaApp/Barista-app'),
    BaristaApp = _require7.BaristaApp;

var _require8 = require('./Category_app/category-app'),
    CategoryApp = _require8.CategoryApp;

var _require9 = require('./InventoryCatelougesApp/catelouge-app'),
    CatelougeApp = _require9.CatelougeApp;

var _require10 = require("./SetupApp/setup-app"),
    setupApp = _require10.setupApp;

var _require11 = require("./ProductApp/product-app"),
    ProductsApp = _require11.ProductsApp;

var _require12 = require('./InventoryOrderApp/inventory-order-app'),
    InventoryOrdersApp = _require12.InventoryOrdersApp;

var _require13 = require("./ExpenseApp/Expense-app"),
    ExpenseApp = _require13.ExpenseApp;

var _require14 = require("./Transaction-outApp/transaction-out-out-app"),
    TxnOutApp = _require14.TxnOutApp;

var _require15 = require('./Inventory-report/inventory-report-app'),
    InventoryReportApp = _require15.InventoryReportApp;

var _require16 = require("./OrdersApp/orders-app"),
    OrdersApp = _require16.OrdersApp;

var _require17 = require("./User_App/User-App"),
    UserApp = _require17.UserApp;

var _require18 = require('./SHARAFA-USER APP/Category_app/category-app'),
    UserCategoryApp = _require18.UserCategoryApp;

var _require19 = require('./SHARAFA-USER APP/ModifiersApp/modifier-app'),
    ModifiersApp = _require19.ModifiersApp;

var _require20 = require('./SHARAFA-USER APP/Products_app/products-app'),
    UserProductApp = _require20.UserProductApp;

var _require21 = require('./SHARAFA-USER APP/eventsApp/events-app'),
    EventApp = _require21.EventApp;

var _require22 = require('./SHARAFA-USER APP/storyApp/story-app'),
    StoryApp = _require22.StoryApp;

app.use(cors());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(apiResponse);
app.use(express["static"](cwd + '/dist'));
app.use(express["static"](cwd + '/media'));
app.use(fileMiddleware);
/* Api Middleware */

EventApp(app);
OrdersApp(app);
InventoryReportApp(app);
TxnOutApp(app);
ExpenseApp(app);
InventoryOrdersApp(app);
setupApp(app);
ProductsApp(app);
CatelougeApp(app);
CategoryApp(app);
BaristaApp(app);
BranchApp(app);
CurrencysApp(app);
UserApp(app);
AdminApp(app);
SettingsApp(app);
ColorsApp(app);
UserCategoryApp(app);
ModifiersApp(app);
UserProductApp(app);
StoryApp(app);
module.exports.app = app;