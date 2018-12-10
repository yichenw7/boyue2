$(document).ready(function() {
            var vm=new Vue({
                el: "#container",
                data: {
                    appid: $("input#currentappid").val(),
                    channelid: "999",
                    cuid: "",
                    token: "",
                    sign: ""
                },
                methods: {
                    submit:function(){
                        if(this.appid==""){
                          alert("请填写appid！");
                          return;
                        }

                        if(this.channelid==""){
                          alert("请填写channelid！");
                          return;
                        }
                        if(this.cuid==""){
                          alert("请填写cuid！");
                          return;
                        }
                        if(this.token==""){
                          alert("请填写token！");
                          return;
                        }
                        if($("input#inputUrl").val()==""){
                          alert("请填写API地址！");
                          return;
                        }
                        var data=('appid='+this.appid+'&channelid='+this.channelid+'&cuid='+this.cuid+'&token='+this.token+'&sign='+this.sign).toLowerCase();
                        var start = new Date().getTime();//起始时间
                        $.ajax({
                                url:$("input#inputUrl").val(),
                                dataType: "json",
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
                      var md5='channelid='+this.channelid+'&cuid='+this.cuid+'&token='+this.token+'&appkey='+$("input#currentappkey").val();
                      this.sign=$.md5(md5.toLowerCase());
                    }
                }
            });

            var cinfo=encodeURIComponent('{"uid":"'+randomnum(10)+'"}');
            var md5=vm.appid+vm.channelid+cinfo+$("input#currentappkey").val();
            var sign=$.md5(md5.toLowerCase()).toLowerCase();
            var data='appid='+vm.appid+'&channelid='+vm.channelid+'&cinfo='+encodeURIComponent(cinfo)+'&device='+'&sign='+sign;

            $.ajax({
                    url:"http://mulitchannel.ddianle.com/api/v1/tokeninfo",
                    dataType: "json",
                    type:'post',
                    data: data,
                    success: function(data,status,XMLHttpRequest){
                       if(data.code==0){
                         vm.cuid=data.data.cuid
                         vm.token=data.data.token;
                         vm.md5();
                       }
                    },
                    error: function(XMLHttpRequest, status, errorThrown){

                    }
              });

          });
