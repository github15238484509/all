layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'laydate', 'table', 'common','public','form','element'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            table = layui.table,
            element = layui.element,
            laydate=layui.laydate;
        var tool = layui.public.tool;
        var advertInfo={}
        var field={
            type:'0',
            status:'',
            jump_type:''
        };
        //判断是否有置顶广告
        function getAdvert(type){
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=adspace/AdspaceTop',
                method:'post',
                data:{
                    type:type
                },
                success: function (res) {
                    if (res.code == 0) {
                        advertInfo=res.data[0]
                        $('.add').empty()
                        if(res.data.length==0){
                            $('.add').append(`
                                <label class="layui-form-label" style="width:100px">置顶广告位：</label>
                                <div class="layui-input-inline">
                                    <button class="layui-btn add_jump_link" id='1'>
                                        添加广告（无跳转）
                                    </button>
                                </div>
                                <div class="layui-input-inline">
                                    <button class="layui-btn add_jump_link" id='2'>
                                        添加广告（跳转链接）
                                    </button>
                                </div>
                                <div class="layui-input-inline history">
                                    查看历史置顶广告
                                </div>
                            `)
                        }else{
                            $('.add').append(`
                                <label class="layui-form-label" style="width:100px">置顶广告位：</label>
                                <div class="layui-input-inline">
                                    <button class="layui-btn editAdvert">
                                        编辑广告
                                    </button>
                                </div>
                                <div class="layui-input-inline">
                                    <button class="layui-btn layui-btn-danger delete">
                                        清除广告
                                    </button>
                                </div>
                                <div class="layui-input-inline history">
                                    查看历史置顶广告
                                </div>
                            `)
                        }
                    } else {
                        layer.msg(res.msg);
                    }
                }
            })
        }
        getAdvert(field.type)

        //显示跳转类型
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=banner/jump/getJumpTypeList',
            success: function (res) {
                if(res.code == 0){
                    var data = res.data
                    $('.jump_type').empty()
                    $('.jump_type').append(`
                        <option value="" selected>请选择</option>
                    `)
                    data.forEach(items=>{
                        $('.jump_type').append(`
                            <option value="${items.id}">${items.jump_type_name}</option>
                        `)
                    })
                    layui.form.render("select");
                }
            }
        })
         //添加广告置顶
        $('.add').on('click','.add_jump_link',function(){
            var jump_name=''
            var jump_id = $(this).attr('id')
            if(jump_id=='1'){
                jump_name='无跳转'
            }else if(jump_id=='2'){
                jump_name='跳转链接'
            }
            admin.popup({
                id:'addTopAdvert',
                title: '添加置顶广告'
                , area: ['800px', '600px']
                , success: function () {
                    view(this.id).render('/template/advertisement/addTopAdvert', {
                        jump_id:jump_id,
                        jump_name:jump_name,
                        type:field.type
                    });
                }
            });
        })
        //编辑广告置顶
        $('.add').on('click','.editAdvert',function(){
            var jump_name=''
            if(advertInfo.jump_type=='1'){
                jump_name='无跳转'
            }else if(advertInfo.jump_type=='2'){
                jump_name='跳转链接'
            }
            advertInfo.jump_name=jump_name
            admin.popup({
                id:'addTopAdvert',
                title: '编辑置顶广告'
                , area: ['800px', '600px']
                , success: function () {
                    view(this.id).render('/template/advertisement/addTopAdvert', advertInfo);
                }
            });
        })
        //清除广告置顶
        $('.add').on('click','.delete',function(){
            tool.delTableLine({
                url: 'adspace/AdspaceDel',
                param: {
                    space_index:advertInfo.space_index
                },
                success: function (res) {
                    parent.layui.table.reload("advert1");
                    parent.layui.table.reload("advert2");
                    getAdvert(field.type)
                }
            });
        })
        //查看历史置顶
        $('.add').on('click','.history',function(){
            admin.popup({
                id:'lookAdvert',
                title: '历史置顶广告'
                , area: ['1100px', '500px']
                , success: function () {
                    view(this.id).render('/template/advertisement/lookAdvert', {
                        type:field.type
                    });
                }
            });
        })
        //添加广告位
        $('.addAdvert').click(function(){
            admin.popup({
                id:'addAdvert',
                title: '添加广告位'
                , area: ['600px', '500px']
                , success: function () {
                    view(this.id).render('/template/advertisement/addAdvert', {
                        type:field.type
                    });
                }
            });
        })
        //切换tabbar
        element.on('tab(docDemoTabBrief)', function (data) {
            console.log(data)
            var index = data.index
            if(index==0){
                field.type="0"
                render_table1(field)
            }else if(index==1){
                field.type="1"
                render_table2(field)
            }
            getAdvert(field.type)
        });
         //搜索
         form.on('submit(search1)', function (data) {
            if(field.type=="0"){
                data.field.type="0"
                render_table1(data.field)
            }else{
                data.field.type="1"
                render_table2(data.field)
            }
        });
        form.render()
        var cols=[
            [{
                field: 'space_index',
                title: '序号',
                align: 'center',
            }, {
                field: 'jump_type',
                title: '跳转类型',
                align: 'center',
                templet:function(d){
                    return d.jump_type=='4'?'线上店铺首页':d.jump_type=='3'?'商品详情':d.jump_type=='5'?'线下店铺':d.jump_type=='6'?'头条详情':'任务详情'
                }
            }, {
                field: 'describe',
                title: '描述',
                align: 'center',
            }, 
            {
               field: 'sort',
               title: '排序',
               align: 'center',
               templet: function (d) {
                   var div = `<div>
                               <input style="text-align:center;width:60px" class="save" type="number" value='${d.sort}'>
                               <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                              </div>`
                   return [div]
               }
           },  {
                field: 'status',
                title: '状态',
                align: 'center',
                templet: function(d){
                    return `<input type="checkbox" name="status" value="${d.space_index}" lay-skin="switch" lay-text="启用|禁用" lay-filter="statusSwitch" ${ d.status == 0 ? 'checked' : '' }>`
                }
            },
            {
                fixed: 'right',
                align: 'center',
                title: '操作',
                width:180,
                templet: function (d) {
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'del'>删除</button></div>`
                }
            }]
        ]
        // ~~~~~~~~~~~~~~~~全部~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#advert1',
               url: layui.setter.requestUrl + 'api.php?c=adspace/AdspaceList',
               method:'post',
               where: data,
               cols: cols,
               page: true,
           });
       }
        //先自调用请求渲染数据
        render_table1(field);
        //监听轮播图是否显示操作
        form.on('switch(statusSwitch)', function(obj){
            let type=''
            if(obj.elem.checked){
                type='0'
            }else{
                type='1'
            }
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=adspace/AdspaceStatus',
                data:{
                    space_index:obj.value,
                    status:type
                },
                success: function (res) {
                    if (res.code == 0) {
                        layer.msg(res.msg);
                        parent.layui.table.reload("advert1");
                    } else {
                        layer.msg(res.msg);
                    }
                }
            })
        });
        table.on('tool(advert1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'adspace/AdspaceDel',
                    param: {
                        space_index:data.space_index
                    },
                    success: function (res) {
                        parent.layui.table.reload("advert1");
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=adspace/AdspaceSortEdit',
                    data:{
                        space_index:data.space_index,
                        sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("advert1");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'addAdvert',
                    title: '编辑广告位'
                    , area: ['600px', '500px']
                    , success: function () {
                        view(this.id).render('/template/advertisement/addAdvert', data);
                    }
                });
            }
        })
         // ~~~~~~~~~~~~~~~~支付~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table2 = function (data) {
            table.render({
                elem: '#advert2',
                url: layui.setter.requestUrl + 'api.php?c=adspace/AdspaceList',
                method:'post',
                where: data,
                cols: cols,
                page: true,
            });
        }

        table.on('tool(advert2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'adspace/AdspaceDel',
                    param: {
                        space_index:data.space_index
                    },
                    success: function (res) {
                        parent.layui.table.reload("advert2");
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=adspace/AdspaceSortEdit',
                    data:{
                        space_index:data.space_index,
                        sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("advert2");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'addAdvert',
                    title: '编辑广告位'
                    , area: ['600px', '500px']
                    , success: function () {
                        view(this.id).render('/template/advertisement/addAdvert', data);
                    }
                });
            }
        })
    });
    //对外暴露的接口
    exports('advert', {});
})