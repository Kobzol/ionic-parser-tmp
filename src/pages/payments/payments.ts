import {Component} from "@angular/core";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {Payment} from "../../app/lib/orders/payment";
import {SessionService} from "../../app/lib/session/session-service";
import {NumberUtil} from "../../app/lib/util/number-util";

@Component({
    templateUrl: "payments.html"
})
export class PaymentsPage extends Page
{
    public payments: Payment[] = null;

    constructor(analyticsService: AnalyticsService,
                private session: SessionService,
                private numberUtil: NumberUtil)
    {
        super(analyticsService);
    }

    ionViewWillEnter()
    {
        this.loadPayments();
    }

    getTitle(): string
    {
        return "Platby";
    }

    private async loadPayments()
    {
        this.payments = await this.session.data.apiClient.getPayments(this.session.data.user);
    }
}
