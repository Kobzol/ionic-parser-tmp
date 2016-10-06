import {Food} from "../../lib/orders/food";
import {Input} from "@angular/core";
import {NavParams} from "ionic-angular/index";

export class FoodOverlayComponent
{
    public static KEY_FOOD: string = "food";
    public static KEY_CLOSE: string = "close";

    @Input() public food: Food = null;
    @Input() public closeCallback: Function = null;

    constructor(private navParams: NavParams)
    {
        let food: Food = <Food>this.navParams.get(FoodOverlayComponent.KEY_FOOD);
        if (food !== undefined)
        {
            this.food = food;
        }

        let callback: Function = <Function>this.navParams.get(FoodOverlayComponent.KEY_CLOSE);
        if (callback !== undefined)
        {
            this.closeCallback = callback;
        }
    }

    public close()
    {
        if (this.closeCallback !== null)
        {
            this.closeCallback();
        }
    }
}
