import {AnalyticsService} from "../app/lib/util/analytics-service";

export abstract class Page
{
    constructor(private _analyticsService: AnalyticsService)
    {

    }

    protected get analyticsService(): AnalyticsService
    {
        return this._analyticsService;
    }

    public abstract getTitle(): string;

    ionViewDidLoad()
    {
        this.analyticsService.trackView(this.getTitle());
    }
}
