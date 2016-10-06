import {Component} from "@angular/core";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {UserStorage} from "../../app/lib/storage/user-storage";
import {TodayLunchService} from "../../app/lib/today-lunch/today-lunch";
import {TranslateManager} from "../../app/lib/util/translate-manager";
import {AccountEditPage} from "../account-edit/account-edit";
import {OverlayController} from "../../app/ui/overlay-controller";
import {TodayLunchAlertOptions} from "../../app/lib/today-lunch/alert-options";
import {NavigationController} from "../../app/ui/navigation-controller";
import _ from "lodash";

@Component({
    templateUrl: "local-settings.html"
})
export class LocalSettingsPage extends Page
{
    constructor(analyticsService: AnalyticsService,
                public userStorage: UserStorage,
                private todayLunchService: TodayLunchService,
                private translateManager: TranslateManager,
                private uiCtrl: OverlayController,
                private navCtrl: NavigationController)
    {
        super(analyticsService);
    }

    getTitle(): string
    {
        return "Nastavení aplikace";
    }

    async showTodayLunchAlertOptionsDialog()
    {
        let options: TodayLunchAlertOptions = this.userStorage.todayLaunchAlertOptions;

        let data: string[] = await this.uiCtrl.showAlert(
            "Upozornění",
            "",
            ["Zavřít"],
            [
                {
                    type: "checkbox",
                    label: "Zvuk",
                    value: "sound",
                    checked: options.sound
                },
                {
                    type: "checkbox",
                    label: "Vibrace",
                    value: "vibrate",
                    checked: options.vibrate
                }
            ]
        ).dismiss;

        for (let key of Object.keys(options))
        {
            options[key] = _.includes(data, key);
        }

        this.userStorage.todayLaunchAlertOptions = options;
    }

    async showAccountPage()
    {
        await this.navCtrl.changePage(AccountEditPage, false, {
            [AccountEditPage.KEY_ACCOUNTS]: this.userStorage.localAccounts
        });
    }

    getLanguages(): string[]
    {
        return <string[]>_.values(TranslateManager.Languages);
    }

    changeLanguage(value: string)
    {
        this.translateManager.language = value;
    }

    todayLaunchTimeChanged()
    {
        this.todayLunchService.reschedule();
    }
}
