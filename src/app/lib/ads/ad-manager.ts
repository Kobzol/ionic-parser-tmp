import {Injectable} from "@angular/core";
import {AdMob} from "ionic-native/dist/index";
import {PlatformManager} from "../util/platform-manager";
import {UserStorage} from "../storage/user-storage";

@Injectable()
export class AdManager
{
    constructor(private platformManager: PlatformManager,
                private userStorage: UserStorage)
    {

    }

    public removeExistingBanner()
    {
        AdMob.removeBanner();
    }

    public showBottomBanner(id: string)
    {
        if (!this.platformManager.isBrowser() && !this.userStorage.billingAdsRemoved)
        {
            AdMob.createBanner({
                adId: id,
                isTesting: true,    // TODO
                position: 8,        // bottom center
                autoShow: true
            });
            AdMob.hideBanner();
        }
    }
}
