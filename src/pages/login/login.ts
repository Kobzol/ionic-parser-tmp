import {Component, ChangeDetectorRef, OnDestroy} from "@angular/core";
import {StravneS4Client} from "../../app/lib/ws/stravne-s4-client";
import {StravneS5Client} from "../../app/lib/ws/stravne-s5-client";
import {SessionService} from "../../app/lib/session/session-service";
import {User} from "../../app/lib/user/user";
import {OrdersPage} from "../orders/orders";
import {SessionData} from "../../app/lib/session/session-data";
import {Canteen} from "../../app/lib/orders/canteen";
import {OverlayController} from "../../app/ui/overlay-controller";
import {NavigationController} from "../../app/ui/navigation-controller";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {UserStorage} from "../../app/lib/storage/user-storage";
import {Account} from "../../app/lib/account/account";
import {CanteenListPage} from "../canteen-list/canteen-list";
import {NetworkManager} from "../../app/lib/util/network-manager";
import {Subscription} from "rxjs/Rx";

@Component({
    templateUrl: "login.html"
})
export class LoginPage extends Page implements OnDestroy
{
    public form: {canteen: string, username: string, password: string, remember: boolean} = {
        canteen: "",
        username: "",
        password: "",
        remember: false
    };
    private canteenSelection: {canteen: Canteen} = {canteen: null};    // TODO: pop navparams
    private connectionSubscription: Subscription = null;

    constructor(private stravneS4Client: StravneS4Client,
                private stravneS5Client: StravneS5Client,
                private session: SessionService,
                private navCtrl: NavigationController,
                private uiCtrl: OverlayController,
                public userStorage: UserStorage,
                private networkManager: NetworkManager,
                private changeDetector: ChangeDetectorRef,
                analyticsService: AnalyticsService)
    {
        super(analyticsService);

        this.loadFormAccount();

        this.connectionSubscription = this.networkManager.onConnectionChange().subscribe(
            (value: boolean) => this.refresh()
        );
    }

    ionViewWillEnter()
    {
        if (this.canteenSelection.canteen !== null)
        {
            this.form.canteen = this.canteenSelection.canteen.id;
            this.canteenSelection.canteen = null;
        }
    }

    ngOnDestroy()
    {
        this.connectionSubscription.unsubscribe();
        this.connectionSubscription = null;
    }

    public getTitle(): string
    {
        return "Přihlášení";
    }

    async onLoginFormSubmit(event: Event)
    {
        event.preventDefault();

        let {canteen, username, password, remember} = this.form;

        if (remember)
        {
            this.saveAccountDetails(canteen, username, password);
        }

        this.loginUser(canteen, username, password);
    }
    private async loginUser(canteenId: string, username: string, password: string)
    {
        await this.uiCtrl.showLoading("Počkejte prosím").display;

        try
        {
            let canteen: Canteen = await this.stravneS4Client.getCanteen(canteenId);

            let user: User = await this.stravneS5Client.logInUser(canteen, username, password);

            await this.uiCtrl.hideLoading();
            this.session.startSession(new SessionData(user, this.stravneS5Client));
            await this.navCtrl.changePage(OrdersPage, true);
        }
        catch (err)
        {
            if (!err.message || err.message.length === 0)
            {
                err.message = "Vyskytla se chyba při přihlašování";
            }

            await this.uiCtrl.hideLoading();
            // TODO: map error codes to strings
            await this.uiCtrl.showToast(err.message);
        }
    }

    async goToCanteenList()
    {
        await this.navCtrl.changePage(CanteenListPage, false, {
            [CanteenListPage.CANTEEN_PARAM_KEY]: this.canteenSelection
        });
    }

    shouldShowOfflineOrders(): boolean
    {
        return !this.networkManager.isOnline() && this.userStorage.storedOrders.length > 0;
    }
    async showOfflineOrders()
    {
        await this.navCtrl.changePage(OrdersPage, true, {
            [OrdersPage.OFFLINE_ORDERS_KEY]: true
        });
    }

    public loadFormAccount()
    {
        let account: Account = this.userStorage.localAccounts[this.userStorage.activeLocalAccount];
        this.form = {
            canteen:    account.canteen,
            username:   account.username,
            password:   account.password,
            remember:   false
        };
    }

    private refresh()
    {
        this.changeDetector.detectChanges();
    }

    selectAccount(accountIndex: number)
    {
        this.userStorage.activeLocalAccount = accountIndex;
        let account: Account = this.userStorage.localAccounts[accountIndex];

        this.form.canteen = account.canteen;
        this.form.username = account.username;
        this.form.password = account.password;
    }

    private saveAccountDetails(canteen: string, username: string, password: string)
    {
        let accounts: Account[] = this.userStorage.localAccounts;
        let account: Account = accounts[this.userStorage.activeLocalAccount];
        account.canteen = canteen;
        account.username = username;
        account.password = password;

        this.userStorage.localAccounts = accounts;
    }
}
