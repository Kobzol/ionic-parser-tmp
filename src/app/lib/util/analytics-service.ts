import {Injectable} from "@angular/core";
import {GoogleAnalytics} from "ionic-native/dist/index";
import {Subject} from "rxjs/Rx";
import {PlatformManager} from "./platform-manager";

@Injectable()
export class AnalyticsService
{
    private trackerSubject: Subject<any> = new Subject<any>();

    constructor(private analyticsId: string,
                private platformManager: PlatformManager)
    {

    }

    public async initialize(): Promise<void>
    {
        if (this.platformManager.isBrowser())
        {
            return;
        }

        await GoogleAnalytics.startTrackerWithId(this.analyticsId);
        this.trackerSubject.complete();
        GoogleAnalytics.enableUncaughtExceptionReporting(true);
    }

    public trackView(title: string)
    {
        this.trackerSubject.subscribe({
            complete: () => GoogleAnalytics.trackView(title)
        });
    }

    public trackEvent(category: string, action: string, label: string = "", value: number = 0)
    {
        this.trackerSubject.subscribe({
            complete: () =>  GoogleAnalytics.trackEvent(category, action, label, value)
        });
    }
}
