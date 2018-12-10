$(document).ready(function() {
      var vm=new Vue({
         delimiters: ['${', '}'],
        el: "#container",
        data: {
            myData: [],
            keywords:""
        },
        methods: {
          submit:function(){
            vm.myData=[];
            search();
          }
        }
      });
      function search(){
      var data={keywords: vm.keywords};
          $.ajax({
                  url:"/getpackagelist/"+$("#currentid").val(),
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
          }
          search();
  });
