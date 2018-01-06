import { Eleme } from '../../interface/eleme_assess_assistant';
import * as _ from 'lodash';
import axios, { AxiosResponse } from 'axios';

export class Slice {

    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }

    public convert() {
        return {
            sn: this.getSn(),
            lucky_number: this.getLuckyNumber(),
        };
    }

    private slice(rule: string, not_need: string) {
        const reg = new RegExp(rule);
        const source = reg.exec(this.url);
        const value = source[0].replace(not_need, '');
        return value;
    }

    private getSn() {
        return this.slice('(?=sn=).+(?=&theme_id=)', 'sn=');
    }

    private getLuckyNumber(): number {
        const value = this.slice('(?=lucky_number=).+(?=&track_id=)', 'lucky_number=');
        return Number(value);
    }

}