export class Account
{
    constructor(private _name: string,
                private _canteen: string = "",
                private _username: string = "",
                private _password: string = "")
    {

    }

    get name(): string
    {
        return this._name;
    }
    set name(value: string)
    {
        this._name = value;
    }

    get canteen(): string
    {
        return this._canteen;
    }
    set canteen(value: string)
    {
        this._canteen = value;
    }

    get username(): string
    {
        return this._username;
    }
    set username(value: string)
    {
        this._username = value;
    }

    get password(): string
    {
        return this._password;
    }
    set password(value: string)
    {
        this._password = value;
    }
}
