import {Product} from "./product";
import {Diet} from "./diet";
import _ from "lodash";

export class Food
{
    constructor(private _date: Date,
                private _name: string,
                private _products: Product[],
                private _description: string = "",
                private _endOfOrder: Date = null,
                private _endOfUnsubscribe: Date = null,
                private _issueLocationId: string = "",
                private _dietId: string = "",
                private _diets: string[] = [],
                private _allergens: string[] = [],
                private _kind: string = "")
    {

    }

    get date(): Date
    {
        return this._date;
    }
    get name(): string
    {
        return this._name;
    }
    get products(): Product[]
    {
        return this._products;
    }
    get description(): string
    {
        return this._description;
    }
    get endOfOrder(): Date
    {
        return this._endOfOrder;
    }
    get endOfUnsubscribe(): Date
    {
        return this._endOfUnsubscribe;
    }
    get issueLocationId(): string
    {
        return this._issueLocationId;
    }
    set issueLocationId(value: string)
    {
        this._issueLocationId = value;
    }
    get dietId(): string
    {
        return this._dietId;
    }
    set dietId(value: string)
    {
        this._dietId = value;
    }
    get diets(): string[]
    {
        return this._diets;
    }
    get allergens(): string[]
    {
        return this._allergens;
    }
    get kind(): string
    {
        return this._kind;
    }

    public isOrdered(): boolean
    {
        return _.some(this._products, (product: Product) => product.isOrdered());
    }
    public isSoup(): boolean
    {
        return false;   // TODO
    }

    public canBeChanged(): boolean
    {
        return true; // TODO
    }

    public filterValidDiets(diets: Diet[]): Diet[]
    {
        return diets.filter(diet => _.includes(this.diets, diet.id));
    }
}
