var vm="";
$(document).ready(function() {
       vm=new Vue({
         delimiters: ['${', '}'],
        el: "#container",
        data: {
            myData: [],
            gameorderid:"",
            items:[{text:'全部',value:''},{text:'成功',value:'1'},{text:'完成',value:'2'},{text:'失败',value:'3'}],
            selected:"",
            channelorderid:"",serverid:"",channel_id:"",
            playerid:"",playername:"",minamount:"",maxamount:"",commodityid:"",commodityidname:""
        },
        methods: {
          orders: function (index,list) {
            if(!confirm("确定要补单吗？")){return ;}
              showLoading();
            var data={gamesorderid: list.gameorderid,appid:list.appid};
            $.ajax({
                    url:$("#fillordersurl").val(),
                    dataType: "json",
                    type:'post',
                    data: data,
                    success: function(data,status,XMLHttpRequest){
                      hideLoading();
                       if(data.code==0){
                           list.status=2;
                           Vue.set(vm.myData,index, list);
                           alert('补单成功');
                      }
                      if(data.code==1){
                        alert('补单失败');
                      }
                    },
                    error: function(XMLHttpRequest, status, errorThrown){
                      hideLoading();
                      alert('补单失败');
                    }
              });
          },
          submit:function(){
            vm.myData=[];
            searchs(1);
          },
          clear:function(){
            vm.gameorderid="";
            vm.selected="";
            vm.channelorderid="";$("#startdate").val("");$("#enddate").val("");vm.serverid="";vm.channel_id="";
            vm.playerid="";vm.playername="";vm.minamount="";vm.maxamount="";vm.commodityid="";vm.commodityidname="";
            $("#startdate").val(moment().format('YYYY-MM-DD')+" 00:00:00");
            $("#enddate").val(moment().format('YYYY-MM-DD')+" 23:59:59");
          }
        }
      });
          $("#startdate").val(moment().format('YYYY-MM-DD')+" 00:00:00");
          $("#enddate").val(moment().format('YYYY-MM-DD')+" 23:59:59");
          searchs(1);


  });


  function searchs(currentpage){
    vm.myData=[];
    $('#pagination').hide();
      $.ajax({
              url:"/ordermgt/"+$("#currentappid").val()+"/"+currentpage,
              dataType: "json",
              type:'post',
              data: {gameorderid: vm.gameorderid,selected:vm.selected,channelorderid:vm.channelorderid,startdate:$("#startdate").val(),
              enddate:$("#enddate").val(),serverid:vm.serverid,channel_id:vm.channel_id,
              playerid:vm.playerid,playername:vm.playername,minamount:vm.minamount,maxamount:vm.maxamount,
              commodityid:vm.commodityid,commodityidname:vm.commodityidname},
              success: function(data,status,XMLHttpRequest){
                 //alert(JSON.stringify(data));
                 if(data.code==200){
                   setPagination(data.pagecount,data.pagesize,data.currentpage);
                   if(data.data.length>0){
                     for(var i=0;i<data.data.length;i++){
                       data.data[i].appname=$("#appname").text();
                        vm.myData.push(data.data[i]);
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
