import {Component} from "@angular/core";
import {NavParams} from "ionic-angular/index";
import {FoodOverlayComponent} from "../overlay/food-overlay.component";
import {OrderManager} from "../../lib/orders/order-manager";
import {OverlayController} from "../../ui/overlay-controller";
import {User} from "../../lib/user/user";
import {SessionService} from "../../lib/session/session-service";
import {Diet} from "../../lib/orders/diet";

@Component({
    selector: "diets",
    templateUrl: "diets.component.html"
})
export class DietsComponent extends FoodOverlayComponent
{
    public user: User = null;

    constructor(navParams: NavParams,
                private orderManager: OrderManager,
                private uiCtrl: OverlayController,
                private session: SessionService)
    {
        super(navParams);

        this.user = session.data.user;
    }

    async onDietChangeRequest(diet: Diet)
    {
        if (diet.id === this.food.dietId)
        {
            return;
        }

        try
        {
            await this.orderManager.changeDiet(this.food, diet);
        }
        catch (err)
        {
            await this.uiCtrl.showToast("Nepodařilo se změnit dietu").display;
        }
    }
}
