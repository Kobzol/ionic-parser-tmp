import {Injectable} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Globalization} from "ionic-native/dist/index";
import {Subject} from "rxjs/Rx";
import _ from "lodash";

@Injectable()
export class TranslateManager
{
    public static Languages: any = {
        Czech:      "cs",
        Slovak:     "sk",
        English:    "en"
    };

    private _language: string = TranslateManager.Languages.Czech;
    private _onLocaleChanged: Subject<string> = new Subject<string>();

    constructor(private translateService: TranslateService)
    {
        translateService.setDefaultLang(this.language);
    }

    get language(): string
    {
        return this._language;
    }
    set language(value: string)
    {
        this._language = value;
        this.translateService.use(value);
        this._onLocaleChanged.next(value);
    }

    public subscribeToLocaleChange(callback: (locale: string) => void)
    {
        this._onLocaleChanged.subscribe((value: string) => callback(value));
    }

    public async getDeviceLanguage(): Promise<string>
    {
        let deviceLang: {value: string} = await Globalization.getPreferredLanguage();
        let foundLanguage: string = _.find(<string[]>_.values(TranslateManager.Languages), (lang: string) => {
            return deviceLang.value.startsWith(lang);
        });

        if (foundLanguage === undefined)
        {
            foundLanguage = null;
        }

        return foundLanguage;
    }
}
