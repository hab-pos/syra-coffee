import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
  })

export class SyraErrors{
    errors : any = Object()

    errorType : any = Object()
    constructor(){
        
        //error message
        this.errors["product_name"] = "Product name"
        this.errors["setup"] = "Setup"
        this.errors["description"] = "description"
        this.errors["items_name"] = "Product name"
        this.errors["refernce"] = "Reference Name"
        this.errors["units"] = "Unit Field"
        this.errors["price"] = "Price Field"
        this.errors["category"] = "Category"
        this.errors["category_name"] = "Category Name"
        this.errors["category_image"] = "Category Image"
        this.errors["modifier_name"] = "Modifier Name"
        this.errors["iva"] = "IVA percent"
        this.errors["beans"] = "Bean Value"

        this.errors["event_name"] = "Event Name"
        this.errors["start"] = "Event Start Date"
        this.errors["expiry_date"] = "Event End Date"
        this.errors["reward"] = "Reward Type"
        this.errors["products"] = "Products selection for Event"
        this.errors["notes"] = "Description of Event"
        this.errors["amount"] = "Reward Amount"
        this.errors["thumb_image"] = "Thumbnail Image"
        this.errors["cover_image"] = "Cover Image"

        //error type
        this.errorType["required"] = "Mandatory"

    }
}