import * as server from './';

const params = {
    url: 'https://h5.ele.me/hongbao/#hardware_id=&is_lucky_group=True&lucky_number=6&track_id=&platform=0&sn=10e06f73e804dc94&theme_id=2041&device_id=',
    phone: '15255159814',
};

const req = {
    requestContext: {
        httpMethod: 'POST',
        path: '/test',
    },
    body: params
};

(async () => {
    const response = await server.main(req);
    console.log('内核: ', response);
    return response;
})();

// import { Handler } from './api/handler';
// import * as _ from 'lodash';

// (async () => {
//     let error = null;

//     const handler = new Handler(params);
//     const res = await handler.resolve();

//     if (_.isEmpty(res)) error = Error('数据异常');

//     console.log(error || res);
//     return error || res;
// })();