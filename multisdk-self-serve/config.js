var config = {
  //端口号
  port : '3000',
  //登录、注册地址
  logincallbackURL:'http://passport.ddianle.com/?cb=http://mulitchannel.ddianle.com:9051/loginapi',
  //logincallbackURL:'http://passport.ddianle.com/?cb=http://101.88.225.161:3000/loginapi',
  //注册
  registcallbackURL:'http://passport.ddianle.com/register.html?cb=http://mulitchannel.ddianle.com:9051/loginapi',
  //补单地址
  fillordersURL:'http://mulitchannel.ddianle.com/api/v1/addGamesOrder',
  //七牛
  qiniu_ACCESS_KEY : 'PdPpuikGrIzYuIbcLCkXV7Owo5NRMF_7HAIfTyTH',
  qiniu_SECRET_KEY : 'fIsHrSFYoWChTK2MUNOciEKIZ4SNafE2JasGU48r',
  //'mongodb://ddl:123@172.16.6.13:27017/channel-sys'
  //mongodb_url: 'mongodb://ddl:123@101.88.225.161:10000/channel-sys',
  mongodb_url: 'mongodb://10.20.51.4:10000/channel-sys',
  //分页每页大小
  pagesize:10
};

module.exports = config;
