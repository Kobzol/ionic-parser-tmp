import {Component} from "@angular/core";
import {NavParams} from "ionic-angular/index";
import {FoodOverlayComponent} from "../overlay/food-overlay.component";

@Component({
    selector: "food-details",
    templateUrl: "food-details.component.html"
})
export class FoodDetailsComponent extends FoodOverlayComponent
{
    constructor(navParams: NavParams)
    {
        super(navParams);
    }
}
