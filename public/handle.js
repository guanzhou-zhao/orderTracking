$(document).ready(function(){
    $("#change_pass_link").click(function(){
        showOverlay()
        showChangePassPanel()
    });
});

function showOverlay() {
  document.getElementById("overlay").style.display = "block";
}
function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}
function showChangePassPanel() {
  var panelHTML =  '   <div class="container" id="change_pass_panel">  '  +
 '     <div class="row">  '  +
 '       <div class="col-md-offset-4 col-md-4  col-sm-offset-1 col-sm-10 col-sm-offset-1">  '  +
 '         <div class="panel panel-default" style="margin-top: 40px;">  '  +
 '           <div class="panel-heading">  '  +
 '             <h3 class="panel-title">修改密码</h3>  '  +
 '           </div>  '  +
 '           <div class="panel-body">  '  +
 '             <form  action="/user/changepass" method="POST" class="form-horizontal">  '  +
 '               <div class="form-group">  '  +
 '                 <div class="col-sm-offset-1 col-sm-10 col-sm-offset-1">  '  +
 '                   <input type="text" name="old_pass" class="form-control" id="inputEmail3" placeholder="旧密码">  '  +
 '                 </div>  '  +
 '               </div>  '  +
 '               <div class="form-group">  '  +
 '                 <div class="col-sm-offset-1 col-sm-10 col-sm-offset-1">  '  +
 '                   <input type="text" name="new_pass" class="form-control" id="inputPassword3" placeholder="新密码">  '  +
 '                 </div>  '  +
 '               </div>  '  +
 '               <div class="form-group">  '  +
 '                 <div class="col-sm-offset-1 col-sm-10 col-sm-offset-1">  '  +
 '                   <button type="submit" class="btn btn-default">确定</button>  '  +
 '                   <button type="button" class="btn btn-default" id="change_pass_panel_cancel">取消</button>  '  +
 '                 </div>  '  +
 '               </div>  '  +
 '             </form>  '  +
 '           </div>  '  +
 '         </div>  '  +
 '       </div>  '  +
 '     </div>  '  +
 '  </div>  ' ;

 $('#overlay').append(panelHTML);

 $("#change_pass_panel_cancel").click(function() {
   $('#change_pass_panel').remove()
   hideOverlay()
 })
}
