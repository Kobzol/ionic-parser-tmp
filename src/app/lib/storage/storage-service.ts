import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";

@Injectable()
export class StorageService
{
    private data: {[key: string]: string} = {};

    constructor(private settingsStorage: Storage)
    {

    }

    public load(key: string): string
    {
        return this.data[key];
    }
    public store(key: string, value: string)
    {
        this.data[key] = value;
        this.storeAsync(key, value);
    }

    public preload(keys: string[]): Promise<any>
    {
        let loadPromises: Promise<string>[] = [];

        for (let key of keys)
        {
            let promise = this.loadAsync(key);
            loadPromises.push(promise);
            promise.then((value: string) =>
            {
                this.data[key] = value;
            });
        }

        return Promise.all(loadPromises);
    }

    private loadAsync(key: string): Promise<string>
    {
        return this.settingsStorage.get(key);
    }

    private storeAsync(key: string, data: string): Promise<string>
    {
        return this.settingsStorage.set(key, data);
    }
}
