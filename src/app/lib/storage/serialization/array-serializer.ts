import {Serializer} from "./serializer";
import _ from "lodash";

export class ArraySerializer implements Serializer
{
    constructor(private innerSerializer: Serializer)
    {

    }

    serialize(obj: any): string
    {
        return JSON.stringify(_.map(obj, (value: any) => this.innerSerializer.serialize(value)));
    }

    deserialize(obj: string): any
    {
        let arr = JSON.parse(obj);
        return _.map(arr, (serializedObj: string) => this.innerSerializer.deserialize(serializedObj));
    }
}
