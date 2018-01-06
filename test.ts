import * as server from './index';

const params = {
    url: 'https://h5.ele.me/hongbao/#hardware_id=&is_lucky_group=True&lucky_number=8&track_id=&platform=0&sn=29e15830a51e04ab&theme_id=2009&device_id=',
    phone: 15255159814,
};

(async () => {
    const response = await server.main(params, undefined);
    console.log('成功', response);
    return response;
})();