import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {XmlConverter} from "../util/xml-converter";
import _ from "lodash";

@Injectable()
export class SoapClient
{
    constructor (private http: Http,
                 private xmlConverter: XmlConverter,
                 private url: string,
                 private username: string = "",
                 private password: string = "")
    {

    }

    public async send(method: string, parameters: {[name: string]: any} = {}, authenticated: boolean = true): Promise<any>
    {
        parameters["Vysledek"] = "";

        if (authenticated)
        {
            parameters["AutUzivatelWS"] = this.username;
            parameters["AutHesloSW"] = this.password;
        }

        let xmlParameters = this.xmlConverter.jsToXml(parameters);
        let body = this.xmlConverter.normalizeXml(SoapClient.buildRequestBody(method, xmlParameters));

        let response: Response = await this.http.post(this.url, body, new RequestOptions({
            headers: new Headers({
                "Content-Type": "text/xml; charset=utf-8",
                "SoapAction":   "http://tempuri.org/WSiStravne/action/istravne." + method
            })
        })).toPromise();

        return this.cleanObject(this.xmlConverter.xmlToJs(response.text())["Envelope"]["Body"][method + "Response"]);
    }

    private cleanObject(obj: any): any
    {
        return _.pickBy(obj, (value: any, key: any) => !_.startsWith(key, "_"));
    }

    private static buildRequestBody(method: string, parameters: any): string
    {
        return `
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
                xmlns:tns="http://tempuri.org/WSiStravne/wsdl/"
                xmlns:types="http://tempuri.org/WSiStravne/wsdl/encodedTypes"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                <soap:Body soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                    <q1:${method} xmlns:q1="http://tempuri.org/WSiStravne/message/">
                        ${parameters}
                    </q1:${method}>
                </soap:Body>
            </soap:Envelope>
        `;
    }
}
