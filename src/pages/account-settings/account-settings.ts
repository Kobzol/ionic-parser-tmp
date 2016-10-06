import {Component} from "@angular/core";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {Page} from "../page";
import {UserSettings} from "../../app/lib/user/user-settings";
import {SessionService} from "../../app/lib/session/session-service";
import {OverlayController} from "../../app/ui/overlay-controller";

// TODO: change to @angular/forms?
@Component({
    templateUrl: "account-settings.html"
})
export class AccountSettingsPage extends Page
{
    public userSettings: UserSettings = null;
    public requestLoading: boolean = false;

    constructor(analyticsService: AnalyticsService,
                private session: SessionService,
                private uiCtrl: OverlayController)
    {
        super(analyticsService);
    }

    ionViewDidLoad()
    {
        this.loadUserSettings();
    }

    getTitle(): string
    {
        return "Nastavení účtu";
    }

    async saveUserSettings()
    {
        try
        {
            this.requestLoading = true;
            await this.session.data.apiClient.saveUserSettings(this.session.data.user, this.userSettings);
            this.uiCtrl.showToast("Údaje byly uloženy");
        }
        catch (err)
        {
            this.uiCtrl.showToast(err.message);
        }

        this.requestLoading = false;
    }

    trackByIndex(index: number, value: boolean): number
    {
        return index;
    }

    changePassword(password: string)
    {
        if (password !== "")
        {
            this.userSettings.password = password;
        }
    }

    getEmailSettingLabel(index: number): string
    {
        return [
            "Potvrzení objednávky",
            "Měsíční přehled",
            "Neodebraná strava",
            "Spotřební koš",
            "Došlá platba"
        ][index];
    }

    private async loadUserSettings()
    {
        this.userSettings = await this.session.data.apiClient.getUserSettings(this.session.data.user);
    }
}
