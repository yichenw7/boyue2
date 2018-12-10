/**
 * 用户信息
 */
var mongoose = require('./mongooseDb.js'),
    Schema = mongoose.Schema;

var UsersSchema = new Schema({
    uid : { type: String },
    type: {type: Number},
    uname: {type: String},
    logintime : { type: Date, default: Date.now},                       //最近登录时间
    expire_in : {type: String},
    games: [{type:Schema.Types.ObjectId,ref: 'Config'}]
    }, { versionKey: false });//去掉版本控制

module.exports = mongoose.model('User',UsersSchema);
