import {Canteen} from "../orders/canteen";
import {UserData} from "./user-data";
import {IssueLocation} from "../orders/issue-location";
import {Diet} from "../orders/diet";

export class User
{
    private _userData: UserData = null;
    private _balance: number = 0;
    private _issueLocations: IssueLocation[] = [];
    private _diets: Diet[] = [];

    constructor(private _canteen: Canteen,
                private _username: string,
                private _sid: string)
    {

    }

    get canteen(): Canteen
    {
        return this._canteen;
    }
    get username(): string
    {
        return this._username;
    }
    get sid(): string
    {
        return this._sid;
    }

    get userData(): UserData
    {
        return this._userData;
    }
    set userData(value: UserData)
    {
        this._userData = value;
    }

    get balance(): number
    {
        return this._balance;
    }
    set balance(value: number)
    {
        this._balance = value;
    }

    get issueLocations(): IssueLocation[]
    {
        return this._issueLocations;
    }
    set issueLocations(value: IssueLocation[])
    {
        this._issueLocations = value;
    }

    get diets(): Diet[]
    {
        return this._diets;
    }
    set diets(value: Diet[])
    {
        this._diets = value;
    }
}
