import {Injectable} from "@angular/core";
import {SoapClient} from "../soap/soap-client";
import {Http} from "@angular/http";
import {WsError} from "./ws-error";
import {XmlConverter} from "../util/xml-converter";
import {Canteen} from "../orders/canteen";
import _ from "lodash";

@Injectable()
export class StravneS4Client
{
    private soapClient: SoapClient;

    constructor(http: Http,
                private xmlConverter: XmlConverter,
                url: string,
                username: string,
                password: string)
    {
        this.soapClient = new SoapClient(http, xmlConverter, url, username, password);
    }

    public async getCanteen(canteenId: string): Promise<Canteen>
    {
        let data: any = await this.callWsXml("WSSeznamPOZarizeni",
            {
                Zarizeni: canteenId,
                Polozky: "ZARIZENI,TEXT_UZIV,V_NAZEV,V_ULICE,V_MESTO,V_PSC,V_TELEFON,V_UCET,V_EMAIL,V_URL,VERZE,URLWSDL,URLWSDL_S,UZ_URLWSDL,HE_URLWSDL,ZEME,REZIM_UZI,PASIVNI_OI"
            },
            true,
            "pomizarizen_wsseznam"
        );
        return this.parseCanteen(data);
    }

    public async getCanteens(): Promise<Canteen[]>
    {
        let data: any = await this.callWsXml("WSSeznamPOZarizeni",
            {
                Zarizeni: "",
                Polozky: "ZARIZENI,V_NAZEV,V_MESTO,VERZE,REZIM_UZI"
            },
            true,
            "pomizarizen_wsseznam"
        );
        return _.map(data, (canteenObj: any) => this.parseCanteen(canteenObj));
    }

    private parseCanteen(data: any): Canteen
    {
        let text = data["text_uziv"];
        if (text !== undefined)
        {
            text = text.toString();
        }

        return new Canteen(
            data["zarizeni"],
            data["v_nazev"],
            data["rezim_uzi"],
            Number(data["verze"]),
            data["v_mesto"],
            data["v_ulice"],
            data["v_psc"],
            data["v_telefon"],
            data["v_email"],
            data["v_url"],
            text
        );
    }

    private async callWs(method: string, parameters: {[key: string]: string},
                   authenticated: boolean = true): Promise<any>
    {
        let data: any = await this.soapClient.send(method, parameters, authenticated);
        this.checkResult(data);
        return data;
    }
    private async callWsXml(method: string, parameters: {[key: string]: string},
                   authenticated: boolean = true, resultKey: string): Promise<any>
    {
        let data: any = await this.callWs(method, parameters, authenticated);
        return this.xmlConverter.xmlToJs(data["Result"])["VFPData"][resultKey];
    }

    private checkResult(data: any)
    {
        let result = data["Vysledek"];
        if (result !== "0;")
        {
            result = result.split(";");
            throw new WsError(parseInt(result[0], 10), result[1]);
        }
    }
}
