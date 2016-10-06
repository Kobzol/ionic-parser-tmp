import {FoodGroup} from "../../lib/orders/food-group";
import {Food} from "../../lib/orders/food";

export class FoodListRow
{
    constructor(private _isFood: boolean,
                private _data: Food | Date,
                private _container: FoodGroup = null)
    {

    }

    get isFood(): boolean
    {
        return this._isFood;
    }

    get data(): Food|Date
    {
        return this._data;
    }

    get container(): FoodGroup
    {
        return this._container;
    }
}
