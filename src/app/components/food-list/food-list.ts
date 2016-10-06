import {Component, Input} from "@angular/core";
import {FoodGroup} from "../../lib/orders/food-group";
import {FoodListRow} from "./food-list-row";
import {DateUtil} from "../../lib/util/date-util";
import {OrderManager} from "../../lib/orders/order-manager";
import {OverlayController} from "../../ui/overlay-controller";

@Component({
    selector: "food-list",
    templateUrl: "food-list.html"
})
export class FoodListComponent
{
    rows: FoodListRow[] = [];

    constructor(private dateUtil: DateUtil,
                private orderManager: OrderManager,
                private uiCtrl: OverlayController)
    {

    }

    @Input() set foods(foods: FoodGroup[])
    {
        let rows: FoodListRow[] = [];

        if (foods === null)
        {
            foods = [];
        }

        for (let group of foods)
        {
            rows.push(new FoodListRow(false, group.date, group));

            for (let food of group.foods)
            {
                rows.push(new FoodListRow(true, food, group));
            }
        }

        this.rows = rows;
    }

    async orderDay(subscribe: boolean, date: Date)
    {
        try
        {
            if (subscribe)
            {
                await this.orderManager.subscribeDay(date);
            }
            else await this.orderManager.unsubscribeDay(date);
        }
        catch (err)
        {
            await this.uiCtrl.showToast(err.message);
        }
    }

    formatDate(date: Date, format: string): string
    {
        return this.dateUtil.format(date, format);
    }
}
