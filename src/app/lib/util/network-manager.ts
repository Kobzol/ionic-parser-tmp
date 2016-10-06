import {Injectable} from "@angular/core";
import {Network} from "ionic-native/dist/index";
import {PlatformManager} from "./platform-manager";
import {Observable} from "rxjs/Rx";

@Injectable()
export class NetworkManager
{
    constructor(private platformManager: PlatformManager)
    {

    }

    get network(): any
    {
        return Network.connection;
    }

    public isOnline(): boolean
    {
        if (this.platformManager.isBrowser()) return true;

        let connection: String = Network.connection;
        return connection !== "unknown" && connection !== "none";
    }

    public onDisconnect(): Observable<void>
    {
        return Network.onDisconnect();
    }
    public onConnect(): Observable<void>
    {
        return Network.onConnect();
    }
    public onConnectionChange(): Observable<boolean>
    {
        return Observable.concat(this.onConnect().map(() => true), this.onDisconnect().map(() => false));
    }
}
