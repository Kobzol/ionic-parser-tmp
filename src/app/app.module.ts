// Modules
import {NgModule, APP_INITIALIZER} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Http, HttpModule} from "@angular/http";

// App
import {Application} from "./app.component";

// Pages
import {AccountEditPage} from "../pages/account-edit/account-edit";
import {AccountSettingsPage} from "../pages/account-settings/account-settings";
import {CanteenPage} from "../pages/canteen/canteen";
import {CanteenListPage} from "../pages/canteen-list/canteen-list";
import {IssuesPage} from "../pages/issues/issues";
import {LocalSettingsPage} from "../pages/local-settings/local-settings";
import {LoginPage} from "../pages/login/login";
import {OrdersPage} from "../pages/orders/orders";
import {PaymentsPage} from "../pages/payments/payments";

// Components
import {FoodComponent} from "./components/food/food.component";
import {FoodListComponent} from "./components/food-list/food-list";
import {FoodProductsComponent} from "./components/products/food-products.component";
import {FoodDetailsComponent} from "./components/details/food-details.component";
import {IssueLocationsComponent} from "./components/issue-locations/issue-locations.component";
import {DietsComponent} from "./components/diets/diets.component";

// Services
import {BillingManager} from "./lib/billing/billing-manager";
import {TodayLunchService} from "./lib/today-lunch/today-lunch";
import {UserStorage} from "./lib/storage/user-storage";
import {StorageService} from "./lib/storage/storage-service";
import {PlatformManager} from "./lib/util/platform-manager";
import {AnalyticsService} from "./lib/util/analytics-service";
import {Settings} from "./settings";
import {AdManager} from "./lib/ads/ad-manager";
import {NetworkManager} from "./lib/util/network-manager";
import {StravneS5Adapter} from "./lib/ws/stravne-s5-adapter";
import {XmlConverter} from "./lib/util/xml-converter";
import {OverlayController} from "./ui/overlay-controller";
import {NavigationController} from "./ui/navigation-controller";
import {OrderManager} from "./lib/orders/order-manager";
import {SessionService} from "./lib/session/session-service";
import {NumberUtil} from "./lib/util/number-util";
import {DateUtil} from "./lib/util/date-util";
import {TranslateManager} from "./lib/util/translate-manager";
import {MoneyPipe} from "./pipes/money.pipe";
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from "ng2-translate";
import {StravneS4Client} from "./lib/ws/stravne-s4-client";
import {StravneS5Client} from "./lib/ws/stravne-s5-client";
import {Storage} from "@ionic/storage";

// initialization
export function preInitializeApp(userStorage: UserStorage): () => Promise<any>
{
    return () =>
    {
        return userStorage.initialize();
    };
}

// provide functions
export function createAnalyticsService(platformManager: PlatformManager): AnalyticsService
{
    return new AnalyticsService(Settings.GOOGLE_ANALYTICS_ID, platformManager);
}
export function createTranslateLoader(http: Http): TranslateLoader
{
    return new TranslateStaticLoader(http, "assets/lang", ".json");
}
export function createStravneS4Client(http: Http, xmlConverter: XmlConverter): StravneS4Client
{
    return new StravneS4Client(http, xmlConverter, Settings.WS_S4_URL, Settings.WS_S4_USER, Settings.WS_S4_PASSWORD);
}
export function createStravneS5Client(http: Http, adapter: StravneS5Adapter, dateUtil: DateUtil): StravneS5Client
{
    return new StravneS5Client(http, adapter, dateUtil, Settings.WS_S5_URL, Settings.WS_S5_USER, Settings.WS_S5_PASSWORD);
}

const modules = [
    IonicModule.forRoot(Application),
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule
];
const pages = [
    AccountEditPage,
    AccountSettingsPage,
    CanteenPage,
    CanteenListPage,
    IssuesPage,
    LocalSettingsPage,
    LoginPage,
    OrdersPage,
    PaymentsPage
];
const components = [
    FoodComponent,
    FoodDetailsComponent,
    FoodListComponent,
    FoodProductsComponent,
    IssueLocationsComponent,
    DietsComponent
];
const pipes = [
    MoneyPipe
];
const providers = [
    {
        provide: StravneS4Client,
        useFactory: createStravneS4Client,
        deps: [Http, XmlConverter],
    },
    {
        provide: StravneS5Client,
        useFactory: createStravneS5Client,
        deps: [Http, StravneS5Adapter, DateUtil]
    },
    TranslateManager,
    DateUtil,
    NumberUtil,
    SessionService,
    OrderManager,
    NavigationController,
    OverlayController,
    XmlConverter,
    StravneS5Adapter,
    PlatformManager,
    NetworkManager,
    AdManager,
    {
        provide: AnalyticsService,
        useFactory: createAnalyticsService,
        deps: [PlatformManager]
    },
    Storage,
    StorageService,
    UserStorage,
    {
        provide: APP_INITIALIZER,
        useFactory: preInitializeApp,
        deps: [UserStorage],
        multi: true
    },
    TodayLunchService,
    BillingManager
];


@NgModule({
    declarations: [
        Application,
        ...pages,
        ...components,
        ...pipes
    ],
    imports: modules,
    bootstrap: [IonicApp],
    entryComponents: [
        ...pages,
        ...components
    ],
    providers: providers
})
export class AppModule {}
