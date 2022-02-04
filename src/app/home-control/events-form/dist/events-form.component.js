"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.EventsFormComponent = exports._filter = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var delete_component_1 = require("../../shared/components/delete/delete.component");
exports._filter = function (opt, value) {
    var filterValue = value.toLowerCase();
    return opt.filter(function (item) { return item.product_name.toLowerCase().includes(filterValue); });
};
var EventsFormComponent = /** @class */ (function () {
    function EventsFormComponent(apiServices, commonService, modalService) {
        var _this = this;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingAdd = false;
        this.isLoadingDelete = false;
        this.isLoadingUploadCover = false;
        this.isLoadingUploadThumbnail = false;
        this.close = exports.close;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.faTimes = free_solid_svg_icons_1.faTimes;
        this.content = "sadfasdfasdf";
        this.rewards = [
            {
                name: "discount50",
                value: "Discount (50%)"
            },
            {
                name: "beansx2",
                value: "Beans (2x)"
            }
        ];
        this.backup_rewards = [];
        this.toppingss = new forms_1.FormControl();
        this.notes = ['Honey', 'Plum', 'Cream', 'Dark Chocolate'];
        this.eventForm = new forms_1.FormGroup({
            event_name: new forms_1.FormControl('', forms_1.Validators.required),
            start: new forms_1.FormControl('', forms_1.Validators.required),
            expiry_date: new forms_1.FormControl('', forms_1.Validators.required),
            reward: new forms_1.FormControl('', forms_1.Validators.required),
            amount: new forms_1.FormControl('', forms_1.Validators.required),
            products: new forms_1.FormControl('', null),
            thumb_image: new forms_1.FormControl('', null),
            cover_image: new forms_1.FormControl('', null),
            notes: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.product_list = [];
        this.selectedCategory = 0;
        this.selectedPRoduct = 0;
        this.selectedProducts = [];
        this.modules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video'] // link and image, video
            ]
        };
        this.commonService.eventFormOpend.subscribe(function (data) {
            _this.getProduct_list();
            if (data == null) {
                _this.eventForm.reset();
                _this.selectedProducts = [];
                _this.selectedEvent = null;
                _this.imgURL = null;
                _this.cover_imgURL = null;
                _this.thumbnail_info = {};
                _this.coverimage_info = {};
            }
            else {
                // console.log("else")
                console.log(data);
                var reward_index = _this.rewards.findIndex(function (i) { return i.name == data.reward_mode || ""; });
                _this.eventForm = new forms_1.FormGroup({
                    event_name: new forms_1.FormControl(data.event_name, forms_1.Validators.required),
                    start: new forms_1.FormControl(data.start_date, forms_1.Validators.required),
                    expiry_date: new forms_1.FormControl(data.end_date, forms_1.Validators.required),
                    reward: new forms_1.FormControl(_this.rewards[reward_index].value, forms_1.Validators.required),
                    amount: new forms_1.FormControl(data.amount, forms_1.Validators.required),
                    products: new forms_1.FormControl('', null),
                    thumb_image: new forms_1.FormControl("", null),
                    cover_image: new forms_1.FormControl("", null),
                    notes: new forms_1.FormControl(data.description, forms_1.Validators.required)
                });
                _this.selectedProducts = data.products.split(',');
                _this.selectedEvent = data;
                _this.imgURL = data.thumbnail_url;
                _this.cover_imgURL = data.cover_url;
                _this.thumbnail_info = { imageName: data === null || data === void 0 ? void 0 : data.thumbnail_name, webContentLink: data === null || data === void 0 ? void 0 : data.thumbnail_url };
                _this.coverimage_info = { imageName: data === null || data === void 0 ? void 0 : data.cover_name, webContentLink: data === null || data === void 0 ? void 0 : data.cover_url };
            }
            _this.selectedEvent = data;
        });
    }
    EventsFormComponent.prototype.getProduct_list = function () {
        var _this = this;
        this.apiServices.getUserGroupedProducts({}).subscribe(function (products) {
            _this.product_list = JSON.parse(JSON.stringify(products)).data.products_list.filter(function (res) {
                return res.type == "product";
            });
            _this.initSearch();
        });
    };
    EventsFormComponent.prototype.ngOnInit = function () {
        this.backup_rewards = this.rewards;
    };
    EventsFormComponent.prototype.initSearch = function () {
        var _this = this;
        this.ProductOptions = this.eventForm.get('products').valueChanges
            .pipe(operators_1.startWith(''), operators_1.map(function (value) { return _this._filterGroup(value); }));
    };
    EventsFormComponent.prototype._filterGroup = function (value) {
        if (value && value != '') {
            return this.product_list
                .map(function (group) { return ({ category: group.category, products: exports._filter(group.products, value) }); })
                .filter(function (group) { return group.products.length > 0; });
        }
        return this.product_list;
    };
    EventsFormComponent.prototype.selectProduct = function (event) {
        this.initSearch();
    };
    EventsFormComponent.prototype.updateValue = function (section, row) {
        var _a;
        this.selectedCategory = section;
        this.selectedPRoduct = row;
        this.product_list[this.selectedCategory].products[this.selectedPRoduct].checked = !this.product_list[this.selectedCategory].products[this.selectedPRoduct].checked;
        var valueToDisplay = [];
        this.product_list.forEach(function (element) {
            element.products.forEach(function (element_prod) {
                if (element_prod.checked) {
                    valueToDisplay.push(element_prod.product_name);
                }
            });
        });
        (_a = this.eventForm.get('products')) === null || _a === void 0 ? void 0 : _a.setValue(valueToDisplay.join(", "));
    };
    EventsFormComponent.prototype.getValue = function (value) {
        return value;
    };
    EventsFormComponent.prototype.updateProductList = function (section, row) {
    };
    EventsFormComponent.prototype.saveAction = function () {
        this.gatherInput();
    };
    EventsFormComponent.prototype.saveEvent = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if ((((_a = this.thumbnail_info) === null || _a === void 0 ? void 0 : _a.webContentLink) != null || ((_b = this.thumbnail_info) === null || _b === void 0 ? void 0 : _b.webContentLink) != undefined) && (((_c = this.coverimage_info) === null || _c === void 0 ? void 0 : _c.webContentLink) != null || ((_d = this.coverimage_info) === null || _d === void 0 ? void 0 : _d.webContentLink) != undefined)) {
            this.isLoadingAdd = true;
            console.log("Inside saveEvent");
            var reward_index = this.rewards.findIndex(function (i) { var _a; return i.value == ((_a = _this.eventForm.get('reward')) === null || _a === void 0 ? void 0 : _a.value) || ""; });
            var request = {
                event_name: ((_e = this.eventForm.get('event_name')) === null || _e === void 0 ? void 0 : _e.value) || "",
                start_date: ((_f = this.eventForm.get('start')) === null || _f === void 0 ? void 0 : _f.value) || "",
                end_date: ((_g = this.eventForm.get('expiry_date')) === null || _g === void 0 ? void 0 : _g.value) || "",
                reward_mode: this.rewards[reward_index].name,
                amount: ((_h = this.eventForm.get('amount')) === null || _h === void 0 ? void 0 : _h.value) || "",
                products: this.product_select.value.join(','),
                thumbnail_name: this.thumbnail_info.imageName,
                thumbnail_url: this.thumbnail_info.webContentLink,
                cover_name: this.coverimage_info.imageName,
                cover_url: this.coverimage_info.webContentLink,
                description: ((_j = this.eventForm.get('notes')) === null || _j === void 0 ? void 0 : _j.value) || ""
            };
            this.apiServices.addEvent(request).subscribe(function (response) {
                console.log(response);
                _this.isLoadingAdd = false;
                _this.commonService.showAlert(response.message);
                if (response.success) {
                    _this.thumbnail_info = null;
                    _this.imagePath = null;
                    _this.sidenav.close();
                    _this.eventForm.reset();
                    _this.commonService.EventSuccess.emit();
                }
            });
        }
        else {
            this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!");
        }
    };
    EventsFormComponent.prototype.editEvent = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if ((((_a = this.thumbnail_info) === null || _a === void 0 ? void 0 : _a.webContentLink) != null || ((_b = this.thumbnail_info) === null || _b === void 0 ? void 0 : _b.webContentLink) != undefined) && (((_c = this.coverimage_info) === null || _c === void 0 ? void 0 : _c.webContentLink) != null || ((_d = this.coverimage_info) === null || _d === void 0 ? void 0 : _d.webContentLink) != undefined)) {
            this.isLoadingAdd = true;
            console.log("Inside saveEvent");
            var reward_index = this.rewards.findIndex(function (i) { var _a; return i.value == ((_a = _this.eventForm.get('reward')) === null || _a === void 0 ? void 0 : _a.value) || ""; });
            var request = {
                _id: this.selectedEvent._id,
                event_name: ((_e = this.eventForm.get('event_name')) === null || _e === void 0 ? void 0 : _e.value) || "",
                start_date: ((_f = this.eventForm.get('start')) === null || _f === void 0 ? void 0 : _f.value) || "",
                end_date: ((_g = this.eventForm.get('expiry_date')) === null || _g === void 0 ? void 0 : _g.value) || "",
                reward_mode: this.rewards[reward_index].name,
                amount: ((_h = this.eventForm.get('amount')) === null || _h === void 0 ? void 0 : _h.value) || "",
                products: this.selectedProducts.join(","),
                thumbnail_name: this.thumbnail_info.imageName,
                thumbnail_url: this.thumbnail_info.webContentLink,
                cover_name: this.coverimage_info.imageName,
                cover_url: this.coverimage_info.webContentLink,
                description: ((_j = this.eventForm.get('notes')) === null || _j === void 0 ? void 0 : _j.value) || ""
            };
            this.apiServices.UpdateEvent(request).subscribe(function (response) {
                console.log(response);
                _this.isLoadingAdd = false;
                _this.commonService.showAlert(response.message);
                if (response.success) {
                    _this.thumbnail_info = null;
                    _this.imagePath = null;
                    _this.sidenav.close();
                    _this.commonService.EventSuccess.emit();
                    _this.eventForm.reset();
                }
            });
        }
        else {
            this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!");
        }
    };
    EventsFormComponent.prototype.gatherInput = function () {
        if (this.eventForm.invalid) {
            this.commonService.showAlert(this.commonService.getFormValidationErrors(this.eventForm));
        }
        else if (this.selectedProducts.length == 0) {
            this.commonService.showAlert("Please select products for events");
        }
        else {
            console.log(this.action);
            this.action == "edit" ? this.editEvent() : this.saveEvent();
        }
    };
    EventsFormComponent.prototype.filter_rewards = function (value) {
        var filterValue = value.toLowerCase();
        this.rewards = this.backup_rewards.filter(function (option) { return option.toLowerCase().includes(filterValue); });
    };
    // deleteAction() {
    //   this.sidenav.close()
    // }
    EventsFormComponent.prototype.preview = function (files) {
        var _this = this;
        if (files.length === 0)
            return;
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        var reader = new FileReader();
        this.imagePath = files;
        this.uploadPhoto();
        reader.readAsDataURL(files[0]);
        reader.onload = function (_event) {
            _this.imgURL = reader.result;
        };
    };
    EventsFormComponent.prototype.preview_cover = function (cover_files) {
        var _this = this;
        if (cover_files.length === 0)
            return;
        var mimeType = cover_files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        var reader = new FileReader();
        this.cover_imagePath = cover_files;
        this.uploadCoverPhoto();
        reader.readAsDataURL(cover_files[0]);
        reader.onload = function (_event) {
            _this.cover_imgURL = reader.result;
        };
    };
    EventsFormComponent.prototype.uploadPhoto = function () {
        var _this = this;
        if (this.thumbnail_info.webContentLink != null) {
            this.thumbnail_info.webContentLink = null;
        }
        this.isLoadingUploadThumbnail = true;
        this.apiServices.uploadEventImage(this.imagePath[0]).subscribe(function (response) {
            _this.commonService.showAlert(response.message);
            _this.isLoadingUploadThumbnail = false;
            _this.thumbnail_info = response.data;
            console.log(_this.thumbnail_info);
        });
    };
    EventsFormComponent.prototype.uploadCoverPhoto = function () {
        var _this = this;
        if (this.coverimage_info.webContentLink != null) {
            this.coverimage_info.webContentLink = null;
        }
        this.isLoadingUploadCover = true;
        this.apiServices.uploadEventImage(this.cover_imagePath[0]).subscribe(function (response) {
            _this.commonService.showAlert(response.message);
            _this.coverimage_info = response.data;
            _this.isLoadingUploadCover = false;
        });
    };
    EventsFormComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteAPI();
        }, function () {
        });
    };
    EventsFormComponent.prototype.deleteAPI = function () {
        var _this = this;
        this.isLoadingDelete = true;
        this.apiServices.deleteEvent({ id: this.selectedEvent._id }).subscribe(function (res) {
            _this.commonService.showAlert(res.message);
            _this.isLoadingDelete = false;
            _this.sidenav.close();
            _this.commonService.EventSuccess.emit();
        });
    };
    __decorate([
        core_1.ViewChild('matProduct')
    ], EventsFormComponent.prototype, "product_select");
    __decorate([
        core_1.Input()
    ], EventsFormComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], EventsFormComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], EventsFormComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], EventsFormComponent.prototype, "product_list");
    EventsFormComponent = __decorate([
        core_1.Component({
            selector: 'app-events-form',
            templateUrl: './events-form.component.html',
            styleUrls: ['./events-form.component.scss']
        })
    ], EventsFormComponent);
    return EventsFormComponent;
}());
exports.EventsFormComponent = EventsFormComponent;
exports.close = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005\n\t\t\ts26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874\n\t\t\tC536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0\n\t\t\tc-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0\n\t\t\tC493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046\n\t\t\tc-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02\n\t\t\tc-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046\n\t\t\tc3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111\n\t\t\tc3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z",
    ]
};
