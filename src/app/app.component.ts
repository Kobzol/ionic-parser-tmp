import {Component} from "@angular/core";
import {Platform, MenuController} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {LoginPage} from "../pages/login/login";
import {SessionService} from "./lib/session/session-service";
import {MenuEntry} from "./ui/menu-entry";
import {OrdersPage} from "../pages/orders/orders";
import {NavigationController} from "./ui/navigation-controller";
import {AnalyticsService} from "./lib/util/analytics-service";
import {LocalSettingsPage} from "../pages/local-settings/local-settings";
import {UserStorage} from "./lib/storage/user-storage";
import {TodayLunchService} from "./lib/today-lunch/today-lunch";
import {BillingManager} from "./lib/billing/billing-manager";
import {AdManager} from "./lib/ads/ad-manager";
import {PaymentsPage} from "../pages/payments/payments";
import {IssuesPage} from "../pages/issues/issues";
import {PlatformManager} from "./lib/util/platform-manager";
import {TranslateManager} from "./lib/util/translate-manager";
import {CanteenPage} from "../pages/canteen/canteen";
import {OverlayController} from "./ui/overlay-controller";
import {User} from "./lib/user/user";
import {Account} from "./lib/account/account";
import {AccountSettingsPage} from "../pages/account-settings/account-settings";
import {NumberUtil} from "./lib/util/number-util";
import moment from "moment";

@Component({
  templateUrl: "app.component.html",
  selector: "ion-app"
})
export class Application
{
  public rootPage: any = LoginPage;
  public menuEntries: MenuEntry[];

  constructor(platform: Platform,
              private translateManager: TranslateManager,
              private menu: MenuController,
              private session: SessionService,
              private navController: NavigationController,
              private analyticsService: AnalyticsService,
              private userStorage: UserStorage,
              private todayLunchService: TodayLunchService,
              private billingManager: BillingManager,
              private adManager: AdManager,
              private platformManager: PlatformManager,
              private uiCtrl: OverlayController,
              private numberUtil: NumberUtil)
  {
    translateManager.language = userStorage.language;
    this.menuEntries = this.createMenuEntries();
    this.initializeApp(platform);

    if (userStorage.firstLaunch)
    {
      this.handleFirstLaunch();
      userStorage.firstLaunch = false;
    }

    this.platformManager.registerBackButtonAction(() => {
      this.handleBackButton();
    });
  }

  private createMenuEntries(): MenuEntry[]
  {
    return [
      new MenuEntry("Přihlásit se",
          () => this.changePage(LoginPage),
          () => !this.session.isActive(),
          "log-in"
      ),
      new MenuEntry("Objednávky",
          () => this.changePage(OrdersPage),
          () => this.session.isActive(),
          "pizza"
      ),
      new MenuEntry("Informace",
          async () =>
          {
            await this.menu.close();
            this.showAccountDetails();
          },
          () => this.session.isActive(),
          "information-circle"
      ),
      new MenuEntry("Platby",
          () => this.changePage(PaymentsPage),
          () => this.session.isActive(),
          "card"
      ),
      new MenuEntry("Výdej",
          () => this.changePage(IssuesPage),
          () => this.session.isActive(),
          "clipboard"
      ),
      new MenuEntry("Jídelna",
          () => this.changePage(CanteenPage),
          () => this.session.isActive(),
          "home"
      ),
      new MenuEntry("Nastavení účtu",
          () => this.changePage(AccountSettingsPage),
          () => this.session.isActive(),
          "person"
      ),
      new MenuEntry("Nastavení aplikace",
          () => this.changePage(LocalSettingsPage),
          () => true,
          "settings"
      ),
      new MenuEntry("Odstranit reklamy",
          async () => {
            try
            {
              await this.billingManager.orderAdRemoval();
              this.userStorage.billingAdsRemoved = true;
              this.adManager.removeExistingBanner();
            }
            catch (err)
            {

            }
          },
          () => !this.userStorage.billingAdsRemoved && !this.platformManager.isBrowser(),
          "unlock"
      ),
      new MenuEntry("Odhlásit se",
          () => this.logOut(),
          () => this.session.isActive(),
          "log-out"
      )
    ];
  }

  private async showAccountDetails()
  {
    let date: string = moment(this.session.data.user.userData.updateDate).format("D. M. YYYY HH:mm:ss");
    let user: User = this.session.data.user;
    let account: Account = this.userStorage.localAccounts[this.userStorage.activeLocalAccount];

    // TODO: měna
    let details = `
            Název profilu: ${account.name}<br />
            Přihlášený uživatel: ${user.username}<br />
            Jméno: ${user.userData.fullName}<br />
            Variabilní symbol: ${user.userData.variableSymbol}<br />
            Číslo jídelny: ${user.canteen.id}<br />
            Stav konta: ${this.numberUtil.formatMoney(user.balance)}<br />
            Datum aktualizace: ${date}
        `;

    await this.uiCtrl.showAlert("Informace", details, ["Zavřít"]).display;
  }

  getMenuHeader(): string
  {
    return this.session.isActive() ? this.session.data.user.userData.fullName : "Strava5.cz";
  }

  private async initializeApp(platform: Platform)
  {
    await platform.ready();

    if (!this.platformManager.isBrowser())
    {
      StatusBar.styleDefault();
      Splashscreen.hide();

      await this.analyticsService.initialize();
      this.todayLunchService.initialize();

      await this.billingManager.initialize();
      this.userStorage.billingAdsRemoved = this.billingManager.shouldRemoveAdds();
    }
  }

  private async changePage(page: any)
  {
    await this.menu.close();
    await this.navController.changePage(page);
  }
  private async logOut()
  {
    this.session.data.apiClient.logOutUser(this.session.data.user);
    this.session.endSession();
    await this.menu.close();
    await this.navController.changePage(LoginPage, true);
  }

  private async handleFirstLaunch()
  {
    if (this.platformManager.isBrowser())
    {
      return;
    }

    // TODO show help
    // TODO: language API call
    let lang: string = await this.translateManager.getDeviceLanguage();
    if (lang !== null)
    {
      this.translateManager.language = lang;
      this.userStorage.language = lang;
    }
  }

  private handleBackButton()
  {
    if (this.menu.isOpen())
    {
      this.menu.close();
    }
    else
    {
      let activeNav = this.uiCtrl.nav;
      if (activeNav)
      {
        if (activeNav.length() === 1)
        {
          if (this.navController.isRoot(OrdersPage))
          {
            this.logOut();
          }
          else this.platformManager.exitApp();
        }
        else
        {
          this.navController.popAll();
        }
      }
    }
  }
}
