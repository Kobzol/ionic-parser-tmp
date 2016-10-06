export class Util
{
    public static Finally(promise: Promise<any>, callback: any): Promise<any>
    {
        return promise.then(callback).catch(callback);
    }
}
