
function executeByParams(pool,sql,params,res,callback){
  pool.getConnection(function(err, connection) {

  connection.query(sql,params, function(err, ret) {
           // 释放连接
           callback(err, ret);
           connection.release();
       });
  });
};

function query(pool,sql,res,callback){
  // 从连接池获取连接
pool.getConnection(function(err, connection) {
      //查询
      connection.query(sql, function(err, rows, fields) {

       callback(err,rows, fields);
         connection.release();
      });
    });

};
module.exports.query =  query;
module.exports.executeByParams =executeByParams;
