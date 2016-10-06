import {Serializer} from "./serializer";
import {Account} from "../../account/account";

export class AccountSerializer implements Serializer
{
    serialize(obj: any): string
    {
        return JSON.stringify(obj);
    }

    deserialize(obj: string): any
    {
        let data = JSON.parse(obj);
        return new Account(data._name, data._canteen, data._username, data._password);
    }
}
