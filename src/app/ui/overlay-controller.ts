import {Injectable} from "@angular/core";
import {
    Toast, Loading, LoadingController, ToastController, PopoverController,
    PopoverOptions, Popover, ModalController, Modal, ActionSheetController, ActionSheet, Alert, AlertController,
    AlertInputOptions, NavController, App, ViewController
} from "ionic-angular";
import _ from "lodash";
import {Toast as NativeToast} from "ionic-native";
import {PlatformManager} from "../lib/util/platform-manager";

export interface OverlayPromise
{
    display: Promise<any>;
    dismiss: Promise<any>;
}

@Injectable()
export class OverlayController
{
    private loader: Loading = null;
    private popover: Popover = null;
    private modal: Modal = null;
    private actionSheet: ActionSheet = null;
    private alert: Alert = null;
    private toast: Toast = null;

    constructor(private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private popoverCtrl: PopoverController,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                private alertCtrl: AlertController,
                private platformManager: PlatformManager,
                private app: App)
    {

    }

    get nav(): NavController
    {
        return this.app.getActiveNav();
    }

    public isOverlayShown()
    {
        return this.getActiveOverlay() !== null;
    }
    public async hideOverlay(): Promise<any>
    {
        if (this.isOverlayShown())
        {
            await this.getActiveOverlay().dismiss();
        }
    }

    public showLoading(text: string): OverlayPromise
    {
        this.loader = this.loadingCtrl.create({
            content: text
        });

        return this.present(this.loader);
    }
    public async hideLoading(): Promise<any>
    {
        if (this.loader !== null)
        {
            await this.loader.dismiss();
            this.loader = null;
        }

        return Promise.resolve();
    }

    public showPopover(component: any, data: any = {}, options: PopoverOptions = {}, event: Event = null): OverlayPromise
    {
        if (!_.has(options, "cssClass"))
        {
            options["cssClass"] = "orders-popover"; // TODO
        }

        this.popover = this.popoverCtrl.create(component, data, options);
        return this.present(this.popover);
    }
    public async hidePopover(): Promise<any>
    {
        if (this.popover !== null)
        {
            await this.popover.dismiss();
            this.popover = null;
        }

        return Promise.resolve();
    }

    public showModal(component: any, data: any = {}): OverlayPromise
    {
        this.modal = this.modalCtrl.create(component, data);
        return this.present(this.modal);
    }
    public async hideModal(): Promise<any>
    {
        if (this.modal !== null)
        {
            await this.modal.dismiss();
            this.modal = null;
        }

        return Promise.resolve();
    }

    public showActionSheet(title: string, buttons: any[]): OverlayPromise
    {
        this.actionSheet = this.actionSheetCtrl.create({
                title: title,
                buttons: buttons,
                enableBackdropDismiss: true
            });

        return this.present(this.actionSheet);
    }
    public async hideActionSheet(): Promise<any>
    {
        if (this.actionSheet !== null)
        {
            await this.actionSheet.dismiss();
            this.actionSheet = null;
        }

        return Promise.resolve();
    }

    public showAlert(title: string, message: string, buttons: any[] = [], inputs: AlertInputOptions[] = []): OverlayPromise
    {
        this.alert = this.alertCtrl.create({
            title: title,
            message: message,
            inputs: inputs,
            buttons: buttons,
            enableBackdropDismiss: true
        });

        return this.present(this.alert);
    }
    public async hideAlert(): Promise<any>
    {
        if (this.alert != null)
        {
            await this.alert.dismiss();
            this.alert = null;
        }

        return Promise.resolve();
    }

    // TODO: solve browser/device with DI
    // TODO: report toast/actionsheet bug
    public showToast(text: string, duration: number = 2000): OverlayPromise
    {
        if (text.length === 0)
        {
            return this.successPromise();
        }

        if (this.platformManager.isBrowser())
        {
            this.toast = this.toastCtrl.create({
                message: text,
                duration: duration
            });

            return this.present(this.toast);
        }
        else
        {
            NativeToast.show(text, duration.toString(), "bottom").toPromise();
            return this.successPromise();
        }
    }
    public async hideToast(): Promise<any>
    {
        if (this.platformManager.isBrowser())
        {
            if (this.toast !== null)
            {
                await this.toast.dismiss();
                this.toast = null;
            }

            return Promise.resolve();
        }
        else return NativeToast.hide();
    }

    private present(view: any): OverlayPromise
    {
        return {
            display: view.present({
                animate: true,
                duration: 300
            }),
            dismiss: new Promise((resolve, reject) => view.onDidDismiss((data: any) => resolve(data)))
        };
    }

    // TODO: isActive/getActive
    private getActiveOverlay(): ViewController
    {
        if (this.nav.isActive(this.popover))
        {
            return this.popover;
        }
        else if (this.nav.isActive(this.actionSheet))
        {
            return this.actionSheet;
        }
        else if (this.nav.isActive(this.alert))
        {
            return this.alert;
        }
        else if (this.nav.isActive(this.modal))
        {
            return this.modal;
        }

        return null;
    }

    private successPromise(): OverlayPromise
    {
        return {
            display: Promise.resolve(),
            dismiss: Promise.resolve()
        };
    }
}
