$(document).ready(function() {
      var vm=new Vue({
         delimiters: ['${', '}'],
        el: "#container",
        data: {
            myData: []
        },
        methods: {
          displayadd:function(){
            if(vm.myData.length>=1){
              alert("只允许创建1条！");
              return;
            }
            loadUrl('addpaycallback');
          },

          edit:function(id){
            loadpaycallback(id);
          },

          disable:function(id){
            if(confirm("确定要停用吗？"))
            {
              $.ajax({
                      url:"/disablepaycallback/"+id,
                      dataType: "json",
                      type:'post',
                      data: "",
                      success: function(data,status,XMLHttpRequest){
                         //alert(JSON.stringify(data));
                         if(data.code==200){
                            alert('操作成功');
                          loadUrl('paycallbacks');
                        }

                         if(data.code==-300){
                           alert('登录过期 请重新登录');
                           window.location.href="/";
                         }
                         if(data.code==-100){
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
        },

      });

      Vue.filter('time', function (value, formatString) {
       formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
        return moment(value).format(formatString);
     });

      var data="";
          $.ajax({
                  url:"/getpaycallback/"+$("#currentid").val(),
                  dataType: "json",
                  type:'post',
                  data: data,
                  success: function(data,status,XMLHttpRequest){
                     //alert(JSON.stringify(data));
                     if(data.code==200 && data.data.length>0){
                       for(var i=0;i<data.data.length;i++){
                          vm.myData.push(data.data[i])
                       }
                     }
                     if(data.code==-300){
                       alert('登录过期 请重新登录');
                       window.location.href="/";
                     }
                     if(data.code==-100){
                      //  alert('操作失败');
                         vm.myData=[];
                     }
                  },
                  error: function(XMLHttpRequest, status, errorThrown){
                    // alert('操作失败');
                  }
            });
  });
