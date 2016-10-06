import {Pipe, PipeTransform} from "@angular/core";
import {NumberUtil} from "../lib/util/number-util";

@Pipe({
    name: "money"
})
export class MoneyPipe implements PipeTransform
{
    constructor(private numberUtil: NumberUtil)
    {

    }

    transform(value: number, currency: boolean = true): string
    {
        return this.numberUtil.formatMoney(value, currency);
    }
}
