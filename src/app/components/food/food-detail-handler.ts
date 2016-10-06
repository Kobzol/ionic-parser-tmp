export class FoodDetailHandler
{
    constructor(private _predicate: () => boolean,
                private _text: string,
                private _handler: () => void,
                private _icon: string = "")
    {

    }

    get text(): string
    {
        return this._text;
    }
    get icon(): string
    {
        return this._icon;
    }

    public isActive(): boolean
    {
        return this._predicate();
    }
    public handle()
    {
        this._handler();
    }
}
