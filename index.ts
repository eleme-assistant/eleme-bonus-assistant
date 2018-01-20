import { Handler } from './api/handler';
import * as _ from 'lodash';

export async function main(event) {

    if (event['requestContext']['path'] === '/test' && event['requestContext']['httpMethod'] === 'POST') {
        let error = null;
        const body = event['body'];

        const handler = new Handler(body);
        const res = await handler.resolve();

        if (_.isEmpty(res)) error = Error('数据异常');

        return error || res;
    } else {
        return '非法的路由';
    }

}