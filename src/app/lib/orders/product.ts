export class Product
{
    constructor(private _id: string,
                private _name: string,
                private _canBeChanged: boolean,
                private _cost: number,
                private _count: number)
    {

    }

    get count(): number
    {
        return this._count;
    }
    set count(value: number)
    {
        this._count = value;
    }
    get name(): string
    {
        return this._name;
    }
    get canBeChanged(): boolean
    {
        return this._canBeChanged;
    }
    get cost(): number
    {
        return this._cost;
    }
    get id(): string
    {
        return this._id;
    }

    public isOrdered(): boolean
    {
        return this._count > 0;
    }
}
