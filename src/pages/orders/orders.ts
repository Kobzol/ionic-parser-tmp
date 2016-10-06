import {Component, OnDestroy} from "@angular/core";
import {SessionService} from "../../app/lib/session/session-service";
import {NavigationController} from "../../app/ui/navigation-controller";
import {FoodGroup} from "../../app/lib/orders/food-group";
import {OverlayController} from "../../app/ui/overlay-controller";
import {LoginPage} from "../login/login";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {AdManager} from "../../app/lib/ads/ad-manager";
import {Settings} from "../../app/settings";
import {NavParams, Refresher} from "ionic-angular/index";
import {OrderManager} from "../../app/lib/orders/order-manager";
import {Subscription} from "rxjs/Rx";
import {Util} from "../../app/lib/util/util";
import {UserStorage} from "../../app/lib/storage/user-storage";

@Component({
    templateUrl: "orders.html"
})
export class OrdersPage extends Page implements OnDestroy
{
    public static OFFLINE_ORDERS_KEY: string = "offline-orders";

    public loadingOrders: boolean = true;
    public requestLoading: boolean = false;
    private requestSubscription: Subscription = null;

    constructor(private session: SessionService,
                private navController: NavigationController,
                private notificationController: OverlayController,
                private navParams: NavParams,
                private orderManager: OrderManager,
                private uiCtrl: OverlayController,
                private userStorage: UserStorage,
                analyticsService: AnalyticsService,
                adManager: AdManager)
    {
        super(analyticsService);
        adManager.showBottomBanner(Settings.AD_ORDERS);

        this.requestSubscription = orderManager.onRequest.subscribe((request: Promise<any>) => {
            this.onRequestStart();
            Util.Finally(request, () => this.onRequestStop());
        });
    }

    get orders(): FoodGroup[]
    {
        return this.orderManager.orders;
    }
    get offline(): boolean
    {
        return this.orderManager.offline;
    }

    async ionViewDidLoad()
    {
        let offlineOrders: boolean = this.navParams.get(OrdersPage.OFFLINE_ORDERS_KEY);
        this.orderManager.offline = offlineOrders !== undefined && offlineOrders;

        if (!this.offline && !this.session.isActive())
        {
            await this.navController.changePage(LoginPage, true);
        }
        else
        {
            this.loadingOrders = true;
            await this.orderManager.loadOrders();
            this.loadingOrders = false;
        }
    }

    ngOnDestroy()
    {
        this.requestSubscription.unsubscribe();
    }

    public getTitle(): string
    {
        return "Objednávky";
    }

    public async saveOrders()
    {
        await this.orderManager.saveOrders();
        await this.notificationController.showToast("Objednávky byly uloženy");
    }

    async onRefresherPull(refresher: Refresher)
    {
        if (this.orderManager.dirty)
        {
            await this.uiCtrl.showAlert("Upozornění",
                "Máte neuložené objednávky. Opravdu chcete objednávku neuložit a znovu načíst?",
                [
                    { text: "Ne", handler: () => refresher.complete() },
                    { text: "Ano", handler: async () => {
                        this.refreshOrders(refresher);
                    }}
                ]
            ).display;
        }
        else
        {
            this.refreshOrders(refresher);
        }
    }

    private async refreshOrders(refresher: Refresher)
    {
        await this.uiCtrl.showToast("Obnovuji objednávky...").display;
        await this.orderManager.reloadOrders();
        refresher.complete();
    }

    private onRequestStart()
    {
        this.requestLoading = true;
    }
    private onRequestStop()
    {
        this.requestLoading = false;
    }
}
