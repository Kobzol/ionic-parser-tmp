import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular/index";

@Injectable()
export class PlatformManager
{
    constructor(private platform: Platform)
    {

    }

    public isBrowser(): boolean
    {
        return this.platform.is("core");
    }

    public registerBackButtonAction(fn: () => any)
    {
        this.platform.registerBackButtonAction(fn);
    }

    public exitApp()
    {
        this.platform.exitApp();
    }
}
