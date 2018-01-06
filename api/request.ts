import { IRequest } from '../../interface/commons';
import * as _ from 'lodash';
import axios, { AxiosResponse } from 'axios';

export class Request {

    public async send(request: IRequest.Request) {
        try {
            const response = await axios({
                method: _.toLower(request.method),
                url: request.url,
                data: request.body
            });
            return response.data;
        } catch (e) {
            if (e.status === 404) return false;
            throw Error('服务请求失败');
        }
    }

}