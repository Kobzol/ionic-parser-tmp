export class MenuEntry
{
    constructor(private _title: string,
                private action: () => void,
                private displayPredicate: () => boolean = null,
                private _icon: string = "")
    {
        if (this.displayPredicate === null)
        {
            this.displayPredicate = () => true;
        }
    }

    get title(): string
    {
        return this._title;
    }
    get icon(): string
    {
        return this._icon;
    }

    public hasIcon(): boolean
    {
        return this.icon !== "";
    }

    public execute()
    {
        this.action();
    }
    public shouldDisplay(): boolean
    {
        return this.displayPredicate();
    }
}
