$(document).ready(function(){
    $('[data-toggle="popover"][c-for="delete"]').popover({
      'delay': { "show": 50, "hide": 100 },
      'html': true,
      'content': function() {
        var url = $(this).attr('c-url')
        return `<button type="button" class="btn btn-danger" onclick="deleteObj('${url}')">删除</button>`
      }
    })
    $('[data-toggle="popover"][c-for="resetpass"]').popover({
      'delay': { "show": 50, "hide": 100 },
      'html': true,
      'content': function() {
        var id = $(this).attr('c-id')
        var username = $(this).attr('c-user')

        return `<form action="/user/resetpass" method="POST" class="form-horizontal"><input type="hidden" id="${id}"><div style="margin-bottom: 8px"><input type="text" class="form-control" name="newpass" placeholder="请输入新密码"></div><button type="submit" class="btn btn-success">重置“${username}”的密码</button></form>`
      }
    })
    $('#change_pass_link').click(function(){
        showOverlay()
        showChangePassPanel()
    });
    $('.user_edit_link').click(function(event) {
      var $edit_link = $(this)
      showPopupPanelAndOverlay($edit_link.attr('c-target'), $edit_link.attr('c-data'), event)
    })
    $('#user_edit_form_cancel').click(function(event) {
      hidePopupPanelAndOverlay($(this).attr('c-target'), event)
    })
    $('.user_reset_pass_link').click(function(event) {
      var user = JSON.parse($(this).attr('c-data'))
      var url = `/user/resetpass`

      var r = prompt(`您正在为用户“${user.username}”修改密码，请输入新密码：`);
      if (r) {
        $.post(url, {id: user.id, newpass: r.trim()},function(data, status) {
          console.log(`data, status == ${data}, ${status}`)
        })
      }
    })

    $('.order_edit_link').click(function(event) {
      var $edit_link = $(this)
      showPopupPanelAndOverlay($edit_link.attr('c-target'), $edit_link.attr('c-data'), event)
    })
    $('#order_edit_form_cancel').click(function(event) {
      hidePopupPanelAndOverlay($(this).attr('c-target'), event)
    })
    $('.order_delete_link').click(function(event) {
      var order = JSON.parse($(this).attr('c-data'))
      var url = `/order/delete/${order.id}`

      var confirmText = `您确定删除在${order.created_at}为店铺“${order.shopname}”创建的订单（订单号为：${order.ordernum}）吗？`
      var r = confirm(confirmText);
      if (r) {
        $.get(url, function(data, status) {
          console.log(`data, status == ${data}, ${status}`)
          location.reload()
        })
      }
    })
});
function deleteObj(url) {
  $.get(url, function(data, status) {
    console.log(`data, status == ${data}, ${status}`)
    location.reload()
  })
}
function showPopupPanelAndOverlay(panelID, data, event) {
  event.preventDefault()
  $(panelID).show()
  var order = JSON.parse(data)
  $(panelID).find('input').each(function() {
    $(this).val(order[$(this).attr('name')])
  })
  $(panelID).find('select').each(function() {
    $(this).val(order[$(this).attr('name')])
  })
  var bodyWidthPx = $('body').css('width')
  var panelWidthPx = $(panelID).css('width')
  var toLeft = bodyWidthPx.slice(0, bodyWidthPx.length-2)/2 - panelWidthPx.slice(0, panelWidthPx.length-2)/2
  $(panelID).css('left', `${toLeft}px`)
  showOverlay()
}
function hidePopupPanelAndOverlay(panelID, event) {
    event.preventDefault()
    $(panelID).hide()
    hideOverlay()
}

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
