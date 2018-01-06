import * as _ from 'lodash';
import axios, { AxiosResponse } from 'axios';
import * as faker from 'faker/locale/zh_CN';
import { Request } from './request';
import { IBonus } from '../../interface/eleme-bonus-assistant';
import { IRequest } from '../../interface/commons';
import { Slice } from './slice';
import * as config from 'config';

export class Handler {

    private readonly babies: IBonus.Baby[];
    private readonly master: IBonus.Baby;
    private readonly bouns_info: { lucky_number: number, sn: string };
    private readonly request: Request;

    constructor(params: { url: string, phone: string }) {
        this.request = new Request();

        if (config.has('babies')) {
            this.babies = config.get('babies');
        } else {
            throw Error('没有宝宝');
        }

        this.master = this.babies.shift();
        this.master.phone = params.phone;

        const bouns_info = new Slice(params.url);
        this.bouns_info = bouns_info.convert();
    }

    private output(code: number, name: string = '阁下') {
        switch (code) {
            case 1:
                return `${name} 已经拿过了`;
            default:
                return `正在和 总裁 激烈的谈判中`;
        }
    }

    private requestChangePhone(params: IBonus.ChangePhone, baby_id: string): IRequest.Request {
        const body = {
            sign: params.sign,
            phone: params.phone,
        };

        return {
            body,
            url: `https://restapi.ele.me/v1/weixin/${baby_id}/phone`,
            method: IRequest.HTTP_METHOD.PUT,
        };
    }

    private requestBonus(params: IBonus.Create, baby_id: string): IRequest.Request {
        const body = {
            method: params.method || 'phone',
            group_sn: params.group_sn,
            sign: params.sign || '',
            phone: params.phone || '',
            device_id: params.device_id || '',
            hardware_id: params.hardware_id || '',
            platform: params.platform || 0,
            track_id: params.track_id || '1508240171|847a954bfe202557c618e2d09b3cebbbdad6212feef334090f|dae31607a97eb893cac480e60598758e',
            weixin_avatar: params.weixin_avatar,
            weixin_username: params.weixin_username,
            unionid: params.unionid || 'o_PVDuI3cux0hDOJfc7yItW1kM2Y',
        };

        return {
            body,
            url: `https://restapi.ele.me/marketing/promotion/weixin/${baby_id}`,
            method: IRequest.HTTP_METHOD.POST,
        };
    }

    public async resolve() {
        /**
         * 先改掉 master 宝宝的手机号
         */
        const request = await this.requestChangePhone({ sign: this.master.sign, phone: this.master.phone }, this.master.id);
        const response = await this.request.send(request);

        // 输出程序运行描述们
        const outputs: string[] = [
            `阁下的手机号是 ${this.master.phone}`,
            '正在约谈 饿了么总裁',
        ];

        let index = 0;
        do {
            const avatar_sex = _.random(0, 1, false);
            const avatar_num = avatar_sex === 0 ? _.random(1, 22, false) : _.random(1, 26, false);
            const wechat_avatar = avatar_sex === 0 ? `http://d.lanrentuku.com/down/png/1610/50kids-avatars/boy-${avatar_num}.png` :
                `http://d.lanrentuku.com/down/png/1610/50kids-avatars/girl-${avatar_num}.png`;
            const wechat_name = faker.name.findName();

            const baby = this.babies.shift();
            const next_index = index + 1;

            if (next_index === this.bouns_info.lucky_number) {
                const request = this.requestBonus({
                    sign: this.master.sign,
                    phone: this.master.phone,
                    weixin_avatar: wechat_avatar,
                    weixin_username: wechat_name,
                    group_sn: this.bouns_info.sn,
                }, this.master.id);
                const response = await this.request.send(request);
                outputs.push(this.output(response));
                return outputs;
            } else if (next_index < this.bouns_info.lucky_number) {
                const request = this.requestBonus({
                    sign: baby.sign,
                    phone: baby.phone,
                    weixin_avatar: wechat_avatar,
                    weixin_username: wechat_name,
                    group_sn: this.bouns_info.sn,
                }, baby.id);
                const response = await this.request.send(request);
                outputs.push(this.output(response, `${next_index}号宝宝`));
                index = response.promotion_records.length;
                outputs.push(`目测最大的红包被人捷足先登了`);
                outputs.push(`竟然被 ${index}个人超车了, 不高兴`);
            }
        } while (index < this.bouns_info.lucky_number);
        outputs.push('桑心, 拿不到最大的红包了');

        return outputs;
    }

}