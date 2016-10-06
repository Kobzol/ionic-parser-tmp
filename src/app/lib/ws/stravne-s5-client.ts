import {Injectable} from "@angular/core";
import {Http, RequestOptions, RequestMethod, URLSearchParams, Headers, Response} from "@angular/http";
import {WsError} from "./ws-error";
import {Canteen} from "../orders/canteen";
import {User} from "../user/user";
import {FoodGroup} from "../orders/food-group";
import {StravneS5Adapter} from "./stravne-s5-adapter";
import {ProductChangeInfo} from "../orders/product-change-info";
import {Payment} from "../orders/payment";
import {Issue} from "../orders/issue";
import {DateUtil} from "../util/date-util";
import {UserSettings} from "../user/user-settings";
import {Food} from "../orders/food";
import {IssueLocation} from "../orders/issue-location";
import {Diet} from "../orders/diet";
import _ from "lodash";

@Injectable()
export class StravneS5Client
{
    private static RESULT_KEY: string = "Result";

    constructor(private http: Http,
                private adapter: StravneS5Adapter,
                private dateUtil: DateUtil,
                private url: string,
                private username: string,
                private password: string)
    {

    }

    public async logInUser(canteen: Canteen, username: string, password: string): Promise<User>
    {
        let data: any = await this.callWs("WSOPrihlaseniUzivateleKomplet", {
            databaze: canteen.id,
            uzivatel: username,
            heslo: password,
            jazyk: 0, // TODO
            mobilni: true
        });

        let user: User = new User(canteen, username, data["aSID"]);

        user.userData = this.adapter.deserializeUserData(data);
        user.balance = this.adapter.deserializeBalance(data);
        user.issueLocations = this.adapter.deserializeIssueLocations(data);
        user.diets = this.adapter.deserializeDiets(data);

        return user;
    }

    public logOutUser(user: User): Promise<void>
    {
        return this.callWsUser(user, "WSOOdhlaseniUzivatele");
    }

    public async getOrders(user: User): Promise<{foods: FoodGroup[], rawData: any}>
    {
        let data: any = await this.callWsUser(user, "WSORozpisObjednavek", {
            podminka:   ""
        });
        return this.adapter.deserializeOrders(data);
    }

    public async orderFood(user: User, id: string, count: number): Promise<ProductChangeInfo[]>
    {
        let data: any = await this.callWsUser(user, "WSOPrihlaseniJidla", {
            veta: id,
            pocet: count
        });
        return this.adapter.deserializeOrderChangeInfo(data);
    }

    public async orderDay(user: User, date: Date, count: number): Promise<ProductChangeInfo[]>
    {
        let data: any = await this.callWsUser(user, "WSOPrihlasDny", {
            datumyStr: `'${this.dateUtil.format(date, "YYYY-MM-DD")}'`,
            pocet: count
        });
        return this.adapter.deserializeOrderChangeInfo(data);
    }

    public saveOrders(user: User): Promise<any>
    {
        return this.callWsUser(user, "WSOUlozObjednavky");
    }

    public async getPayments(user: User): Promise<Payment[]>
    {
        let data: any = await this.callWsUser(user, "WSOPlatby");
        return this.adapter.deserializePayments(data);
    }

    public async getIssues(user: User): Promise<Issue[]>
    {
        let data: any = await this.callWsUser(user, "WSOVydanaJidla");
        return this.adapter.deserializeIssues(data);
    }

    public async getUserSettings(user: User): Promise<UserSettings>
    {
        let data: any = await this.callWsUser(user, "WSONastaveniKlienta");
        return this.adapter.deserializeUserSettings(data);
    }
    public saveUserSettings(user: User, userSettings: UserSettings): Promise<any>
    {
        let xml: string = this.adapter.serializeUserSettings(userSettings);
        // TODO: Post
        return this.callWsUser(user, "WSOZapisNastaveniKlienta", {
            xml: xml
        }, RequestMethod.Post);
    }

    public initializeDatabase(user: User): Promise<any>
    {
        return this.callWsUser(user, "WSOSqlRozp", {
            mobilni: true
        });
    }

    public changeIssueLocation(user: User, food: Food, issueLocation: IssueLocation): Promise<any>
    {
        return this.callWsUser(user, "WSOZmenaVydejnihoMista", {
            veta: food.products[0].id,
            vydejniMisto: issueLocation.id
        });
    }
    public changeDiet(user: User, food: Food, diet: Diet): Promise<any>
    {
        return this.callWsUser(user, "WSOZmenaDiety", {
            veta: food.products[0].id,
            dieta: diet.id
        });
    }

    private callWsUser(user: User, apiMethod: string, parameters: {[index: string]: any} = {},
                       httpMethod: RequestMethod = RequestMethod.Get,
                       authenticated: boolean = true): Promise<any>
    {
        parameters["databaze"] = user.canteen.id;
        parameters["SID"] = user.sid;

        return this.callWs(apiMethod, parameters, httpMethod, authenticated);
    }

    private async callWs(apiMethod: string, parameters: {[index: string]: any} = {},
                   httpMethod: RequestMethod = RequestMethod.Get,
                   authenticated: boolean = true): Promise<any>
    {
        if (authenticated)
        {
            parameters["uzivatelWS"] = this.username;
            parameters["hesloWS"] = this.password;
        }

        let urlParams: URLSearchParams = new URLSearchParams();
        let body: string = "";

        if (httpMethod === RequestMethod.Get)
        {
            _.keys(parameters).forEach((key: string) => urlParams.append(key, parameters[key]));
        }
        else
        {
            body = JSON.stringify(parameters);
        }

        let response: Response = await this.http.request(this.url + "/" + apiMethod, new RequestOptions({
            method: httpMethod,
            search: urlParams,
            body: body,
            headers: new Headers({
                "Accept":       "application/json",
                "Content-Type": "application/json; charset=utf-8"
            })
        })).toPromise();

        let data: any = this.transformResponse(apiMethod, response);
        this.checkError(data);
        return data;
    }

    private transformResponse(apiMethod: string, response: Response): any
    {
        let object: any = response.json();
        let resultKey: string = apiMethod + "Result";

        if (_.has(object, resultKey))
        {
            let result = object[resultKey];
            delete object[resultKey];
            object[StravneS5Client.RESULT_KEY] = result;
        }

        return object;
    }

    private checkError(data: any)
    {
        let errorCode: number = parseInt(data[StravneS5Client.RESULT_KEY], 10);
        if (errorCode !== 0)
        {
            let errorString: string = "";
            if (_.has(data, "textChyby"))
            {
                errorString = data["textChyby"];
            }

            throw new WsError(errorCode, errorString);
        }
    }
}
