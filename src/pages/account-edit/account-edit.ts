import {Component} from "@angular/core";
import {Account} from "../../app/lib/account/account";
import {NavParams} from "ionic-angular/index";
import {UserStorage} from "../../app/lib/storage/user-storage";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";

// TODO: rework to @angular/forms
@Component({
    templateUrl: "account-edit.html"
})
export class AccountEditPage extends Page
{
    public static KEY_ACCOUNTS: string = "accounts";

    public accounts: Account[] = [];
    public selectedAccountIndex: number = 0;

    constructor(navParams: NavParams,
                analyticsService: AnalyticsService,
                private userStorage: UserStorage)
    {
        super(analyticsService);
        this.accounts = <Account[]>navParams.get(AccountEditPage.KEY_ACCOUNTS);
    }

    getTitle(): string
    {
        return "Správa uživatelských účtů";
    }

    ionViewDidLeave()
    {
        if (this.accounts && this.accounts.length > 0)
        {
            this.userStorage.localAccounts = this.accounts;
        }
    }

    get selectedAccount(): Account
    {
        return this.accounts[Number(this.selectedAccountIndex)];
    }
}
