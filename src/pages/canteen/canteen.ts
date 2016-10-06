import {Component} from "@angular/core";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {Canteen} from "../../app/lib/orders/canteen";
import {SessionService} from "../../app/lib/session/session-service";

@Component({
  templateUrl: "canteen.html",
})
export class CanteenPage extends Page
{
    public canteen: Canteen = null;

    constructor(analyticsService: AnalyticsService,
                private sessionService: SessionService)
    {
        super(analyticsService);
    }

    getTitle(): string
    {
        return "Jídelna";
    }

    ionViewDidLoad()
    {
        this.canteen = this.sessionService.data.user.canteen;
    }

    normalizeUrl(url: string): string
    {
        if (!/^(http|https)/.test(url))
        {
            url = "http://" + url;
        }

        return url;
    }
}
