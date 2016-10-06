import _ from "lodash";

export class Canteen
{
    constructor(private _id: string,
                private _name: string,
                private _userMode: string,
                private _version: number,
                private _city: string,
                private _street: string,
                private _zip: string,
                private _telephone: string,
                private _email: string,
                private _url: string,
                private _text: string)
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
    get userMode(): string
    {
        return this._userMode;
    }
    get version(): number
    {
        return this._version;
    }
    get city(): string
    {
        return this._city;
    }
    get street(): string
    {
        return this._street;
    }
    get zip(): string
    {
        return this._zip;
    }
    get telephone(): string
    {
        return this._telephone;
    }
    get email(): string
    {
        return this._email;
    }
    get url(): string
    {
        return this._url;
    }
    get text(): string
    {
        return this._text;
    }

    public isVisible(): boolean
    {
        return _.includes(["S", "D"], this.userMode) && this.hasCity();
    }

    private hasCity()
    {
        return this.city !== "";
    }
}
