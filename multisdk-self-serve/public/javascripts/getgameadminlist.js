var vm="";
$(document).ready(function() {
       vm=new Vue({
         delimiters: ['${', '}'],
        el: "#container",
        data: {
            myData: [],
            keywords:""
        },
        methods: {
          set: function (index,list) {
            if(!confirm("确定要设置吗？")){return ;}

            var data={id: list._id,gameid:$("#currentid").val()};
            $.ajax({
                    url:"/setadmin",
                    dataType: "json",
                    type:'post',
                    data: data,
                    success: function(data,status,XMLHttpRequest){
                       if(data.code==200){
                           alert('操作成功');
                           list.status=1;
                           Vue.set(vm.myData,index, list);
                      }
                      if(data.code==-100){
                        alert('操作失败');
                      }
                      if(data.code==-300){
                        alert('登录过期 请重新登录');
                        window.location.href="/";
                      }
                    },
                    error: function(XMLHttpRequest, status, errorThrown){
                      alert('操作失败');
                    }
              });
          },
          cancel: function (index,list) {
            if(!confirm("确定要取消吗？")){return ;}

            var data={id: list._id,gameid:$("#currentid").val()};
            $.ajax({
                    url:"/canceladmin",
                    dataType: "json",
                    type:'post',
                    data: data,
                    success: function(data,status,XMLHttpRequest){
                       //alert(JSON.stringify(data));
                       if(data.code==200){
                           alert('操作成功');
                           list.status=0;
                           Vue.set(vm.myData,index, list);
                      }
                      if(data.code==-200){
                        alert('操作失败');
                      }
                      if(data.code==-300){
                        alert('登录过期 请重新登录');
                        window.location.href="/";
                      }
                    },
                    error: function(XMLHttpRequest, status, errorThrown){
                      alert('操作失败');
                    }
              });
          },
          submit:function(){
            vm.myData=[];
            searchs(1);
          }
        }
      });

          searchs(1);

  });


  function searchs(currentpage){
    vm.myData=[];
    $('#pagination').hide();
      $.ajax({
              url:"/getadminlist/"+$("#currentid").val()+"/"+currentpage,
              dataType: "json",
              type:'post',
              data: {keywords: vm.keywords},
              success: function(data,status,XMLHttpRequest){
                 //alert(JSON.stringify(data));
                 if(data.code==200){
                   setPagination(data.pagecount,data.pagesize,data.currentpage);
                   if(data.data.length>0){
                     for(var i=0;i<data.data.length;i++){
                        vm.myData.push(data.data[i])
                     }
                  }
                }
                if(data.code==-300){
                  alert('登录过期 请重新登录');
                  window.location.href="/";
                }
                if(data.code==-200){
                  // alert('操作失败');
                  vm.myData=[];
                }
              },
              error: function(XMLHttpRequest, status, errorThrown){
                // alert('操作失败');
              }
        });
      }
