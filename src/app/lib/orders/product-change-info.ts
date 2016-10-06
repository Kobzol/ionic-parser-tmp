export class ProductChangeInfo
{
    constructor(private _id: string,
                private _count: number)
    {

    }

    get count(): number
    {
        return this._count;
    }
    get id(): string
    {
        return this._id;
    }
}
