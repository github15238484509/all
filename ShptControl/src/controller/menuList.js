layui.define(function (exports) {
   layui.use(['jquery','layer','laytpl','setter','view','admin','form','upload','layer','table','setter','common'],function(){
    var $ = layui.$
    , layer = layui.layer
    , laytpl = layui.laytpl
    , setter = layui.setter
    , view = layui.view
    , admin = layui.admin
    , form = layui.form,
    upload = layui.upload,
    layer = layui.layer,
    table = layui.table,
  setter = layui.setter;
  IsshowAnNiu = layui.common.IsshowAnNiu;
  var menuPermissions = IsshowAnNiu('addviews');  //菜单权限;
  form.render();
  //功能菜单管理
  menuFeature('');
  function menuFeature(parent_id) {
    table.render({
      elem: '#menu_function'
      , url: layui.setter.requestUrl + '/api.php?c=menu/sonMenuList'//数据接口
      , where: {
        parent_id: parent_id
      }
      , page: true //开启分页
      , cols: [[ //表头
        {
          field: 'title',
          title: '菜单名称',
          fixed: 'left'
        },
        {
          field: 'parent_name',
          title: '归属分类',
          fixed: 'left'
        },
        {
          field: 'url',
          title: '菜单地址',
          fixed: 'left'
        },
        {
          field: 'menu_desc',
          title: '菜单描述',
          fixed: 'left'
        },
        {
          field: 'status',
          title: '状态',
          fixed: 'left',
          templet: function (d) {
            if (d.status == '1') {
              return '启用'
            }
            return '禁用'
          }
        },
        {
          field: 'id',
          title: '排序',
          fixed: 'left',
          align: 'center',
          toolbar: '#sorting'
        },
        {
          field: 'id',
          title: '操作',
          fixed: 'left',
          toolbar: '#operation'
        },
      ]]
    });
  }
  //获取菜单分类
  get_menu_classification();
  function get_menu_classification() {
    table.render({
      elem: '#menu_classification'
      , url: layui.setter.requestUrl + '/api.php?c=menu/menuList'//数据接口
      , page: true //开启分页
      , cols: [[ //表头
        {
          field: 'title',
          title: '菜单名称',
          fixed: 'left'
        },
        {
          field: 'image',
          title: '图标',
          fixed: 'left',
          align: 'center',
          templet: function (d) {
            return `<i class="layui-icon ${d.image}"></i>`
          }
        },
        {
          field: 'menu_desc',
          title: '菜单描述',
          fixed: 'left'
        },
        {
          field: 'status',
          title: '状态',
          fixed: 'left',
          templet: function (d) {
            if (d.status == '1') {
              return '启用'
            }
            return '禁用'
          }
        },
        {
          field: 'id',
          title: '排序',
          fixed: 'left',
          align: 'center',
          toolbar: '#sorting'
        },
        {
          field: 'id',
          title: '操作',
          fixed: 'left',
          toolbar: '#operation'
        },
      ]]
    });
  };
  //获取系统列表
  getSystemList();
  function getSystemList() {
    table.render({
      elem: '#system'
      , url: layui.setter.requestUrl + '/api.php?c=system_list/getSystemList'//数据接口
      , page: true //开启分页
      , cols: [[ //表头
        {
          field: 'system_name',
          title: '系统名称',
          fixed: 'left'
        },
        {
          field: 'system_type',
          title: '系统类型',
          fixed: 'left',
          align: 'center'
        },
        {
          field: 'system_des',
          title: '系统说明描述',
          fixed: 'left'
        },
        {
          field: 'status',
          title: '状态',
          fixed: 'left',
          templet: function (d) {
            if (d.status == '1') {
              return '启用'
            }
            return '禁用'
          }
        },
        {
          field: 'sort',
          title: '排序',
          fixed: 'left',
          align: 'center',
          toolbar: '#sorting'
        },
        {
          field: 'id',
          title: '操作',
          fixed: 'left',
          toolbar: '#operation'
        }
      ]]
    });
  };
  table.on('tool(system)', function (obj) {
    var data = obj.data;
    var layEvent = obj.event;
    switch (layEvent) {
      case 'upward':
        upSystem(data.system_index, data.sort);
        break;
      case 'down':
        downSystem(data.system_index, data.sort);
        break;
      case 'edit':
        editSystemMenu(data);
        break;
      case 'del':
        delSystemMenu(data.system_index);
        break;
    }
  });
  table.on('tool(menu_function)', function (obj) {
    var data = obj.data;
    var layEvent = obj.event;
    switch (layEvent) {
      case 'upward':
        upMenu(data.id, data.sort, 2);
        break;
      case 'down':
        downMenu(data.id, data.sort, 2);
        break;
      case 'edit':
        getMenuInfo(data.id, 2);
        break;
      case 'del':
        delMenu(data.id);
        break;
    }
  });
  table.on('tool(menu_classification)', function (obj) {
    var data = obj.data;
    var layEvent = obj.event;
    switch (layEvent) {
      case 'upward':
        upMenu(data.id, data.sort, 1);
        break;
      case 'down':
        downMenu(data.id, data.sort, 1);
        break;
      case 'edit':
        getMenuInfo(data.id, 1);
        break;
      case 'del':
        delMenu(data.id);
        break;
    }
  });
  //菜单管理和功能菜单上移
  function upMenu(id, sort, type) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=menu/upMenu',
      type: 'get',
      data: {
        id,
        sort,
        type: type
      },
      done: function (res) {
        if (res.code == 0) {
          if (res.data.is_first == '1') {
            return layer.msg(res.msg);
          }
          menuFeature('');
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  }
  //菜单管理和功能菜单下移
  function downMenu(id, sort, type) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=menu/downMenu',
      type: 'get',
      data: {
        id,
        sort,
        type: type
      },
      done: function (res) {
        if (res.code == 0) {
          if (res.data.is_first == '1') {
            return layer.msg(res.msg);
          }
          menuFeature('');
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  }
  $('.addFuntionMenu').on('click', function () {
    layer.open({
      type: 1,
      title: '添加/修改功能菜单',
      area: ['600px', '600px'],
      shadeClose: true, //点击遮罩关闭
      content: `
                    <form class="layui-form" action="">
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单名称</label>
                          <div class="layui-input-block">
                            <input type="text" name="title" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入菜单名称" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单地址</label>
                          <div class="layui-input-block">
                            <input type="text" name="url" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入菜单地址" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单描述</label>
                          <div class="layui-input-block">
                            <textarea style="width:80%;" name="menu_desc" lay-verify="required" placeholder="请输入菜单描述" class="layui-textarea"></textarea>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">归属分类</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="parent_id" lay-filter="aihao" lay-verify="required" id="parent_id">
                              <option value="">请选择菜单分类</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单权限</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="employee_type" lay-verify="required" lay-filter="aihao">
                              <option value="">请选择菜单权限</option>
                              <option value="0">账号管理员可见</option>
                              <option value="1">系统管理员可见</option>
                              <option value="2">设置权限后可见</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">归属系统</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="system_type" lay-verify="required" lay-filter="aihao" id="system_type">
                              <option value="">请选择菜单归属系统</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否启用菜单</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox" name="status"  lay-skin="switch" lay-filter="switchTest"  title="开关">
                            <div style="margin-left:10px;">启用后可分配菜单权限给后台账号</div>
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否作为登录页</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox"  name="is_home_page" lay-skin="switch" lay-filter="switchTest"   title="开关">
                            <div style="margin-left:10px;">启用后可作为后台的首页</div>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <div class="layui-input-block" style="width:200px;margin:0 auto;">
                            <button type="submit" class="layui-btn" style="width:100%;" lay-submit="" lay-filter="save">保存</button>
                          </div>
                        </div>
                     </form>      
                    `, //这里content是一个普通的String  
      success: function () {
        form.render();
        getMenuLists('', $('#parent_id'));
        getSystemLists('');
        form.on('submit(save)', function (d) {
          if (d.field.is_home_page) {
            d.field.is_home_page = 1;
          } else {
            d.field.is_home_page = 0;
          }
          if (d.field.status) {
            d.field.status = 1;
          } else {
            d.field.status = 0;
          }
          addMenu(d.field);
          return false;
        })
      }
    })
  })
  $('.addMenuClassification').on('click', function () {
    layer.open({
      type: 1,
      title: '添加/修改功能菜单',
      area: ['600px', '500px'],
      shadeClose: true, //点击遮罩关闭
      content: `
                    <form class="layui-form" action="">
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单名称</label>
                          <div class="layui-input-block">
                            <input type="text" name="title" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入菜单名称" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单简介</label>
                          <div class="layui-input-block">
                            <textarea style="width:80%;" name="menu_desc" lay-verify="required" placeholder="请输入菜单描述" class="layui-textarea"></textarea>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单图标</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;">
                            <input type="text" name="image" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入图标代码" class="layui-input menuIcon">
                            <i class="layui-icon" id="menu_icon"></i>   
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否启用菜单</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox" name="status"  lay-skin="switch" lay-filter="switchTest"  title="开关">
                            <div style="margin-left:10px;">启用后可分配菜单权限给后台账号</div>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单权限</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="employee_type" lay-verify="required" lay-filter="aihao">
                              <option value="">请选择菜单权限</option>
                              <option value="0">账号管理员可见</option>
                              <option value="1">系统管理员可见</option>
                              <option value="2">设置权限后可见</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">归属系统</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="system_type" lay-verify="required" lay-filter="aihao" id="system_type">
                              <option value="">请选择菜单归属系统</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <div class="layui-input-block" style="width:200px;margin:0 auto;">
                            <button type="submit" class="layui-btn" style="width:100%;" lay-submit="" lay-filter="save">保存</button>
                          </div>
                        </div>
                        <div style="margin-left:30px;">注意：菜单分类需要统一规划，请勿擅自添加菜单分类</div>
                     </form>      
                        `, //这里content是一个普通的String  
      success: function () {
        form.render();
        getMenuLists('', $('#parent_id'));
        getSystemLists('');
        $('.menuIcon').on('input', function () {
          if ($(this).val().indexOf('&') != -1) {
            $('#menu_icon').html($(this).val());
            $('#menu_icon').removeClass();
            $('#menu_icon').addClass('layui-icon');
          } else {
            $('#menu_icon').html();
            $('#menu_icon').removeClass();
            $('#menu_icon').addClass('layui-icon');
            $('#menu_icon').addClass($(this).val());
          }
        })
        form.on('submit(save)', function (d) {
          if (d.field.is_home_page) {
            d.field.is_home_page = 1;
          } else {
            d.field.is_home_page = 0;
          }
          if (d.field.status) {
            d.field.status = 1;
          } else {
            d.field.status = 0;
          }
          addMenu(d.field);
          return false;
        })
      }
    })
  })
  function editClassification(data) {
    layer.open({
      type: 1,
      title: '添加/修改功能菜单',
      area: ['600px', '500px'],
      shadeClose: true, //点击遮罩关闭
      content: `
                    <form class="layui-form" lay-filter="formTest" action="">
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单名称</label>
                          <div class="layui-input-block">
                            <input type="text" name="title" style="width:80%;" value="${data.title}" lay-verify="required" autocomplete="off" placeholder="请输入菜单名称" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单简介</label>
                          <div class="layui-input-block">
                            <textarea style="width:80%;" name="menu_desc" lay-verify="required" placeholder="请输入菜单描述" class="layui-textarea">${data.menu_desc}</textarea>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单图标</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;">
                            <input type="text" name="image" style="width:80%;" value="${data.image}" lay-verify="required" autocomplete="off" placeholder="请输入菜单图标" class="layui-input menuIcon">
                            <i class="layui-icon ${data.image.indexOf('&') != -1 ? '' : data.image}" id="menu_icon">${data.image.indexOf('&') != -1 ? data.img : ''}</i>   
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否启用菜单</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox" name="status"  lay-skin="switch" lay-filter="switchTest"  title="开关">
                            <div style="margin-left:10px;">启用后可分配菜单权限给后台账号</div>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单权限</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="employee_type" id="employee_type" lay-verify="required" lay-filter="aihao">
                              <option value="">请选择菜单权限</option>
                              <option value="0">账号管理员可见</option>
                              <option value="1">系统管理员可见</option>
                              <option value="2">设置权限后可见</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">归属系统</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="system_type" lay-verify="required" lay-filter="aihao" id="system_type">
                              <option value="">请选择菜单归属系统</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <div class="layui-input-block" style="width:200px;margin:0 auto;">
                            <button type="submit" class="layui-btn" style="width:100%;" lay-submit="" lay-filter="save">保存</button>
                          </div>
                        </div>
                        <div style="margin-left:30px;">注意：菜单分类需要统一规划，请勿擅自添加菜单分类</div>
                     </form>      
                    `, //这里content是一个普通的String  
      success: function () {
        getMenuLists(data.parent_id, $('#parent_id'));
        getSystemLists(data.system_type);
        $('#employee_type').val(data.employee_type);
        form.val("formTest", {
          status: data.status == '1' ? 'on' : '',
          is_home_page: data.is_home_page == "1" ? 'on' : ''
        })
        $('.menuIcon').on('input', function () {
          if ($(this).val().indexOf('&') != -1) {
            $('#menu_icon').html($(this).val());
            $('#menu_icon').removeClass();
            $('#menu_icon').addClass('layui-icon');
          } else {
            $('#menu_icon').html();
            $('#menu_icon').removeClass();
            $('#menu_icon').addClass('layui-icon');
            $('#menu_icon').addClass($(this).val());
          }
        })
        form.render();
        form.on('submit(save)', function (d) {
          d.field.id = data.id;
          if (d.field.is_home_page) {
            d.field.is_home_page = 1;
          } else {
            d.field.is_home_page = 0;
          }
          if (d.field.status) {
            d.field.status = 1;
          } else {
            d.field.status = 0;
          }
          addMenu(d.field);
          return false;
        })
      }
    })
  }
  getMenuLists('', $('#attribution_menu'));
  form.on('select(attribution_menu)', function (d) {
    menuFeature(d.elem.value);
  });
  //菜单归属分类获取
  function getMenuLists(getMenuLists, DOM) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=menu/menuLists',
      type: 'get',
      done: function (res) {
        if (res.code == 0) {
          res.data.forEach(item => {
            DOM.append(`
                      <option value="${item.id}">${item.title}</option> 
                   `)
          })
          DOM.val(getMenuLists);
          form.render();
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  }
  //获取归属分类
  function getSystemLists(system_index) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=system_list/getSystemLists',
      type: 'get',
      done: function (res) {
        if (res.code == 0) {
          res.data.forEach(item => {
            $('#system_type').append(`
                      <option value="${item.system_index}">${item.system_name}</option> 
                   `)
          })
          $('#system_type').val(system_index)
          form.render();
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  }
  //添加功能菜单
  function addMenu(filed) {
    admin.req({
      url: layui.setter.requestUrl + 'api.php?c=menu/upMenuInfo',
      type: 'post',
      data: filed,
      done: function (res) {
        if (res.code == 0) {
          layer.msg(res.msg);
          menuFeature('');
          get_menu_classification();
          setTimeout(function () {
            layer.closeAll();
          }, 1000)
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  };
  function delMenu(id) {
    layer.confirm('确认要删除吗？', { icon: 3, title: '删除' }, function (index) {
      admin.req({
        url: layui.setter.requestUrl + '/api.php?c=menu/delMenu',
        type: 'get',
        data: {
          id: id
        },
        done: function (res) {
          if (res.code == 0) {
            layer.msg(res.msg);
            menuFeature('');
            get_menu_classification();
          } else {
            layer.msg(res.msg, { icon: 5 });
          }
        }
      });
    })
  }
  function getMenuInfo(id, type) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=menu/getMenuInfo',
      type: 'get',
      data: {
        id: id,
        type: type
      },
      done: function (res) {
        if (res.code == 0) {
          if (type == 1) {
            editClassification(res.data);
          } else {
            editFunMenu(res.data);
          }
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  };
  //编辑功能菜单
  function editFunMenu(data) {
    layer.open({
      type: 1,
      title: '添加/修改功能菜单',
      area: ['600px', '600px'],
      shadeClose: true, //点击遮罩关闭
      content: `
                    <form class="layui-form" lay-filter="formTest" action="">
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单名称</label>
                          <div class="layui-input-block">
                            <input type="text" name="title" style="width:80%;" value="${data.title}" lay-verify="required" autocomplete="off" placeholder="请输入菜单名称" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单地址</label>
                          <div class="layui-input-block">
                            <input type="text" name="url" style="width:80%;" value="${data.url}" lay-verify="required" autocomplete="off" placeholder="请输入菜单地址" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单描述</label>
                          <div class="layui-input-block">
                            <textarea style="width:80%;" name="menu_desc" lay-verify="required" placeholder="请输入菜单描述" class="layui-textarea">${data.menu_desc}</textarea>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">归属分类</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="parent_id" lay-filter="aihao" lay-verify="required" id="parent_id">
                              <option value="">请选择菜单分类</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">菜单权限</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="employee_type" id="employee_type" lay-verify="required" lay-filter="aihao">
                              <option value="">请选择菜单权限</option>
                              <option value="0">账号管理员可见</option>
                              <option value="1">系统管理员可见</option>
                              <option value="2">设置权限后可见</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">归属系统</label>
                          <div class="layui-input-block" style="width:350px;">
                            <select name="system_type" lay-verify="required" lay-filter="aihao" id="system_type">
                              <option value="">请选择菜单归属系统</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否启用菜单</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox" name="status"  lay-skin="switch" lay-filter="switchTest"  title="开关">
                            <div style="margin-left:10px;">启用后可分配菜单权限给后台账号</div>
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否作为登录页</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox"  name="is_home_page" lay-skin="switch" lay-filter="switchTest"   title="开关">
                            <div style="margin-left:10px;">启用后可作为后台的首页</div>
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <div class="layui-input-block" style="width:200px;margin:0 auto;">
                            <button type="submit" class="layui-btn" style="width:100%;" lay-submit="" lay-filter="save">保存</button>
                          </div>
                        </div>
                     </form>      
                    `, //这里content是一个普通的String  
      success: function () {
        getMenuLists(data.parent_id, $('#parent_id'));
        getSystemLists(data.system_type);
        $('#employee_type').val(data.employee_type);
        form.val("formTest", {
          status: data.status == '1' ? 'on' : '',
          is_home_page: data.is_home_page == "1" ? 'on' : ''
        })
        form.render();
        form.on('submit(save)', function (d) {
          d.field.id = data.id;
          if (d.field.is_home_page) {
            d.field.is_home_page = 1;
          } else {
            d.field.is_home_page = 0;
          }
          if (d.field.status) {
            d.field.status = 1;
          } else {
            d.field.status = 0;
          }
          addMenu(d.field);
          return false;
        })
      }
    })
  }
  //上移系统菜单
  function upSystem(system_index, sort) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=system_list/upSystem',
      type: 'get',
      data: {
        system_index,
        sort
      },
      done: function (res) {
        if (res.code == 0) {
          if (res.data.is_first == '1') {
            return layer.msg(res.msg);
          }
          getSystemList();
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  }
  // 下移系统菜单
  function downSystem(system_index, sort) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=system_list/downSystem',
      type: 'get',
      data: {
        system_index,
        sort
      },
      done: function (res) {
        if (res.code == 0) {
          if (res.data.is_first == '1') {
            return layer.msg(res.msg);
          }
          getSystemList();
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  };
  $('.addSystem').on('click', function () {
    layer.open({
      type: 1,
      title: '添加/修改系统',
      area: ['500px', '450px'],
      shadeClose: true, //点击遮罩关闭
      content: `
                    <form class="layui-form" action="">
                        <div class="layui-form-item">
                          <label class="layui-form-label">系统名称</label>
                          <div class="layui-input-block">
                            <input type="text" name="system_name" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入系统名称" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">系统类型</label>
                          <div class="layui-input-block">
                            <input type="text" name="system_type" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入系统类型" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">系统描述</label>
                          <div class="layui-input-block">
                            <textarea style="width:80%;" name="system_des" lay-verify="required" placeholder="请输入系统描述" class="layui-textarea"></textarea>
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否启用</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox" name="status"  lay-skin="switch" lay-filter="switchTest"  title="开关">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <div class="layui-input-block" style="width:200px;margin:0 auto;">
                            <button type="submit" class="layui-btn" style="width:100%;" lay-submit="" lay-filter="save">保存</button>
                          </div>
                        </div>
                     </form>      
                            `, //这里content是一个普通的String  
      success: function () {
        form.render();
        getMenuLists('', $('#parent_id'));
        getSystemLists('');
        form.on('submit(save)', function (d) {
          if (d.field.status) {
            d.field.status = 1;
          } else {
            d.field.status = 0;
          }
          addEditSystem(d.field);
          return false;
        })
      }
    })
  })
  //编辑系统菜单
  function editSystemMenu(data) {
    layer.open({
      type: 1,
      title: '添加/修改系统',
      area: ['500px', '450px'],
      shadeClose: true, //点击遮罩关闭
      content: `
                    <form class="layui-form" lay-filter="formTest" action="">
                        <div class="layui-form-item">
                          <label class="layui-form-label">系统名称</label>
                          <div class="layui-input-block">
                            <input type="text" name="system_name" value="${data.system_name}" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入系统名称" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">系统类型</label>
                          <div class="layui-input-block">
                            <input type="text" name="system_type" value="${data.system_type}" style="width:80%;" lay-verify="required" autocomplete="off" placeholder="请输入系统类型" class="layui-input">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <label class="layui-form-label">系统描述</label>
                          <div class="layui-input-block">
                            <textarea style="width:80%;" name="system_des" lay-verify="required" placeholder="请输入系统描述" class="layui-textarea">${data.system_des}</textarea>
                          </div>
                        </div>
                        <div class="layui-form-item" pane="">
                          <label class="layui-form-label" style="width:100px;">是否启用</label>
                          <div class="layui-input-block" style="display:flex;align-items:center;color:red;">
                            <input type="checkbox" name="status"  lay-skin="switch" lay-filter="switchTest"  title="开关">
                          </div>
                        </div>
                        <div class="layui-form-item">
                          <div class="layui-input-block" style="width:200px;margin:0 auto;">
                            <button type="submit" class="layui-btn" style="width:100%;" lay-submit="" lay-filter="save">保存</button>
                          </div>
                        </div>
                     </form>      
                            `, //这里content是一个普通的String  
      success: function () {
        form.val("formTest", {
          status: data.status == '1' ? 'on' : '',
        })
        form.render();
        form.on('submit(save)', function (d) {
          d.field.system_index = data.system_index;
          if (d.field.status) {
            d.field.status = 1;
          } else {
            d.field.status = 0;
          }
          addEditSystem(d.field);
          return false;
        })
      }
    })
  };
  function addEditSystem(filed) {
    admin.req({
      url: layui.setter.requestUrl + '/api.php?c=system_list/addEditSystem',
      type: 'get',
      data: filed,
      done: function (res) {
        if (res.code == 0) {
          layer.msg(res.msg)
          getSystemList();
          setTimeout(function () {
            layer.closeAll();
          }, 1000)
        } else {
          layer.msg(res.msg, { icon: 5 });
        }
      }
    });
  }
  function delSystemMenu(id) {
    layer.confirm('确认要删除吗？', { icon: 3, title: '删除' }, function (index) {
      admin.req({
        url: layui.setter.requestUrl + '/api.php?c=system_list/delSystem',
        type: 'get',
        data: {
          system_index: id
        },
        done: function (res) {
          if (res.code == 0) {
            layer.msg(res.msg);
            getSystemList();
          } else {
            layer.msg(res.msg, { icon: 5 });
          }
        }
      });
    })
  }
   })
    //对外暴露的接口
    exports('menuList', {});
  });