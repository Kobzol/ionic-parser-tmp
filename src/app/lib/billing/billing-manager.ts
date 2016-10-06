import {Injectable} from "@angular/core";
import {PlatformManager} from "../util/platform-manager";

declare var store: any;

@Injectable()
export class BillingManager
{
    private static REMOVE_AD_ID: string = "reklama_odstraneni";

    constructor(private platformManager: PlatformManager)
    {

    }

    public initialize(): Promise<void>
    {
        if (this.platformManager.isBrowser())
        {
            return Promise.resolve();
        }

        store.register({
            id: BillingManager.REMOVE_AD_ID,
            alias: "",
            type: store.PAID_SUBSCRIPTION
        });

        store.refresh();

        return new Promise<void>((resolve, reject) => {
            store.ready(() => {
                resolve();
            });
        });
    }

    public orderAdRemoval(): Promise<void>
    {
        store.order(BillingManager.REMOVE_AD_ID);

        return new Promise<void>((resolve, reject) => {
            store.when(BillingManager.REMOVE_AD_ID).approved((p: any) => {
                console.log("IAP APPROVED: " + JSON.stringify(p));
                p.finish();
                resolve();
            });
            store.when(BillingManager.REMOVE_AD_ID).cancelled((p: any) => {
                console.log("IAP CANCELLED");
                reject();
            });
            store.when(BillingManager.REMOVE_AD_ID).error((error: any) => {
                console.log("IAP ERROR: " + JSON.stringify(error));
                reject(error);
            });

        });
    }

    public shouldRemoveAdds(): boolean
    {
        if (this.platformManager.isBrowser())
        {
            return true;
        }

        return store.get(BillingManager.REMOVE_AD_ID).owned;
    }
}
