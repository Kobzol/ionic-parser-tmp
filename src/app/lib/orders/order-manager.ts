import {Injectable} from "@angular/core";
import {SessionService} from "../session/session-service";
import {FoodGroup} from "./food-group";
import {Food} from "./food";
import {Product} from "./product";
import {UserStorage} from "../storage/user-storage";
import {StravneS5Adapter} from "../ws/stravne-s5-adapter";
import {Subject} from "rxjs/Rx";
import {ProductChangeInfo} from "./product-change-info";
import _ from "lodash";
import {StravneS5Client} from "../ws/stravne-s5-client";
import {DateUtil} from "../util/date-util";
import {User} from "../user/user";
import {IssueLocation} from "./issue-location";
import {Diet} from "./diet";

@Injectable()
export class OrderManager
{
    private _orders: FoodGroup[] = [];
    private _offline: boolean;
    private _dirty: boolean = false;
    private _requestSubject: Subject<Promise<any>> = new Subject<Promise<any>>();

    constructor(private session: SessionService,
                private adapter: StravneS5Adapter,
                private userStorage: UserStorage,
                private dateUtil: DateUtil)
    {

    }

    get orders(): FoodGroup[]
    {
        return this._orders;
    }
    get offline(): boolean
    {
        return this._offline;
    }
    set offline(value: boolean)
    {
        this._offline = value;
    }
    get dirty(): boolean
    {
        return this._dirty;
    }
    get onRequest(): Subject<Promise<any>>
    {
        return this._requestSubject;
    }

    private getClient(): StravneS5Client
    {
        return this.session.data.apiClient;
    }
    private getUser(): User
    {
        return this.session.data.user;
    }

    public async loadOrders(): Promise<FoodGroup[]>
    {
        if (this.offline)
        {
            this._orders = this.adapter.deserializeOrdersObject(this.userStorage.storedOrders);
        }
        else
        {
            let orders: {foods: FoodGroup[], rawData: any} = await this.getClient().getOrders(this.getUser());
            this._orders = orders.foods;
            this.userStorage.storedOrders = orders.rawData;
        }

        this._dirty = false;

        return this._orders;
    }
    public async reloadOrders(): Promise<FoodGroup[]>
    {
        await this.getClient().initializeDatabase(this.getUser());
        return this.loadOrders();
    }

    public async saveOrders(): Promise<any>
    {
        if (this.offline)
        {
            return Promise.reject(new Error("offline"));
        }

        let promise: Promise<any> = this.getClient().saveOrders(this.getUser());
        this.onRequest.next(promise);

        await promise;
        this._dirty = false;
    }

    public changeFoodOrder(food: Food): Promise<any>
    {
        if (food.canBeChanged())
        {
            let count: number = food.isOrdered() ? 0 : 1;
            return this.changeOrder(this.findGroupByFood(food), food.products[0].id, count);
        }
        else return Promise.reject(new Error("Nelze měnit"));
    }
    public changeProductOrder(food: Food, product: Product): Promise<any>
    {
        if (food.canBeChanged())
        {
            let count: number = product.isOrdered() ? 0 : 1;
            return this.changeOrder(this.findGroupByFood(food), product.id, count);
        }
        else return Promise.reject(new Error("Nelze měnit"));
    }

    public subscribeDay(date: Date): Promise<ProductChangeInfo[]>
    {
        return this.changeDayOrder(date, 1);
    }
    public unsubscribeDay(date: Date)
    {
        return this.changeDayOrder(date, 0);
    }

    public async changeIssueLocation(food: Food, issueLocation: IssueLocation): Promise<any>
    {
        let promise: Promise<any> = this.getClient().changeIssueLocation(this.getUser(), food, issueLocation);
        promise = promise.then((data: any) => {
            food.issueLocationId = issueLocation.id;
            return data;
        });

        this.onRequest.next(promise);
        return promise;
    }
    public async changeDiet(food: Food, diet: Diet): Promise<any>
    {
        let promise: Promise<any> = this.getClient().changeDiet(this.getUser(), food, diet);
        promise = promise.then((data: any) => {
            food.dietId = diet.id;
            return data;
        });

        this.onRequest.next(promise);
        return promise;
    }

    private changeDayOrder(date: Date, count: number): Promise<ProductChangeInfo[]>
    {
        let group: FoodGroup = this.findGroupByDate(date);
        let promise: Promise<ProductChangeInfo[]> = this.getClient().orderDay(this.getUser(), date, count);
        promise = this.updateGroup(promise, group);

        this.onRequest.next(promise);
        return promise;
    }
    private changeOrder(group: FoodGroup, id: string, count: number): Promise<ProductChangeInfo[]>
    {
        let promise: Promise<ProductChangeInfo[]> = this.getClient().orderFood(
            this.getUser(),
            id,
            count
        );

        promise = this.updateGroup(promise, group);

        this.onRequest.next(promise);
        return promise;
    }

    private updateGroup(promise: Promise<ProductChangeInfo[]>, group: FoodGroup): Promise<ProductChangeInfo[]>
    {
        return promise.then((changes: ProductChangeInfo[]) =>
            {
                group.updateFromChanges(changes);
                this._dirty = true;
                return changes;
            }
        );
    }

    private findGroupByFood(food: Food): FoodGroup
    {
        return _.find(this.orders, (group: FoodGroup) => _.includes(group.foods, food));
    }
    private findGroupByDate(date: Date): FoodGroup
    {
        return _.find(this.orders, (group: FoodGroup) => this.dateUtil.isSameDay(group.date, date));
    }
}
