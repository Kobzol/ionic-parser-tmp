import {Injectable} from "@angular/core";
import {TranslateManager} from "./translate-manager";
import moment from "moment";
import _ from "lodash";

@Injectable()
export class DateUtil
{
    // TODO: switch to JSON file
    private static DAY_NAMES: any = {
        "cs": ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"],
        "sk": ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"],
        "en": ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    };

    constructor(private translateManager: TranslateManager)
    {
        translateManager.subscribeToLocaleChange((locale: string) => this.setLanguage(locale));
        for (let key of _.keys(DateUtil.DAY_NAMES))
        {
            moment.updateLocale(key, {
                weekdays: DateUtil.DAY_NAMES[key]
            });
        }
    }

    public setLanguage(locale: string)
    {
        moment.locale(locale);
    }

    public format(date: Date, format: string): string
    {
        return moment(date).format(format);
    }

    public isSameDay(date1: Date, date2: Date): boolean
    {
        return moment(date1).isSame(date2, "day");
    }
}
