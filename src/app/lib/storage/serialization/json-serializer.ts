import {Serializer} from "./serializer";

export class JsonSerializer implements Serializer
{
    serialize(obj: any): string
    {
        return JSON.stringify(obj);
    }

    deserialize(obj: string): any
    {
        return JSON.parse(obj);
    }
}
