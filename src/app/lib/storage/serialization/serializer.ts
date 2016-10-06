export interface Serializer
{
    serialize(obj: any): string;
    deserialize(obj: string): any;
}
