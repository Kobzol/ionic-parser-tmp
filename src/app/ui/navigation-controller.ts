import {Injectable} from "@angular/core";
import {NavController, App} from "ionic-angular/index";
import {Dictionary} from "lodash";
import {LoginPage} from "../../pages/login/login";

@Injectable()
export class NavigationController
{
    private rootPage: any = LoginPage;

    constructor(private app: App)
    {

    }

    get nav(): NavController
    {
        return this.app.getActiveNav();
    }

    public isRoot(page: any): boolean
    {
        return page === this.rootPage;
    }

    public changePage(page: any, setRoot: boolean = false, params: Dictionary<any> = {}): Promise<any>
    {
        if (this.rootPage === page && !setRoot)
        {
            return Promise.resolve();
        }

        if (setRoot)
        {
            this.rootPage = page;
        }

        return setRoot ? this.nav.setRoot(page, params) : this.nav.push(page, params);
    }

    public pop(params: any = {}): Promise<any>
    {
        return this.nav.pop(params);
    }

    public popAll(): Promise<any>
    {
        return this.app.navPop();
    }
}
