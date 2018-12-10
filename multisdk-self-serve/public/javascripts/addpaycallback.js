$(document).ready(function() {
  var vm=new Vue({
    delimiters: ['${', '}'],
    el: "#container",
    data: {
        url:"",
        picked:"0"
    },
    methods: {
        submit:function(){
          if(this.url==""){
            alert("请填写支付回调地址！");
            return;
          }

          var datas={"urls": vm.url,"picked":vm.picked,"gameid":$("#currentid").val()};
              $.ajax({
                      url:"/addpaycallback",
                      dataType: "json",
                      type:'post',
                      data: datas,
                      success: function(data,status,XMLHttpRequest){
                         //alert(JSON.stringify(data));
                         if(data.code==200){
                           alert('操作成功');
                           loadUrl('paycallbacks');
                         }else if(data.code==-300){
                           alert('登录过期 请重新登录');
                           window.location.href="/";
                         }else{
                           alert('操作失败');
                           loadUrl('paycallbacks');
                         }

                      },
                      error: function(XMLHttpRequest, status, errorThrown){
                        alert('操作失败');
                         loadUrl('paycallbacks');
                      }
                });
            }
        }
  });
});
