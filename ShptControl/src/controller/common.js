/**

 @Name：layuiAdmin 公共业务
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(function (exports) {
  var $ = layui.$
    , layer = layui.layer
    , laytpl = layui.laytpl
    , setter = layui.setter
    , view = layui.view
    , admin = layui.admin
  //公共业务的逻辑处理可以写在此处，切换任何页面都会执行
  //……
  // 时间戳转换
  function createTime(data) {
    //data为时间戳
    //data为时间戳
    var date = new Date(data * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    var strDate = Y + '-' + M + '-' + D + ' ' + h + m + s; //转换为年月日时分秒
    return strDate;
  };
  // 时间戳转换
  function createTime1(data) {
    //data为时间戳
    //data为时间戳
    var date = new Date(data * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var strDate = Y + '-' + M + '-' + D ; //转换为年月日
    return strDate;
  };
    //获取当前时间
  function getFormatDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();

    var currentDate = date.getFullYear() + "-" + month + "-" + strDate
            + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return currentDate;
  }
  //退出
  admin.events.logout = function () {
    //执行退出接口
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=login/loginOut'
      , type: 'get'
      , data: {}
      , done: function (res) { //这里要说明一下：done 是只有 response 的 code 正常才会执行。而 succese 则是只要 http 为 200 就会执行

        //清空本地记录的 token，并跳转到登入页
        admin.exit();
      }
    });
  };
  //获取账户菜单权限
  function getMenuPermissions() {
    var result = null;
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=menu/menuCheck'
      , type: 'post'
      , async: false
      , data: {
        jump: window.location.hash
      }
      , done: function (res) {
        result = res.data;
      }
    });
    return result;
  };
  //是否显示按钮
  function IsshowAnNiu(...DOM) {  //
    var result = getMenuPermissions();  //获取状态值
    // if (result.permission == '1') {
    //   for (var i = 0; i < DOM.length; i++) {
    //     $('#' + DOM[i]).hide();
    //   }
    // }
    if (result) {
      collection(result)
    }
    return result
  }
  function collection(result) {
    var isCollection = ''
    isType(result.is_book)
    $('#collection').on('click', function () {
      if (result.is_book == '0') {
        isCollection = 'bookmarks/addBookMarks';
      } else {
        isCollection = 'bookmarks/delBookMarks';
      }
      admin.req({
        url: layui.setter.requestUrl + '/api.php?c=' + isCollection,
        data: {
          jump: window.location.hash
        },
        done: function (res) {
          layer.msg(res.msg);
          result.is_book = res.data.is_mark
          isType(res.data.is_mark)
        }
      })
    })
  }
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  }
  function isType(collectionType) {
    if (collectionType == '1') {
      $('.tubiao').removeClass('layui-icon-rate').addClass('layui-icon-rate-solid')
      $('#addBook').html('取消收藏')
    } else {
      $('.tubiao').removeClass('layui-icon-rate-solid').addClass('layui-icon-rate')
      $('#addBook').html('点击收藏')
    }
  }
  //对外暴露的接口
  exports('common', { createTime,createTime1, getFormatDate,IsshowAnNiu,getQueryVariable});
});