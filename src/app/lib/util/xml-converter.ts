import {Injectable} from "@angular/core";
import X2JS from "x2js";

@Injectable()
export class XmlConverter
{
    public normalizeXml(xml: string): string
    {
        let converter = new X2JS();
        let doc = converter.xml2js(xml);
        return converter.js2xml(doc);
    }
    public jsToXml(obj: any): string
    {
        return new X2JS().js2xml(obj);
    }
    public xmlToJs(xml: string): any
    {
        return new X2JS().xml2js(xml);
    }
}
