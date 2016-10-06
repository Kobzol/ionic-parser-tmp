export class UserData
{
    constructor(private _firstname: string,
                private _surname: string,
                private _variableSymbol: string,
                private _updateDate: Date)
    {

    }


    get firstname(): string
    {
        return this._firstname;
    }
    get surname(): string
    {
        return this._surname;
    }
    get fullName(): string
    {
        let name: string = "";

        if (this.firstname !== "")
        {
            name = this.firstname + " ";
        }

        return name + this.surname;
    }

    get variableSymbol(): string
    {
        return this._variableSymbol;
    }
    get updateDate(): Date
    {
        return this._updateDate;
    }
}
