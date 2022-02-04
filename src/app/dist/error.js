"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SyraErrors = void 0;
var core_1 = require("@angular/core");
var SyraErrors = /** @class */ (function () {
    function SyraErrors() {
        this.errors = Object();
        this.errorType = Object();
        //error message
        this.errors["product_name"] = "Product name";
        this.errors["setup"] = "Setup";
        this.errors["description"] = "description";
        this.errors["items_name"] = "Product name";
        this.errors["refernce"] = "Reference Name";
        this.errors["units"] = "Unit Field";
        this.errors["price"] = "Price Field";
        this.errors["category"] = "Category";
        this.errors["category_name"] = "Category Name";
        this.errors["category_image"] = "Category Image";
        this.errors["modifier_name"] = "Modifier Name";
        this.errors["iva"] = "IVA percent";
        this.errors["beans"] = "Bean Value";
        this.errors["event_name"] = "Event Name";
        this.errors["start"] = "Event Start Date";
        this.errors["expiry_date"] = "Event End Date";
        this.errors["reward"] = "Reward Type";
        this.errors["products"] = "Products selection for Event";
        this.errors["notes"] = "Description of Event";
        this.errors["amount"] = "Reward Amount";
        this.errors["thumb_image"] = "Thumbnail Image";
        this.errors["cover_image"] = "Cover Image";
        //error type
        this.errorType["required"] = "Mandatory";
    }
    SyraErrors = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SyraErrors);
    return SyraErrors;
}());
exports.SyraErrors = SyraErrors;
