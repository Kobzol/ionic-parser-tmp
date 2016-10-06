import {Injectable} from "@angular/core";
import {SessionData} from "./session-data";

@Injectable()
export class SessionService
{
    private _data: SessionData = null;

    public startSession(data: SessionData)
    {
        this._data = data;
    }
    public isActive(): boolean
    {
        return this.data !== null;
    }
    public endSession()
    {
        this._data = null;
    }

    get data(): SessionData
    {
        return this._data;
    }
}
