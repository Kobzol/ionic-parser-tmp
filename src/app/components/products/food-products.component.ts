import {Component} from "@angular/core";
import {NavParams} from "ionic-angular/index";
import {FoodOverlayComponent} from "../overlay/food-overlay.component";
import {Product} from "../../lib/orders/product";
import {OrderManager} from "../../lib/orders/order-manager";
import {OverlayController} from "../../ui/overlay-controller";

@Component({
    selector: "food-products",
    templateUrl: "food-products.component.html",
})
export class FoodProductsComponent extends FoodOverlayComponent
{
    constructor(navParams: NavParams,
                private orderManager: OrderManager,
                private uiCtrl: OverlayController)
    {
        super(navParams);
    }

    async onProductChangeRequest(product: Product)
    {
        try
        {
            await this.orderManager.changeProductOrder(this.food, product);
        }
        catch (err)
        {
           await this.uiCtrl.showToast("Nepodařilo se změnit produkt").display;
        }
    }
}
