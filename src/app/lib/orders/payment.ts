export class Payment
{
    constructor(private _date: Date,
                private _amount: number,
                private _description: string)
    {

    }

    get date(): Date
    {
        return this._date;
    }
    get amount(): number
    {
        return this._amount;
    }
    get description(): string
    {
        return this._description;
    }
}
