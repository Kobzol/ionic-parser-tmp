export class UserSettings
{
    constructor(private _email1: string,
                private _email2: string,
                private _emailMessageSettings1: boolean[],
                private _emailMessageSettings2: boolean[],
                private _password: string,
                private _id: number,
                private _changeDate: Date)
    {

    }

    get email1(): string
    {
        return this._email1;
    }
    set email1(value: string)
    {
        this._email1 = value;
    }

    get email2(): string
    {
        return this._email2;
    }
    set email2(value: string)
    {
        this._email2 = value;
    }

    get emailMessageSettings1(): boolean[]
    {
        return this._emailMessageSettings1;
    }
    set emailMessageSettings1(value: boolean[])
    {
        this._emailMessageSettings1 = value;
    }

    get emailMessageSettings2(): boolean[]
    {
        return this._emailMessageSettings2;
    }
    set emailMessageSettings2(value: boolean[])
    {
        this._emailMessageSettings2 = value;
    }

    get password(): string
    {
        return this._password;
    }
    set password(value: string)
    {
        this._password = value;
    }


    get id(): number
    {
        return this._id;
    }
    get changeDate(): Date
    {
        return this._changeDate;
    }
}
