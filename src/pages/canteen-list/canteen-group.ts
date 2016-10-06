import {Canteen} from "../../app/lib/orders/canteen";

export class CanteenGroup
{
    private _visible: boolean = false;

    constructor(private _identifier: string,
                private _canteens: Canteen[])
    {

    }

    get identifier(): string
    {
        return this._identifier;
    }
    get canteens(): Canteen[]
    {
        return this._canteens;
    }

    get visible(): boolean
    {
        return this._visible;
    }
    set visible(value: boolean)
    {
        this._visible = value;
    }

    public toggleVisible()
    {
        this.visible = !this.visible;
    }
}
