/**
 * 用户信息
 */
var mongoose = require('./mongooseDb.js'),
    Schema = mongoose.Schema;

var GameOrdersSchema = new Schema({
    status : { type: String }, //0：创建订单中，1：支付成功，2：完成，3：失败
    gameorderid: {type: String},
    amount: {type: Number},
    appid: {type: String},
    create_at : { type: Date},
    modify_at : { type: Date},
    channel_id : {type: String},
    request_data: {type: String},
    playerid: {type: String},
    playername: {type: String},
    serverid: {type: String},
    channelorderid: {type: String},
    userid: {type: String},
    username: {type: String},
    commodityid: {type: String},
    commodityidname: {type: String}
    }, { versionKey: false });//去掉版本控制

module.exports = mongoose.model('GameOrders',GameOrdersSchema);
