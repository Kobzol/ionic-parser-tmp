export class WsError
{
    constructor(private _code: number = 0,
                private _message: string = "")
    {

    }

    get code(): number
    {
        return this._code;
    }
    get message(): string
    {
        return this._message;
    }

    toString(): string
    {
        return `[#${this.code}]: ${this.message}`;
    }
}
