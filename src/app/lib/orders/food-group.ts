import {Food} from "./food";
import {ProductChangeInfo} from "./product-change-info";
import _ from "lodash";
import {Product} from "./product";

export class FoodGroup
{
    constructor(private _date: Date,
                private _foods: Food[])
    {

    }

    get foods(): Food[]
    {
        return this._foods;
    }
    get date(): Date
    {
        return this._date;
    }

    public hasMultipleFoods(): boolean
    {
        return this.foods.length > 1;
    }

    public updateFromChanges(changes: ProductChangeInfo[])
    {
        _.each(changes, (change: ProductChangeInfo) =>
        {
            let product: Product = this.findProductById(change.id);
            product.count = change.count;
        });
    }

    private findProductById(id: string): Product
    {
        let products: Product[] = _.flatten(_.map(this.foods, (food: Food) => food.products));
        return _.find(products, (product: Product) => product.id === id);
    }
}
