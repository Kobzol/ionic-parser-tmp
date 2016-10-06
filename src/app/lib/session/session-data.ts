import {User} from "../user/user";
import {StravneS5Client} from "../ws/stravne-s5-client";

export class SessionData
{
    constructor(private _user: User,
                private _apiClient: StravneS5Client)
    {

    }

    get user(): User
    {
        return this._user;
    }
    get apiClient(): StravneS5Client
    {
        return this._apiClient;
    }
}
