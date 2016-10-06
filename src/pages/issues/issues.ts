import {Component} from "@angular/core";
import {Page} from "../page";
import {AnalyticsService} from "../../app/lib/util/analytics-service";
import {SessionService} from "../../app/lib/session/session-service";
import {Issue, IssueType} from "../../app/lib/orders/issue";
import {DateUtil} from "../../app/lib/util/date-util";

@Component({
  templateUrl: "issues.html",
})
export class IssuesPage extends Page
{
    public issues: Issue[] = null;

    constructor(analyticsService: AnalyticsService,
                private session: SessionService,
                private dateUtil: DateUtil)
    {
        super(analyticsService);
    }

    ionViewWillEnter()
    {
        this.loadIssues();
    }

    getTitle(): string
    {
        return "Výdej";
    }

    getIssueLabel(issue: Issue): string
    {
        if (this.isIssued(issue))
        {
            return this.dateUtil.format(issue.issueDate, "hh:mm");
        }
        else return "nevyzvednuto";
    }
    isIssued(issue: Issue): boolean
    {
        return issue.type === IssueType.Issued;
    }

    private loadIssues()
    {
        // this.issues = await this.session.data.apiClient.getIssues(this.session.data.user); TODO
        this.issues = [
            new Issue(new Date(), "oběd", "Kuřecí stehno", "", 1, IssueType.Issued, new Date()),
            new Issue(new Date(), "snídaně", "jogurt", "", 0, IssueType.NotIssued, new Date())
        ];
    }
}
