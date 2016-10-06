export enum IssueType
{
    NotIssued = -1,
    Issued = 0,
    PokusODruhyVydej = 1,
    UskutecnenyDruhyVydej = 2,
    NeznamaKarta = 3,
    PokusOVydejNeobjednaneStravy = 4,
    ChybneVydejniMisto = 5,
    VydejNeobjednaneStravy = 6,
    NevyhodnocenyOdber = 7,
    NahradniStravenka = 8,
    NahradniStravenkaBOX = 9
}

export class Issue
{
    constructor(private _foodDate: Date,
                private _foodType: string,
                private _foodName: string,
                private _foodTypeDescription: string,
                private _count: number,
                private _type: IssueType,
                private _issueDate: Date = null)
    {

    }

    get foodDate(): Date
    {
        return this._foodDate;
    }
    get foodType(): string
    {
        return this._foodType;
    }
    get foodName(): string
    {
        return this._foodName;
    }
    get foodTypeDescription(): string
    {
        return this._foodTypeDescription;
    }
    get count(): number
    {
        return this._count;
    }
    get type(): IssueType
    {
        return this._type;
    }
    get issueDate(): Date
    {
        return this._issueDate;
    }
}
