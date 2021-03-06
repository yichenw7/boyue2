$(document).ready(function() {
      var vm=new Vue({
         delimiters: ['${', '}'],
        el: "#container",
        data: {
            name:"",
            code:"",
            describes:"",
            inputFile:""
        },
        methods: {
          submit:function(){

            if($("#icon").val()==""){
              alert("请上传icon！");
              return;
            }
            if(vm.name==""){
              alert("请填写游戏名字！");
              return;
            }
            if(vm.code==""){
              alert("请填写游戏代号！");
              return;
            }
            var regu =/^[a-zA-Z][a-zA-Z0-9]*$/;
            var re = new RegExp(regu);
            if (!re.test(vm.code)) {
                alert("游戏代号不能以数字开头，并且只允许输入英文及数字！");
                return;
              }
            if(vm.describes==""){
              alert("请填写游戏描述！");
              return;
            }
            var md5=vm.name+vm.code+vm.describes;
            var appkey=$.md5(md5.toLowerCase());
            var datas={"name": vm.name,"code":vm.code,"describes":vm.describes,"appkey":appkey,"icon":$("#icon").val()};
                $.ajax({
                        url:"/addgame",
                        dataType: "json",
                        type:'post',
                        async:false,
                        data: datas,
                        success: function(data){
                          if(data.code==200){
                            alert('操作成功');
                              loadUrl('gamelist');
                          }else if(data.code==-300){
                            alert('登录过期 请重新登录');
                            window.location.href="/";
                          }else{
                            alert('操作失败');
                              loadUrl('gamelist');
                          }


                        },
                        error: function(XMLHttpRequest, status, errorThrown){
                          alert('操作失败');
                          loadUrl('gamelist');
                        }
                  });
          }
        }
      });


      var uploader = Qiniu.uploader({
                           runtimes: 'html5,flash,html4',    //上传模式,依次退化
                           browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                           uptoken_url: '/token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                           // uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                            unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
                           // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
                           domain: 'http://oo0zxd3f1.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                           get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                           container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
                           max_file_size: '20mb',           //最大文件体积限制
                           filters : {
                             mime_types: [
                               {title : "Image files", extensions : "png"} // 限定jpg,gif,png后缀上传

                            ]},
                           flash_swf_url: '../plupload/Moxie.swf',  //引入flash,相对路径
                           max_retries: 3,                   //上传失败最大重试次数
                           dragdrop: true,                   //开启可拖曳上传
                           drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                           chunk_size: '4mb',                //分块上传时，每片的体积
                           auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                           multi_selection: false,
                           init: {
                               'FilesAdded': function(up, files) {
                                   plupload.each(files, function(file) {
                                       // 文件添加进队列后,处理相关的事情
                                   });
                               },
                               'BeforeUpload': function(up, file) {
                                      // 每个文件上传前,处理相关的事情
                                      $("p#tips").text("开始上传");
                               },
                               'UploadProgress': function(up, file) {
                                      // 每个文件上传时,处理相关的事情
                               },
                               'FileUploaded': function(up, file, info) {

                                      // 每个文件上传成功后,处理相关的事情
                                      // 其中 info 是文件上传成功后，服务端返回的json，形式如
                                      // {
                                      //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                      //    "key": "gogopher.jpg"
                                      //  }
                                      // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                                        $("p#tips").text("上传成功！");
                                      var domain = up.getOption('domain');
                                      var res = jQuery.parseJSON(info);
                                      var sourceLink = domain +"/"+ res.key; //获取上传成功后的文件的Url

                                      $("#uploadimg").attr('src', sourceLink);
                                      $("#icon").val(sourceLink);

                               },
                               'Error': function(up, err, errTip) {
                                      //上传出错时,处理相关的事情
                                       $("p#tips").text("上传失败！");
                               },
                               'UploadComplete': function() {
                                      //队列文件处理完毕后,处理相关的事情
                               },
                              //  'Key': function(up, file) {
                              //      // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                              //      // 该配置必须要在 unique_names: false , save_key: false 时才生效
                               //
                              //      var key = "multisdk";
                              //      // do something with key here
                              //      return key
                              //  }
                           }
                       });


  });
