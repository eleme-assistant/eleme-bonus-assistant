import { Handler } from './api/handler';
import * as _ from 'lodash';

export async function main(event, context) {
    let error = null;

    const handler = new Handler(event);
    const res = await handler.resolve();

    if (_.isEmpty(res)) error = Error('数据异常');

    return error || res;
}