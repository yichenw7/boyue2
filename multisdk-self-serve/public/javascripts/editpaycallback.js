$(document).ready(function() {
  var vm=new Vue({
    delimiters: ['${', '}'],
    el: "#container",
    data: {
        url:"",
        picked:""
    },
    methods: {
        submit:function(){
          if(this.url==""){
            alert("请填写支付回调地址！");
            return;
          }

          var datas={"urls": vm.url,"picked":vm.picked,"id":$("#id").val()};
              $.ajax({
                      url:"/editpaycallback",
                      dataType: "json",
                      type:'post',
                      data: datas,
                      success: function(data,status,XMLHttpRequest){
                         if(data.code==200){
                           alert('操作成功');
                            loadUrl('paycallbacks');
                         }
                          if(data.code==-300){
                            alert('登录过期 请重新登录');
                           window.location.href="/";
                         }

                         if(data.code==-200){
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

  $.ajax({
          url:"/getpaycallbackbyid/"+$("#id").val(),
          dataType: "json",
          type:'post',
          data: "",
          success: function(data,status,XMLHttpRequest){
             //alert(JSON.stringify(data));
             if(data.code==200){
            //  if(data.code==200 && data.data.length>0){
               vm.url=data.data.game_server_order_url;
               //vm.picked=data.data[0].status;
             }
          },
          error: function(XMLHttpRequest, status, errorThrown){

          }
    });
});
