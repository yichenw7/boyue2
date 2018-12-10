$(document).ready(function() {
  $('ul.nav > li').click(function (e) {
  $('ul.nav > li').removeClass('active');
  $(this).addClass('active');
  });
  if($("#usertype").val()==2){
    $('li#setadmins').removeAttr("style");
  }
});
