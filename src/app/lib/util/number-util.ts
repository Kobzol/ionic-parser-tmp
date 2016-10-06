import {Injectable} from "@angular/core";
import {TranslateManager} from "./translate-manager";
import numeral from "numeral";

const cs = {
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: "tis.",
        million: "mil.",
        billion: "b",
        trillion: "t"
    },
    ordinal: function () {
        return ".";
    },
    currency: {
        symbol: "Kč"
    }
};
const sk = {
    delimiters: {
        thousands: " ",
        decimal: ","
    },
    abbreviations: {
        thousand: "tis.",
        million: "mil.",
        billion: "b",
        trillion: "t"
    },
    ordinal: function () {
        return ".";
    },
    currency: {
        symbol: "€"
    }
};

@Injectable()
export class NumberUtil
{
    constructor(private translateManager: TranslateManager)
    {
        translateManager.subscribeToLocaleChange((locale: string) => this.setLanguage(locale));

        numeral.language("sk", sk);
        numeral.language("cs", cs);
    }

    private setLanguage(locale: string)
    {
        numeral.language(locale);
    }

    public formatMoney(value: number, currency: boolean = true): string
    {
        let format: string = "0.00";

        if (currency)
        {
            format += " $";
        }

        return numeral(value).format(format);
    }
}
