/**
 * 用户信息
 */
var mongoose = require('./mongooseDb.js'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
    appid : { type: String },
    name: {type: String},
    appkey: {type: String},
    game_server_order_url : { type: String},
    code : {type: String},
    describes : {type: String},
    icon : {type: String},
    users: [{type:Schema.Types.ObjectId,ref: 'Users'}]
    }, { versionKey: false });//去掉版本控制

module.exports = mongoose.model('Config',GameSchema);
