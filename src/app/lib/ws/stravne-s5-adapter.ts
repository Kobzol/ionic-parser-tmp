import {Injectable} from "@angular/core";
import {DateUtil} from "../util/date-util";
import _ from "lodash";
import {Dictionary} from "lodash";
import moment from "moment";

import {XmlConverter} from "../util/xml-converter";
import {FoodGroup} from "../orders/food-group";
import {UserData} from "../user/user-data";
import {Food} from "../orders/food";
import {Product} from "../orders/product";
import {ProductChangeInfo} from "../orders/product-change-info";
import {Payment} from "../orders/payment";
import {Issue, IssueType} from "../orders/issue";
import {UserSettings} from "../user/user-settings";
import {IssueLocation} from "../orders/issue-location";
import {Diet} from "../orders/diet";

@Injectable()
export class StravneS5Adapter
{
    constructor(private xmlConverter: XmlConverter,
                private dateUtil: DateUtil)
    {

    }

    public deserializeOrdersObject(ordersObject: any): FoodGroup[]
    {
        ordersObject = this.normalizeArray(ordersObject);
        let foods: Food[] = _.map(ordersObject, (obj: any): Food => this.parseFood(obj));
        let foodsByDate: {[index: string]: Food[]} = _.groupBy(foods, (food: Food): string =>
            moment(food.date).format("YYYY-MM-DD"));
        return _.map(foodsByDate, (value: Food[], key: string): FoodGroup =>
            new FoodGroup(moment(key, "YYYY-MM-DD").toDate(), value));
    }

    public deserializeOrders(data: any): {foods: FoodGroup[], rawData: any}
    {
        let ordersData: string = data["objednavky"];
        let ordersObject: any = this.xmlConverter.xmlToJs(ordersData)["RozpisObjednavek"]["Jidelnicek"];

        return {
            foods: this.deserializeOrdersObject(ordersObject),
            rawData: ordersObject
        };
    }

    public deserializeUserData(data: any): UserData
    {
        let userData: any = this.xmlConverter.xmlToJs(data["xmlUzivatel"])["VlastnostiUzivatele"]["Uzivatel"];
        userData = this.normalizeKeys(userData);

        return new UserData(
            userData["Jmeno"],
            userData["Prijmeni"],
            userData["VS"],
            this.parseDate(userData, "CasAktualizace", "YYYYMMDDhhmmss")
        );
    }

    public deserializeBalance(data: any): number
    {
        let userData: any = this.xmlConverter.xmlToJs(data["xmlKonto"])["Konta"]["Objednavky"];
        userData = this.normalizeKeys(userData);

        return Number(userData["Cena"]);
    }

    public deserializeOrderChangeInfo(data: any): ProductChangeInfo[]
    {
        if (_.has(data, "XML"))
        {
            data["xml"] = data["XML"];
        }

        let changeInfo = this.xmlConverter.xmlToJs(data["xml"])["RozpisObjednavek"];

        return _.map(changeInfo["Produkt"], (product: any): ProductChangeInfo => {
            product = this.normalizeKeys(product);
            return new ProductChangeInfo(product["Veta"], parseInt(product["Pocet"], 10));
        });
    }

    public deserializePayments(data: any): Payment[]
    {
        let dataObj = this.xmlConverter.xmlToJs(data["xml"])["Platby"];

        if (dataObj === "")
        {
            return [];
        }

        dataObj["Platba"] = this.normalizeArray(dataObj["Platba"]);

        return _.map(dataObj["Platba"], (payment: any) => {
            payment = this.normalizeKeys(payment);
            return new Payment(
                this.parseDate(payment, "Datum", "YYYYMMDD"),
                Number(payment["Castka"]),
                payment["PopisPlatby"]
            );
        });
    }

    public deserializeIssues(data: any): Issue[]
    {
        let dataObj = this.xmlConverter.xmlToJs(data["xml"])["VydanaJidla"];

        if (dataObj === "")
        {
            return [];
        }

        dataObj["Vydej"] = this.normalizeArray(dataObj["Vydej"]);

        return _.map(dataObj["Vydej"], (issue: any) => {
            issue = this.normalizeKeys(issue);
            let type: IssueType = <IssueType>Number(issue["KodVydeje"]);
            let issueDateTime: Date = null;

            if (type !== IssueType.NotIssued && _.has(issue, "DatumCasVydeje"))
            {
                issueDateTime = moment(issue["DatumCasVydeje"], "YYYYMMDDhhmmss").toDate();
            }

            return new Issue(
                this.parseDate(issue, "Datum", "YYYYMMDD"),
                issue["Druh"],
                issue["NazevJidelnicku"],
                issue["PopisDruhu"],
                issue["PocetVyd"],
                type,
                issueDateTime
            );
        });
    }

    public deserializeUserSettings(data: any): UserSettings
    {
        let dataObj = this.xmlConverter.xmlToJs(data["xml"])["NastaveniKlienta"];
        dataObj["Nastaveni"] = this.normalizeArray(dataObj["Nastaveni"]);
        dataObj = this.normalizeKeys(dataObj);

        let settings: Dictionary<string> = {};
        dataObj["Nastaveni"].forEach((setting: Dictionary<string>) => {
            setting = this.normalizeKeys(setting);
            settings[setting["Skupina"] + "." + setting["Nazev"]] = setting["Hodnota"];
        });

        return new UserSettings(
            settings["KlientskaNastaveni.Zaklad.EMail1"],
            settings["KlientskaNastaveni.Zaklad.EMail2"],
            this.parseEmailMessageSettings(settings["KlientskaNastaveni.Zaklad.TypyZpravEMail1"]),
            this.parseEmailMessageSettings(settings["KlientskaNastaveni.Zaklad.TypyZpravEMail2"]),
            settings["KlientskaNastaveni.Zaklad.HesloProInternet"],
            Number(dataObj["EvCislo"]),
            this.parseDate(dataObj, "CasZmeny", "YYYYMMDDhhmmss")
        );
    }
    public serializeUserSettings(userSettings: UserSettings): string
    {
        return `
            <?xml version="1.0" encoding="UTF-16"?>
            <NastaveniKlienta EvCislo="${userSettings.id.toString()}" CasZmeny="${this.dateUtil.format(userSettings.changeDate, "YYYYMMDDhhmmss")}">
                <Nastaveni Skupina="KlientskaNastaveni.Zaklad" Nazev="EMail1" Hodnota="${userSettings.email1}" />
                <Nastaveni Skupina="KlientskaNastaveni.Zaklad" Nazev="EMail2" Hodnota="${userSettings.email2}" />
                <Nastaveni Skupina="KlientskaNastaveni.Zaklad" Nazev="HesloProInternet" Hodnota="${userSettings.password}" />
                <Nastaveni Skupina="KlientskaNastaveni.Zaklad" Nazev="TypyZpravEMail1" Hodnota="${this.serializeEmailMessageSettings(userSettings.emailMessageSettings1)}" />
                <Nastaveni Skupina="KlientskaNastaveni.Zaklad" Nazev="TypyZpravEMail2" Hodnota="${this.serializeEmailMessageSettings(userSettings.emailMessageSettings2)}" />
            </NastaveniKlienta>
        `.trim();
    }

    public deserializeIssueLocations(data: any)
    {
        let dataObj = this.xmlConverter.xmlToJs(data["xmlVydejniMista"])["VydejniMista"];

        if (dataObj === "")
        {
            return [];
        }

        dataObj["VydejniMisto"] = this.normalizeArray(dataObj["VydejniMisto"]);

        return _.map(dataObj["VydejniMisto"], (issueLocation: Dictionary<string>) => {
            issueLocation = this.normalizeKeys(issueLocation);
            return new IssueLocation(
                issueLocation["VydejniMisto"],
                issueLocation["Popis"]
            );
        });
    }

    public deserializeDiets(data: any)
    {
        let dataObj = this.xmlConverter.xmlToJs(data["xmlDiety"])["Diety"];

        if (dataObj === "")
        {
            return [];
        }

        dataObj["Dieta"] = this.normalizeArray(dataObj["Dieta"]);

        return _.map(dataObj["Dieta"], (diet: Dictionary<string>) => {
            diet = this.normalizeKeys(diet);
            return new Diet(
                diet["Dieta"],
                diet["Popis"]
            );
        });
    }

    private parseFood(data: Dictionary<string>): Food
    {
        data = this.normalizeKeys(data);

        return new Food(   // TODO
            this.parseDate(data, "Datum", "YYYYMMDD"),
            data["NazevJidelnicku"],
            _.map(this.normalizeArray(data["Produkt"]), (product: any) => this.parseProduct(product)),
            data["PopisJidla"],
            this.parseDate(data, "KonecObjednavani", "YYYYMMDDHHmmss"),
            this.parseDate(data, "KonecOdhlaseni", "YYYYMMDDHHmmss"),
            data["VydejniMisto"],
            data["Dieta"],
            data["Diety"].split(",").filter((item: string) => item !== ""),
            data["Alergeny"].split("|").filter((item: string) => item !== ""),
            data["PopisDruhu"]
        );
    }

    private parseProduct(data: Dictionary<string>): Product
    {
        data = this.normalizeKeys(data);

        return new Product(
            data["Veta"],
            data["PopisProduktu"],
            Number(data["LzeMenit"]) === 1,
            Number(data["CenaSDph"]),
            Number(data["Pocet"])
        );
    }

    private parseDate(obj: Dictionary<string>, key: string, format: string): Date
    {
        let value: string = this.getDefault(obj, key);
        if (value !== null)
        {
            let date: moment.Moment = moment(value, format);

            return date.isValid() ? date.toDate() : null;
        }
        else return null;
    }

    private parseEmailMessageSettings(setting: string): boolean[]
    {
        let value: number = Number(setting);
        let settings: boolean[] = [];

        for (let i = 0; i < 5; i++)
        {
            settings.push((value & (1 << i)) !== 0);
        }

        return settings;
    }
    private serializeEmailMessageSettings(settings: boolean[]): string
    {
        let value: number = 0;
        for (let i = 0; i < settings.length; i++)
        {
            value |= settings[i] ? (1 << i) : 0;
        }

        return value.toString();
    }

    private getDefault(obj: Dictionary<string>, key: string, defaultValue: any = null): string
    {
        if (_.has(obj, key))
        {
            return obj[key];
        }
        else return defaultValue;
    }

    private normalizeKeys(data: Dictionary<string>): any
    {
        return _.mapKeys(data, (value: any, key: any) => {
            if (_.startsWith(key, "_"))
            {
                return key.substring(1);
            }
            else return key;
        });
    }

    private normalizeArray(data: any): any[]
    {
        if (!Array.isArray(data))
        {
            return [data];
        }
        else return data;
    }
}
