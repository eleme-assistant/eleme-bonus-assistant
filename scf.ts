import * as core from './index';

exports.main = async (event, context, callback) => {
    const res = await core.main(event);
    callback(null, res);
};