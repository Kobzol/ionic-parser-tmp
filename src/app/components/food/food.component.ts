import {Component, Input} from "@angular/core";
import {Food} from "../../lib/orders/food";
import {FoodGroup} from "../../lib/orders/food-group";
import {FoodDetailsComponent} from "../details/food-details.component";
import {OverlayController} from "../../ui/overlay-controller";
import {FoodOverlayComponent} from "../overlay/food-overlay.component";
import {FoodProductsComponent} from "../products/food-products.component";
import {OrderManager} from "../../lib/orders/order-manager";
import {FoodDetailHandler} from "./food-detail-handler";
import {User} from "../../lib/user/user";
import {SessionService} from "../../lib/session/session-service";
import {IssueLocationsComponent} from "../issue-locations/issue-locations.component";
import {DietsComponent} from "../diets/diets.component";
import _ from "lodash";

@Component({
    selector: "food",
    templateUrl: "food.component.html"
})
export class FoodComponent
{
    @Input() food: Food;
    @Input() group: FoodGroup;

    private handlers: FoodDetailHandler[] = [
        new FoodDetailHandler(
            () => this.hasDetails(),
            "Podrobnosti",
            async () => {
                await this.uiCtrl.hideActionSheet();
                this.showDetails();
            },
            "information-circle"
        ),
        new FoodDetailHandler(
            () => this.hasMultipleProducts(),
            "Produkty",
            async () => {
                await this.uiCtrl.hideActionSheet();
                this.showProducts();
            },
            "pricetags"
        ),
        new FoodDetailHandler(
            () => this.hasMultipleIssueLocations(),
            "Výdejní místa",
            async () => {
                await this.uiCtrl.hideActionSheet();
                this.showIssueLocations();
            },
            "home"
        ),
        new FoodDetailHandler(
            () => this.hasMultipleDiets(),
            "Diety",
            async () => {
                await this.uiCtrl.hideActionSheet();
                this.showDiets();
            },
            "pizza"
        )
    ];
    private user: User = null;

    constructor(private uiCtrl: OverlayController,
                private orderManager: OrderManager,
                private session: SessionService)
    {
        this.user = session.data.user;
    }

    shouldShowContextMenu(): boolean
    {
        return this.getActiveHandlers().length > 0;
    }
    private getActiveHandlers(): FoodDetailHandler[]
    {
        return this.handlers.filter((handler: FoodDetailHandler) => handler.isActive());
    }
    async showContextMenu()
    {
        let activeHandlers: FoodDetailHandler[] = this.getActiveHandlers();

        if (activeHandlers.length === 1)
        {
            activeHandlers[0].handle();
        }
        else
        {
            await this.uiCtrl.showActionSheet("Možnosti", _.map(activeHandlers, (handler: FoodDetailHandler) => {
                return {
                    text: handler.text,
                    icon: handler.icon,
                    handler: () => handler.handle()
                };
            })).display;
        }
    }

    private showDetails()
    {
        this.showModal(FoodDetailsComponent);
    }
    private showProducts()
    {
        this.showOverlay(FoodProductsComponent);
    }
    private showIssueLocations()
    {
        this.showOverlay(IssueLocationsComponent);
    }
    private showDiets()
    {
        this.showOverlay(DietsComponent);
    }

    private async showOverlay(component: any)
    {
        await this.uiCtrl.showPopover(component, {
            [FoodOverlayComponent.KEY_FOOD]: this.food,
            [FoodOverlayComponent.KEY_CLOSE]: () => this.uiCtrl.hidePopover()
        }).display;
    }
    private async showModal(component: any)
    {
        await this.uiCtrl.showModal(component, {
            [FoodOverlayComponent.KEY_FOOD]: this.food,
            [FoodOverlayComponent.KEY_CLOSE]: () => this.uiCtrl.hideModal()
        }).display;
    }

    private hasDetails(): boolean
    {
        return  this.food.endOfOrder !== null ||
                this.food.endOfUnsubscribe !== null ||
                this.food.description !== "" ||
                this.food.allergens.length > 0;
    }
    private hasMultipleProducts(): boolean
    {
        return this.food.products.length > 1;
    }
    private hasMultipleIssueLocations(): boolean
    {
        return this.user.issueLocations.length > 1;
    }
    private hasMultipleDiets(): boolean
    {
        return this.food.diets.length > 1 && this.food.filterValidDiets(this.user.diets).length > 1;
    }

    async onFoodChangeRequest(event: Event)
    {
        if ((<Element>event.target).className.includes("context"))
        {
            return;
        }

        try
        {
            await this.orderManager.changeFoodOrder(this.food);
        }
        catch (err)
        {
            let message: string = err.message;
            if (message === "")
            {
                message = "Nepodařilo se provést objednávku";
            }

            await this.uiCtrl.showToast(message).display;
        }
    }
}
