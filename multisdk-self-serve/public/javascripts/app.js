$(document).ready(function() {
    init();
});

function init(){
'use strict';
  var menu = Handlebars.compile($("#menu-template").html());
    $('#body-left').html(menu());

  $('ul.nav > li').click(function (e) {
    $('ul.nav > li').removeClass('active');
    $(this).addClass('active');
  });

  var template = Handlebars.compile($("#gamelist-template").html());
    $('#body-right').html(template());

  loadjs("game.js");
  initLoading();
}


function loadUrl(url){
  'use strict';
  let template = Handlebars.compile($("#"+url+"-template").html());
    $('#body-right').html(template());
    if(url.indexOf("testlogin")>=0){
      loadjs("testlogin.js");
      return;
    }
    if(url.indexOf("testpay")>=0){
      loadjs("testpay.js");
      return;
    }
    if(url.indexOf("gamelist")>=0){
      loadjs("game.js");
      return;
    }
    if(url.indexOf("paycallbacks")>=0){
      loadjs("paycallback.js");
      return;
    }
    if(url.indexOf("paycallbacklist")>=0){
      loadjs("paycallbacklist.js");
      return;
    }
    if(url.indexOf("packagelist")>=0){
      loadjs("packagelist.js");
      return;
    }
    if(url.indexOf("addpaycallback")>=0){
      loadjs("addpaycallback.js");
      return;
    }
    if(url.indexOf("addgame")>=0){
      loadjs("addgame.js");
      return;
    }
    if(url.indexOf("setadmin")>=0){
      loadjs("getgameadminlist.js");
      return;
    }
    if(url.indexOf("ordermgt")>=0){
      loadjs("getgameorder.js");
      return;
    }
}

function loadpaycallback(id){
  'use strict';
  let data = {"id":id}
  let template = Handlebars.compile($("#"+"addpaycallback"+"-template").html());
    $('#body-right').html(template(data));
    loadjs("editpaycallback.js");
}

function loadGameDetail(lefturl,righturl,id,appid,appkey,name,icon){
  'use strict';
  let menu = Handlebars.compile($("#"+lefturl+"-template").html());
    $('#body-left').html(menu());
    loadjs("gamemenu.js");
  let  template = Handlebars.compile($("#"+righturl+"-template").html());
    $('#body-right').html(template());
      $("#currentappkey").val(appkey);
      $("#currentappid").val(appid);
      $("#currentid").val(id);
      $("#appid").text(appid);
      $("#appname").text(name);
      $("#menuicon").attr('src',icon);
      loadjs("paycallback.js");

}

function loadmain(lefturl,righturl){
  'use strict';
  let menu = Handlebars.compile($("#"+lefturl+"-template").html());
    $('#body-left').html(menu());
  let  template = Handlebars.compile($("#"+righturl+"-template").html());
    $('#body-right').html(template());
    $('ul.nav > li').click(function (e) {
      $('ul.nav > li').removeClass('active');
      $(this).addClass('active');
    });
    loadjs("game.js");

}

function loadjs(js){
  new_element=document.createElement("script");
  new_element.setAttribute("type","text/javascript");
  new_element.setAttribute("src","javascripts/"+js);
  document.body.appendChild(new_element);
}

function randomnum(size){
  var num="";
  for(var i=0;i<size;i++)
  {
    num+=Math.floor(Math.random()*10);
  }
  return num;
}

function logout(){
  if(!confirm("确定要退出吗？")){return ;}
  window.location.href="/logout";
}

//数据库数量，分页大小，当前分页
function setPagination(pagecount,pagesize,currentpage){
    if(pagecount>0){
        $(function(){
        //分页功能
        var options = {
          currentPage:currentpage,
          totalPages: (pagecount + pagesize -1) / pagesize,
          numberOfPages:5,
          bootstrapMajorVersion:3,
          onPageClicked:function (event, originalEvent, type, page) {
              searchs(page);
          }
        }
        $('#pagination').show().bootstrapPaginator(options);
      })
    }
}


function initLoading(){
    $("body").append("<!-- loading -->" +
            "<div class='modal fade' id='loading' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' data-backdrop='static'>" +
            "<div class='modal-dialog' role='document'>" +
            "<div class='modal-content'>" +
            "<div class='modal-header'>" +
            "<h4 class='modal-title' id='myModalLabel'>提示</h4>" +
            "</div>" +
            "<div id='loadingText' class='modal-body'>" +
            "<img  src='/images/loading.gif'/> 处理中，请稍候。。。" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>"
    );
}

function showLoading(text){
    $("#loadingText").html(text);
    $("#loading").modal("show");
}

function hideLoading(){
    $("#loading").modal("hide");
}
