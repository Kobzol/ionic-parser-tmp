import {Injectable} from "@angular/core";
import {StorageService} from "./storage-service";
import {DefaultLocalSettings} from "../../settings";
import {JsonSerializer} from "./serialization/json-serializer";
import {Serializer} from "./serialization/serializer";
import {Account} from "../account/account";
import {AccountSerializer} from "./serialization/account-serializer";
import {ArraySerializer} from "./serialization/array-serializer";
import {StorageKeys} from "./storage-keys";
import {TodayLunchAlertOptions} from "../today-lunch/alert-options";

@Injectable()
export class UserStorage
{
    constructor(private storage: StorageService)
    {

    }

    get firstLaunch(): boolean
    {
        return this.load<boolean>(StorageKeys.FIRST_LAUNCH);
    }
    set firstLaunch(value: boolean)
    {
        this.store<boolean>(StorageKeys.FIRST_LAUNCH, value);
    }

    get todayLaunchEnabled(): boolean
    {
        return this.load<boolean>(StorageKeys.TODAY_LUNCH_ENABLED);
    }
    set todayLaunchEnabled(value: boolean)
    {
        this.store<boolean>(StorageKeys.TODAY_LUNCH_ENABLED, value);
    }

    get todayLaunchTime(): string
    {
        return this.load<string>(StorageKeys.TODAY_LUNCH_TIME);
    }
    set todayLaunchTime(value: string)
    {
        this.store<string>(StorageKeys.TODAY_LUNCH_TIME, value);
    }

    get todayLaunchAlertOptions(): TodayLunchAlertOptions
    {
        return this.load<TodayLunchAlertOptions>(StorageKeys.TODAY_LUNCH_ALERT_OPTIONS);
    }
    set todayLaunchAlertOptions(value: TodayLunchAlertOptions)
    {
        this.store<TodayLunchAlertOptions>(StorageKeys.TODAY_LUNCH_ALERT_OPTIONS, value);
    }

    get storedOrders(): any
    {
        return this.load<any[]>(StorageKeys.ORDERS_STORED);
    }
    set storedOrders(value: any)
    {
        this.store<any[]>(StorageKeys.ORDERS_STORED, value);
    }

    get billingAdsRemoved(): boolean
    {
        return this.load<boolean>(StorageKeys.BILLING_REMOVE_ADS);
    }
    set billingAdsRemoved(value: boolean)
    {
        this.store<boolean>(StorageKeys.BILLING_REMOVE_ADS, value);
    }

    get localAccounts(): Account[]
    {
        return this.load<Account[]>(StorageKeys.LOCAL_ACCOUNTS_LIST,
            new ArraySerializer(new AccountSerializer()));
    }
    set localAccounts(value: Account[])
    {
        this.store<Account[]>(StorageKeys.LOCAL_ACCOUNTS_LIST, value,
            new ArraySerializer(new AccountSerializer()));
    }

    get activeLocalAccount(): number
    {
        return this.load<number>(StorageKeys.LOCAL_ACCOUNTS_ACTIVE);
    }
    set activeLocalAccount(value: number)
    {
        this.store<number>(StorageKeys.LOCAL_ACCOUNTS_ACTIVE, value);
    }

    get language(): string
    {
        return this.load<string>(StorageKeys.LANGUAGE);
    }
    set language(value: string)
    {
        this.store<string>(StorageKeys.LANGUAGE, value);
    }

    public initialize(): Promise<any>
    {
        return this.storage.preload(Object.keys(DefaultLocalSettings));
    }

    private load<T>(key: string, serializer: Serializer = this.createDefaultSerializer()): T
    {
        let data: string = this.storage.load(key);

        if (data === null)
        {
            return DefaultLocalSettings[key];
        }

        return serializer.deserialize(data);
    }
    private store<T>(key: string, value: T, serializer: Serializer = this.createDefaultSerializer())
    {
        this.storage.store(key, serializer.serialize(value));
    }

    private createDefaultSerializer(): Serializer
    {
        return new JsonSerializer();
    }
}
