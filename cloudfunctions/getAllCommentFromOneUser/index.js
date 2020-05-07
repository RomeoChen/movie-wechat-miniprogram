// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    let openid = wxContext.OPENID;
    db.collection('comments').where({
        _openid: openid,
    }).get({
        success: res => {
            console.log(res.data)
            return res.data;
        },
        fail: err => {
            console.log(err.errMsg);
        }
    })
}