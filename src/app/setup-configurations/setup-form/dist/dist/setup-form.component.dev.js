"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.close = exports.SetupFormComponent = void 0;

var core_1 = require("@angular/core");

var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");

var forms_1 = require("@angular/forms");

var SetupFormComponent =
/** @class */
function () {
  function SetupFormComponent(apiService, commonService) {
    this.apiService = apiService;
    this.commonService = commonService;
    this.faTimesCircle = free_solid_svg_icons_1.faTimesCircle;
    this.close = exports.close;
    this.faPercent = free_solid_svg_icons_1.faPercent;
    this.faEuroSign = free_solid_svg_icons_1.faEuroSign;
    this.isLoading = false;
    this.ivaForm = new forms_1.FormGroup({
      iva: new forms_1.FormControl('', forms_1.Validators.required)
    });
    this.expenseForm = new forms_1.FormGroup({
      expense: new forms_1.FormControl('', forms_1.Validators.required)
    });
    this.discountForm = new forms_1.FormGroup({
      name: new forms_1.FormControl('', forms_1.Validators.required),
      amount: new forms_1.FormControl('', forms_1.Validators.required)
    });
  }

  SetupFormComponent.prototype.ngOnInit = function () {
    var _this = this;

    this.commonService.setupEmitter.subscribe(function (res) {
      _this.ivaForm.setValue({
        iva: ""
      });

      _this.expenseForm.setValue({
        expense: ""
      });

      _this.discountForm.setValue({
        name: "",
        amount: ""
      });

      _this.percentCheck.checked = true;
    });
    this.commonService.resetForms.subscribe(function () {
      _this.ivaForm = new forms_1.FormGroup({
        iva: new forms_1.FormControl('', forms_1.Validators.required)
      });
      _this.expenseForm = new forms_1.FormGroup({
        expense: new forms_1.FormControl('', forms_1.Validators.required)
      });
      _this.discountForm = new forms_1.FormGroup({
        name: new forms_1.FormControl('', forms_1.Validators.required),
        amount: new forms_1.FormControl('', forms_1.Validators.required)
      });
    });
  };

  SetupFormComponent.prototype.ngAfterViewInit = function () {
    var _this = this;

    setTimeout(function () {
      _this.percentCheck.checked = true;
    }, 1000);
  };

  SetupFormComponent.prototype.saveIVA = function () {
    var _this = this;

    var _a;

    if (this.ivaForm.valid) {
      this.isLoading = true;
      this.apiService.addIVA({
        iva_precent: this.ivaForm.controls["iva"].value.replace(',', '.').replace(' ', ''),
        created_by: JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "")["data"]["_id"]
      }).subscribe(function (res) {
        _this.commonService.showAlert(res.message);

        _this.isLoading = false;

        if (res.success) {
          _this.ivaForm.setValue({
            iva: ""
          });

          _this.commonService.commonEmitter.emit();

          _this.sidenav.close();
        }
      });
    } else {
      this.commonService.showAlert("Please Mention the Percentage");
    }
  };

  SetupFormComponent.prototype.checked = function (item) {
    if (item == 0) {
      this.percentCheck.checked = true;
      this.EuroCheck.checked = false;
    } else {
      this.percentCheck.checked = false;
      this.EuroCheck.checked = true;
    }
  };

  SetupFormComponent.prototype.saveExpense = function () {
    var _this = this;

    var _a;

    if (this.expenseForm.valid) {
      this.isLoading = true;
      this.apiService.addExpense({
        expense_name: this.expenseForm.controls["expense"].value,
        created_by: JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "")["data"]["_id"]
      }).subscribe(function (res) {
        _this.commonService.showAlert(res.message);

        _this.isLoading = false;

        if (res.success) {
          _this.expenseForm.setValue({
            expense: ""
          });

          _this.commonService.commonEmitter.emit();

          _this.sidenav.close();
        }
      });
    } else {
      this.commonService.showAlert("Please Mention the Expense");
    }
  };

  SetupFormComponent.prototype.saveDiscount = function () {
    var _this = this;

    var _a;

    if (this.discountForm.controls["name"].value == "") {
      this.commonService.showAlert("Please mention the Discount Name");
    } else if (this.discountForm.controls["amount"].value == "") {
      this.commonService.showAlert("Please mention the amount");
    } else if (isNaN(this.discountForm.controls["amount"].value.replace(',', '.').replace(' ', ''))) {
      this.commonService.showAlert("Invalid amount");
    } else {
      this.isLoading = true;
      var option = this.percentCheck.checked ? "percent" : "euro";
      this.apiService.addDiscount({
        discount_name: this.discountForm.controls["name"].value,
        amount: this.discountForm.controls["amount"].value.replace(',', '.').replace(' ', ''),
        type: option,
        created_by: JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "")["data"]["_id"]
      }).subscribe(function (res) {
        _this.commonService.showAlert(res.message);

        _this.isLoading = false;

        if (res.success) {
          _this.discountForm.setValue({
            name: "",
            amount: ""
          });

          _this.commonService.commonEmitter.emit();

          _this.sidenav.close();
        }
      });
    }
  };

  SetupFormComponent.prototype.toggle = function () {
    this.sidenav.toggle();
  };

  __decorate([core_1.Input()], SetupFormComponent.prototype, "sidenav");

  __decorate([core_1.Input()], SetupFormComponent.prototype, "field");

  __decorate([core_1.ViewChild("percentCheck")], SetupFormComponent.prototype, "percentCheck");

  __decorate([core_1.ViewChild("EuroCheck")], SetupFormComponent.prototype, "EuroCheck");

  SetupFormComponent = __decorate([core_1.Component({
    selector: 'app-setup-form',
    templateUrl: './setup-form.component.html',
    styleUrls: ['./setup-form.component.scss']
  })], SetupFormComponent);
  return SetupFormComponent;
}();

exports.SetupFormComponent = SetupFormComponent;
exports.close = {
  prefix: 'fa',
  iconName: 'line',
  icon: [512, 512, [], '', "M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005\n\t\t\ts26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874\n\t\t\tC536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0\n\t\t\tc-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0\n\t\t\tC493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046\n\t\t\tc-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02\n\t\t\tc-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046\n\t\t\tc3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111\n\t\t\tc3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z"]
};