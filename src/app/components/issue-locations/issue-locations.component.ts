import {Component} from "@angular/core";
import {NavParams} from "ionic-angular/index";
import {FoodOverlayComponent} from "../overlay/food-overlay.component";
import {OrderManager} from "../../lib/orders/order-manager";
import {OverlayController} from "../../ui/overlay-controller";
import {IssueLocation} from "../../lib/orders/issue-location";
import {User} from "../../lib/user/user";
import {SessionService} from "../../lib/session/session-service";

@Component({
    selector: "issue-locations",
    templateUrl: "issue-locations.component.html"
})
export class IssueLocationsComponent extends FoodOverlayComponent
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

    async onIssueLocationChangeRequest(issueLocation: IssueLocation)
    {
        if (issueLocation.id === this.food.issueLocationId)
        {
            return;
        }

        try
        {
            await this.orderManager.changeIssueLocation(this.food, issueLocation);
        }
        catch (err)
        {
            await this.uiCtrl.showToast("Nepodařilo se změnit výdejní místo").display;
        }
    }
}
