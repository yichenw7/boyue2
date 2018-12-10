var express = require('express');
var https    = require("https");
var http    = require("http");
var router = express.Router();

var config=require("../config");

//连接数据库
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var pool = mysql.createPool(dbConfig.mysql);

var dbManager = require('../db/DBManager');
var mongoose = require('mongoose');
var Users = require("../db/users.js");
var Game = require("../db/game.js");
var GameOrder = require("../db/gameorder.js");

var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.qiniu_ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu_SECRET_KEY;

//要上传的空间
var bucket = 'multisdk';
//上传到七牛后保存的文件名
var key = 'aaa.jpg'

//分页每页大小
var pagesize=config.pagesize;

var logincallbackURL=config.logincallbackURL;

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket);
  return putPolicy.token();
}

var payurl='http://pay.multisdk.com/';

/* GET home page. */
router.get('/', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      res.redirect('/main');
    }else{
      res.render('index', { logincallbackURL: logincallbackURL,registcallbackURL:config.registcallbackURL });
    }
  });
});

function loginFilter(req,res,callback){
  var user=req.session.user;
  if(typeof user=== 'undefined' || user==null || user==''){
    return callback(false);
  }else{
    var sdate=new Date(req.session.user[0].logintime);  //开始时间
    var edate=new Date();    //结束时间
    var date=((edate.getTime())-sdate.getTime())/(1000);
    // console.log("sdate:"+sdate+" edate:"+edate+" date"+date);
    if(date>86400){//1天才能登陆成功
      delete req.session.user;
      return callback(false);
    }
  }
  callback(true);
}

router.get('/main', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      return res.render('main', { usertype: (req.session.user)[0].type,username: (req.session.user)[0].uname,fillordersURL:config.fillordersURL});
    }else{
      res.redirect('/');
    }
  });
});

router.get('/login', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      res.redirect('/main');
    }else{
      res.redirect(logincallbackURL);
    }
  });
});

router.get('/session/:id', function(req, res, next) {
  var wherestr = {'uid' : [req.params.id] };

  Users.find(wherestr, function(err, result){
      if (err) {
          console.log("Error:" + err);
          return res.redirect('/');
         throw err;
      }
      else {
          if(result.length!=0){
             req.session.user = result;
              return res.redirect('/');
          }else{
              return res.redirect('/');
          }
      }
  })

});

router.get('/logout', function(req, res, next) {
  delete req.session.user;
    return res.redirect('/');
});

router.post('/getgame', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
        var user=req.session.user;
        if(user[0].type==0){//如果是普通角色用户
           result = {code:200,data: {}};
           return  res.jsonp(result);
         }
        var option = {};
        if(req.body.keywords!=null && req.body.keywords.length>0 && req.body.keywords!="undefined"){
          var sreacKeyRegExp = new RegExp(req.body.keywords);
            option={'name':sreacKeyRegExp};
        }
        if(user[0].type==2){//如果是管理员
          Game.find(option,['name', 'appid','appkey','code','icon','describes']).sort('-appid').exec((err, result)=>{
	            return  sendListResult(res,err,result);
            })
        }else if(user[0].type==1){//如果是游戏管理员
           Users.findById(user[0]._id).populate([{path: 'games', select: 'name appid appkey code icon describes',match:option,options: {sort: { 'appid': -1 }}}])
          .exec(function(err, result) {
            return sendListResult(res,err,result.games);
           });
       }
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

router.post('/getpaycallback/:id', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      Game.find({'_id':req.params.id}, ['_id', 'game_server_order_url'],function (err, doc){
        if(doc[0].game_server_order_url.length>0){
         return  sendListResult(res,err,doc);
        }
         return sendListResult(res,err,"");
      })
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

router.post('/getpaycallbacklist/:id', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      searchGameChannel(req, res);
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });

});

router.post('/getpackagelist/:id', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      searchGameChannel(req, res);
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });

});

router.post('/getpaycallbackbyid/:id', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      // dbManager.executeByParams(pool,'select * from `paycallback` where id=?',[req.params.id],res,function(err,rows,fields){
      //   sendListResult(res,err,rows);
      // });
      Game.findById(req.params.id, ['_id', 'game_server_order_url'],function (err, doc){
        if(doc.game_server_order_url.length>0){
         return  sendListResult(res,err,doc);
        }
         return sendListResult(res,err,"");
      })
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

router.post('/disablepaycallback/:id', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      dbManager.executeByParams(pool,"update paycallback set status=? where id=?",
      [1,req.params.id],res,function(err, ret){
          sendDBResult(res,err, ret)
      });
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

router.post('/addpaycallback', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      // dbManager.executeByParams(pool,"INSERT INTO paycallback(game_id,url,status) VALUES(?,?,?)",
      // [req.body.gameid,req.body.urls,req.body.picked],res,function(err, ret){
      //     sendDBResult(res,err, ret)
      // });
      var wherestr = {'_id' : req.body.gameid};
      var updatestr = {'game_server_order_url': req.body.urls};

      Game.update(wherestr, updatestr, function(err, result){
          if (err) {
            console.log(err);
            return res.jsonp({code:-100,msg:'操作失败'});
            throw err;
          }
          else {
              return res.jsonp({code:200,msg:'操作成功'});
          }
      })
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

router.post('/editpaycallback', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      // dbManager.executeByParams(pool,"update paycallback set url=?,status=? where id=?",
      // [req.body.urls,req.body.picked,req.body.id],res,function(err, ret){
      //     sendDBResult(res,err, ret)
      // });
      var wherestr = {'_id' : req.body.id};
      var updatestr = {'game_server_order_url': req.body.urls};

      Game.update(wherestr, updatestr, function(err, result){
          if (err) {
            console.log(err);
            return res.jsonp({code:-100,msg:'操作失败'});
            throw err;
          }
          else {
              return res.jsonp({code:200,msg:'操作成功'});
          }
      })
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });

});

router.post('/addgame', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      Game.find({}).sort('-appid').exec().then(function(result) {
          var vappid="800000001"
          if(result!=''){
            vappid=parseInt(result[0].appid)+1;
          }
            var game = new Game({
                appid : vappid,
                name: req.body.name,
                code: req.body.code,
                describes : req.body.describes,
                icon : req.body.icon,
                appkey : req.body.appkey,
                game_server_order_url:""
          });

          game.save(function (err, result) {

              if (err) {
                  return res.send({code:-100,msg:'操作失败'});
              }
              else {
                  return res.send({code:200,msg:'操作成功'});
              }

          });
        }).catch(function(err) {
          console.log(err);
          return res.jsonp({code: -100,msg:"操作失败"});
      });
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });

});

//七牛获得TOKEN
router.get('/token', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      //生成上传 Token
      token = uptoken(bucket, key);
      var result = {
        uptoken: token
       }
      res.jsonp(result);
    }else{
      return res.redirect('/');
    }
  });

});


router.post('/loginapi', function(req, res, next) {
//  console.log("===loginapi");
  if(typeof req.body.uid=== 'undefined'){
    return res.jsonp({code:-100,msg:'用户UID不能为空'});
  }

  if(typeof req.body.uname=== 'undefined'){
    return res.jsonp({code:-100,msg:'用户名称不能为空'});
  }

  if(typeof req.body.token=== 'undefined'){
    return res.jsonp({code:-100,msg:'用户Token不能为空'});
  }

  var postData=JSON.stringify({"UId":req.body.uid,"Token":req.body.token});

  var options = {
    hostname : 'passport.ddianle.com',
    port : 443,
    path : '/api/tokeninfo?language=0',
    method : "POST",
    // hostname: '172.16.6.21',
    // port: 8099,
    // path: '/usersysapi/tokeninfo?language=0',
    headers: {
      "Content-Type" : "application/json",
      "Content-Length" : Buffer.byteLength(postData)
    }
  };
  //正式环境  https
  var request = https.request(options, (response) => {
    response.setEncoding("utf8");
    response.on("data", (chunk) => {
      var results="";
      try {
          results=JSON.parse(chunk);
      } catch (e) {
        console.log('登录失败'+e);
        return res.jsonp({code:-100,msg:'登录失败'});
      }
        if(results.Code==10000){//error
            console.log('登录失败');
          return res.jsonp({code:-100,msg:'登录失败'});
        }

        var wherestr = {'uid' : [req.body.uid] };
//        console.log(results);
        Users.find(wherestr, function(err, result){
            if (err) {
               return res.jsonp({code:-100,msg:'登录失败'});
               throw err;
            }
            else {
                if(result.length!=0){
                   //用户已经存在走 正常登录流程

                   var wherestr = {'uid' : req.body.uid};
                   var updatestr = {'logintime': new Date(),'expire_in':results.expire_in};

                   Users.update(wherestr, updatestr, function(err, result){
                       if (err) {
                         console.log(err);
                         return res.jsonp({code:-100,msg:'登录失败'});
                         throw err;
                       }
                       else {
                           return res.jsonp({code:200,msg:'登录成功'});
                       }
                   })

                }else{

                  var user = new Users({
                      uid : req.body.uid,
                      type: 0,
                      uname: req.body.uname,
                      logintime : new Date(),
                      expire_in : result.expire_in,
                      games : []
                 });
                      user.save(function (err, result) {

                          if (err) {
                              console.log("Error:" + err);
                              return res.jsonp({code:-100,msg:'登录失败'});
                              throw err;
                          }
                          else {
                              return res.send({code:200,msg:'登录成功'});
                          }


                    }).catch(function(err) {
                      console.log(err);
                      return res.jsonp({code: -100,msg:"登录失败"});
                  });
              }
            }
        })

    });
    response.on("end", () => {

    });
  });

  request.on("error", (e) => {
      console.log("e====",e);
      res.jsonp({code:-100,msg:'登录失败'});
  });

  request.write(postData);
  request.end();
});




router.post('/getadminlist/:id/:currentpage', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      var wharestr={};
      wharestr.type = {$ne: 2};
      if(req.body.keywords!=null && req.body.keywords.length>0 && req.body.keywords!="undefined"){
        var sreacKeyRegExp = new RegExp(req.body.keywords);
          wharestr.uname = sreacKeyRegExp;
      }
      var query=Users.find().lean();
       query.skip((req.params.currentpage-1)*pagesize);
       query.limit(pagesize);
       query.where(wharestr);
       //计算分页数据
       query.exec(function(err,rs){
           if(err){
             return  res.jsonp({code: -100,msg:"操作失败"});
             throw err;
           }else{
               //计算数据总数
               Users.find(wharestr,function(err,result){
                 if(err){
                   return  res.jsonp({code: -100,msg:"操作失败"});
                   throw err;
                 }
                 if(result.length>0){
                   Game.findById(req.params.id, function (err, doc){
                     if(err){
                       return  res.jsonp({code: -100,msg:"操作失败"});
                       throw err;
                     }
                     if(doc.users.length==0){
                       var results={code:200,data: rs,pagesize:pagesize,pagecount:result.length,currentpage:req.params.currentpage};
                       return res.jsonp(results);
                     }
                      for(var i = 0; i < rs.length; i++){
                        var passed = doc.users.some(function(element, index, array){
                             return (element.equals(rs[i]._id));
                           });
                         if(passed){
                           rs[i].status = 1;
                         }else{
                          rs[i].status = 0;
                         }
                      }
                      var results={code:200,data: rs,pagesize:pagesize,pagecount:result.length,currentpage:req.params.currentpage};
                      return res.jsonp(results);
                   })
                 }else{
                   var results={code:200,data: rs,pagesize:pagesize,pagecount:result.length,currentpage:req.params.currentpage};
                   return res.jsonp(results);
                 }
               });

           }
       });
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

//设置管理员
router.post('/setadmin', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){

      var wherestr = {'_id' : req.body.id};
      var updatestr ={'type': 1,'$push':{'games':mongoose.Types.ObjectId(req.body.gameid)} } ;

      Users.update(wherestr, updatestr, function(err, result){
          if (err) {
            console.log(err);
            return res.jsonp({code:-100,msg:'操作失败'});
            throw err;
          }
          wherestr = {'_id' : req.body.gameid};
          updatestr = {'$push':{'users':mongoose.Types.ObjectId(req.body.id)}};
          Game.update(wherestr, updatestr, function(err, result){
              if (err) {
                console.log(err);
                return res.jsonp({code:-100,msg:'操作失败'});
                throw err;
              }

              return res.jsonp({code:200,msg:'操作成功'});

          });
      })
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});


//取消管理员
router.post('/canceladmin', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){

      Users.findById(req.body.id, function (err, result){
        if(err){
          return  res.jsonp({code: -100,msg:"操作失败"});
          throw err;
        }
        var wherestr = {'_id' : req.body.gameid};
        var updatestr = {'$pull':{'users':mongoose.Types.ObjectId(req.body.id)}};
        var userupdatestr={};
        userupdatestr.$pull={'games':mongoose.Types.ObjectId(req.body.gameid)};
        if(result.games.length<=1){
          userupdatestr.type=0;
        }

        Users.update({'_id' : req.body.id}, userupdatestr, function(err, result){
            if (err) {
              console.log(err);
              return res.jsonp({code:-100,msg:'操作失败'});
              throw err;
            }
            Game.update(wherestr, updatestr, function(err, result){
                if (err) {
                  console.log(err);
                  return res.jsonp({code:-100,msg:'操作失败'});
                  throw err;
                }
                return res.jsonp({code:200,msg:'操作成功'});
            });
        });
      });
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

//订单管理
router.post('/ordermgt/:appid/:currentpage', function(req, res, next) {
  loginFilter(req, res,function(result){
    if(result){
      var wharestr={};
      wharestr.appid = req.params.appid;
      if(!isEmpty(req.body.gameorderid)){
        var sreacKeyRegExp = new RegExp(req.body.gameorderid);
          wharestr.gameorderid = sreacKeyRegExp;
      }else{
        wharestr.status = {$ne: 0}; //不查询订单创建中的单子
      }
      if(!isEmpty(req.body.selected)){
          wharestr.status = req.body.selected;
      }
      if(!isEmpty(req.body.channelorderid)){
        var sreacKeyRegExp = new RegExp(req.body.channelorderid);
          wharestr.channelorderid = sreacKeyRegExp;
      }
      if(!isEmpty(req.body.startdate)){
          wharestr.create_at = {$gte: req.body.startdate};
      }
      if(!isEmpty(req.body.enddate)){
          wharestr.create_at = {$lte: req.body.enddate};
      }
      if(!isEmpty(req.body.startdate) && !isEmpty(req.body.enddate)){
          wharestr.create_at = {$gte: req.body.startdate,$lte:req.body.enddate};
      }
      if(!isEmpty(req.body.serverid)){
         var sreacKeyRegExp = new RegExp(req.body.serverid);
          wharestr.serverid = sreacKeyRegExp;
      }
      if(!isEmpty(req.body.playerid)){
          var sreacKeyRegExp = new RegExp(req.body.playerid);
          wharestr.playerid = sreacKeyRegExp;
      }
      if(!isEmpty(req.body.playername)){
          var sreacKeyRegExp = new RegExp(req.body.playername);
          wharestr.playername = sreacKeyRegExp;
      }
      if(!isEmpty(req.body.minamount)){
          wharestr.amount ={$gte: req.body.minamount};
      }
      if(!isEmpty(req.body.maxamount)){
          wharestr.amount = {$lte:req.body.maxamount};
      }
      if(!isEmpty(req.body.minamount) && !isEmpty(req.body.maxamount)){
          wharestr.amount = {$gte: req.body.minamount,$lte:req.body.maxamount};
      }
      if(!isEmpty(req.body.commodityid)){
          var sreacKeyRegExp = new RegExp(req.body.commodityid);
          wharestr.commodityid = sreacKeyRegExp;
      }
      if(!isEmpty(req.body.commodityidname)){
          var sreacKeyRegExp = new RegExp(req.body.commodityidname);
          wharestr.commodityidname = sreacKeyRegExp;
      }
      if(!isEmpty(req.body.channel_id)){
          wharestr.channel_id = req.body.channel_id
      }

      var query=GameOrder.find();
       query.skip((req.params.currentpage-1)*pagesize);
       query.limit(pagesize);
       query.where(wharestr);
       query.sort('-_id');
       //计算分页数据
       query.exec(function(err,rs){
           if(err){
             return  res.jsonp({code: -100,msg:"操作失败"});
             throw err;
           }else{
             GameOrder.find(wharestr,function(err,result){
               if(err){
                 return  res.jsonp({code: -100,msg:"操作失败"});
                 throw err;
               }
               var results={code:200,data: rs,pagesize:pagesize,pagecount:result.length,currentpage:req.params.currentpage};
               return res.jsonp(results);
             });
           }
       });
    }else{
      return res.jsonp({code: -300,msg:"登录过期 请重新登录"});
    }
  });
});

function sendData(req,res,err,con){
  // 释放连接
  con.release();
  res.jsonp({code:-100,msg:'操作失败'});
}
function searchGameChannel(req, res){
  var sql='select a.*,b.cname cname from game_channel a,channels b where a.game_id='+req.params.id+' and a.channel_id=b.id';
  if(req.body.keywords!=null && req.body.keywords.length>0 && typeof req.body.keywords!="undefined"){
    sql+=" and b.cname like '%"+req.body.keywords+"%'";
  }
  dbManager.query(pool,sql,res,function(err,rows,fields){
      sendListResult(res,err,rows);
  });
}


function sendListResult(res,err,rows){
  var result={};
    if (err) {
      console.log(err);
      result = {code: -100}
       return  res.jsonp(result);
      throw err;
    }
    if(rows)
    {
      result = {code:200,data: rows}
    }
   return  res.jsonp(result);
}


function sendDBResult(res,err,ret){
  var result={};
    if (err) {
      result = {code: -100,msg:'操作失败'}
       return res.jsonp(result);
      throw err;
    }
    if(ret)
    {
      if(typeof ret === 'undefined') {
        result = {code: -100,msg:'操作失败'}
      } else {
        result = {code:200,msg:'操作成功'}
      }
    }
    return res.jsonp(result);
}

function isEmpty(obj){
  if(obj!=null && obj.length>0 && obj!="undefined"){
      return false;
  }
   return true;
}

module.exports = router;
