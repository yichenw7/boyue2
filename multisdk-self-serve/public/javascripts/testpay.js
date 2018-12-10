$(document).ready(function() {
            var vm=new Vue({
                el: "#container",
                data: {
                    channelid: "999",
                    cuid: randomnum(10),
                    serverid:1,
                    amount:100,
                    orderid:randomnum(15),
                    transactionid:randomnum(20),
                    transtype:"1",
                    extend:"1_1",
                    sign: ""
                },
                methods: {
                    submit:function(){
                        if(this.channelid==""){
                          alert("请填写channelid！");
                          return;
                        }
                        if(this.cuid==""){
                          alert("请填写cuid！");
                          return;
                        }
                        if(this.serverid==""){
                          alert("请填写serverid！");
                          return;
                        }
                        if(this.amount==""){
                          alert("请填写amount！");
                          return;
                        }
                        if(this.orderid==""){
                          alert("请填写orderid！");
                          return;
                        }
                        if($("input#inputUrl").val()==""){
                          alert("请填写API地址！");
                          return;
                        }



                        var data=('channelid='+this.channelid+'&cuid='+this.cuid+'&serverid='+this.serverid
                        +'&amount='+this.amount+'&orderid='+this.orderid+'&transactionid='+this.transactionid
                        +'&transtype='+this.transtype+'&extend='+this.extend+'&sign='+this.sign).toLowerCase();


                        var url=$("input#inputUrl").val()+'/'+this.channelid+'/'+$("input#currentappid").val()
                        var start = new Date().getTime();//起始时间
                        $.ajax({
                                url:url,
                                type:'post',
                                data: data,
                                success: function(data,status,XMLHttpRequest){
                                   var end = new Date().getTime();//接受时间
                                    $("#result").text(JSON.stringify(data));
                                    $("#status").text(XMLHttpRequest.status);
                                    $("#time").text((end - start)+"ms");

                                },
                                error: function(XMLHttpRequest, status, errorThrown){
                                  var end = new Date().getTime();//接受时间
                                    $("#status").text(XMLHttpRequest.status);
                                    $("#time").text((end - start)+"ms");
                                    $("#result").text("请求出错！");
                                }
                          });
                    },
                    md5:function(){
                      var md5='channelid='+this.channelid+'&cuid='+this.cuid+'&serverid='+this.serverid
                      +'&amount='+this.amount+'&orderid='+this.orderid+'&transactionid='+this.transactionid
                      +'&transtype='+this.transtype+'&extend='+this.extend+'&appkey='+$("input#currentappkey").val();
                      this.sign=$.md5(md5.toLowerCase());
                    }
                }
            });
            vm.md5();
          });
