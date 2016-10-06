import {Component} from "@angular/core";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {Canteen} from "../../app/lib/orders/canteen";
import {StravneS4Client} from "../../app/lib/ws/stravne-s4-client";
import {NavigationController} from "../../app/ui/navigation-controller";
import {NavParams} from "ionic-angular/index";
import {CanteenGroup} from "./canteen-group";
import _ from "lodash";

@Component({
    templateUrl: "canteen-list.html"
})
export class CanteenListPage extends Page
{
    public static CANTEEN_PARAM_KEY: string = "canteen";

    public groups: CanteenGroup[] = [];
    public filter: string = "";
    private canteenSelection: {canteen: Canteen} = null;

    constructor(analyticsService: AnalyticsService,
                private stravneS4Client: StravneS4Client,
                private navCtrl: NavigationController,
                private navParams: NavParams)
    {
        super(analyticsService);
    }

    public getTitle(): string
    {
        return "Výběr jídelny";
    }

    ionViewWillEnter()
    {
        let selection: {canteen: Canteen} = this.navParams.get(CanteenListPage.CANTEEN_PARAM_KEY);
        if (selection !== undefined)
        {
            this.canteenSelection = selection;
        }
        else throw new Error("No canteen selection provided");

        this.loadCanteens();
    }

    async selectCanteen(canteen: Canteen)
    {
        this.canteenSelection.canteen = canteen;
        await this.navCtrl.pop();
    }
    toggleGroup(canteenGroup: CanteenGroup)
    {
        canteenGroup.toggleVisible();
    }

    matchesFilter(group: CanteenGroup): boolean
    {
        return group.identifier.toLocaleLowerCase().includes(this.filter.toLocaleLowerCase());
    }
    onSearchChange()
    {
        this.groups.forEach((group: CanteenGroup) => group.visible = false);
    }

    private async loadCanteens()
    {
        let canteens: Canteen[] = await this.stravneS4Client.getCanteens();
        this.groups = this.createGroups(canteens);
    }

    private transformCanteens(canteens: Canteen[]): Canteen[]
    {
        canteens = _.filter(canteens, (canteen: Canteen) => canteen.isVisible());

        // TODO: intl polyfill
        let collator: Intl.Collator = new Intl.Collator("cs");
        canteens.sort((l: Canteen, r: Canteen) =>
        {
            let result: number = collator.compare(l.city, r.city);

            if (result === 0)
            {
                return collator.compare(l.name, r.name);
            }
            else return result;
        });

        return canteens;
    }

    private createGroups(canteens: Canteen[])
    {
        canteens = this.transformCanteens(canteens);

        let cityGroups = _.groupBy(canteens, (canteen: Canteen) => canteen.city);
        return _.map(cityGroups, (canteens: Canteen[], city: string) => new CanteenGroup(city, canteens));
    }
}
