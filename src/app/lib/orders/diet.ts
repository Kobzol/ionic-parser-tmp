export class Diet
{
    constructor(private _id: string,
                private _name: string)
    {

    }

    get id(): string
    {
        return this._id;
    }
    get name(): string
    {
        return this._name;
    }
}
