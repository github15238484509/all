layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'contlist', 'table', 'laydate', 'common','public','form','element'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            table = layui.table,
            element = layui.element,
            IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限
        var cols=[]
        var tool = layui.public.tool;
        var field1={
            type:'1',
            name:'',
            parent:'',
        }
        var field2={
            class_id:'',
            status:'-1',
        }
        element.on('tab(classify)', function(data){
            if(data.index==0){
                field1.type="1"
                render_table1(field1);
            }else if(data.index==1){
                field1.type="2"
                render_table2(field1);
            }else{
                render_table3(field2);
            }
        });
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=config_classify/getLevelOne',
            success: function (res) {
                if (res.code == 0) {
                    res.data.forEach(item => {
                        $('.options').append(
                            `<option value="${item.id}">${item.name}</option>`
                        )
                    });
                    form.render()
                } else {
                    layer.msg(res.msg);
                }
            }
        })
        form.render()
        //搜索
        form.on('submit(search1)', function (data) {
            field1.name=data.field.name
            render_table1(field1);
        });
        form.on('submit(search2)', function (data) {
            field1.name=data.field.name
            field1.parent=data.field.parent
            render_table2(field1);
        });
        form.on('submit(search3)', function (data) {
            render_table3(data.field);
        });
        $('.addClass1').click(function(){
            admin.popup({
                id:'addFirstLevel',
                title: '添加一级分类'
                , area: ['500px', '300px']
                , success: function () {
                    view(this.id).render('/template/goods/addFirstLevel', {});
                }
            });
        })
        $('.addClass2').click(function(){
            admin.popup({
                id:'addSecondLevel',
                title: '添加二级分类'
                ,area: ['600px', '450px']
                , success: function () {
                    view(this.id).render('/template/goods/addSecondLevel', {});
                }
            });
        })
        $('.addBanner').click(function(){
            admin.popup({
                id:'addBannerJump',
                title: '添加轮播图（跳转页面）'
                ,area: ['600px', '600px']
                , success: function () {
                    view(this.id).render('/template/goods/addBannerJump', {});
                }
            });
        })
        $('.addBanner1').click(function(){
            admin.popup({
                id:'addBanner',
                title: '添加轮播图（无跳转）'
                ,area: ['600px', '500px']
                , success: function () {
                    view(this.id).render('/template/goods/addBanner', {});
                }
            });
        })
        //渲染分类一数据
        var render_table1 = function (data) {
            table.render({
                elem: '#table1',
                url: layui.setter.requestUrl + 'api.php?c=config_classify/getClassifyList',
                where: data,
                cols: [
                    [{
                        field: 'name',
                        title: '分类名称',
                        align: 'center'
                    }, {
                        field: 'sort',
                        title: '排序',
                        align: 'center',
                        templet: function (d) {
                            var div = `<div>
                                          <input style="text-align:center;width:100px" class="save" type="number" value='${d.sort}'>
                                          <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                                       </div>`
                            return [div]
                        }
                    }, {
                        field: 'num',
                        align: 'center',
                        title: '商品数量'
                    },{
                        field: 'addtime',
                        align: 'center',
                        title: '创建时间',
                        templet:function(d){
                            return layui.common.createTime(d.addtime)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:350,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-event = 'edit'>编辑</button>
                                    <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'del'>删除</button>
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-event = 'look'>查看推荐商品</button>
                                    <button type="button" class="layui-btn layui-btn-sm" lay-event = 'add'>添加推荐商品</button>`
                        }
                    }]
                ],
                page: true,
            });
        }
        //先自调用请求渲染数据
        render_table1(field1);
        var render_table2 = function (data) {
            table.render({
                elem: '#table2',
                url: layui.setter.requestUrl + 'api.php?c=config_classify/getClassifyList',
                where: data,
                cols: [
                    [ {
                        field: 'name',
                        title: '分类名称',
                        align: 'center'
                    }, {
                        field: 'sort',
                        title: '排序',
                        align: 'center',
                        templet: function (d) {
                            var div = `<div>
                                        <input style="text-align:center;width:100px" class="save" type="number" value='${d.sort}'>
                                        <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                                       </div>`
                            return [div]
                        }
                    }, {
                        field: 'num',
                        align: 'center',
                        title: '商品数量'
                    },{
                        field: 'img',
                        title: '分类图标',
                        align: 'center',
                        height: '60px',
                        templet: function (d) {
                            var src = layui.setter.CDN + d.img
                            var str = `<img src = ${src} style="cursor:pointer;width:30px;height:30px" lay-event = 'enlarge'></img>`
                            return str
                        }
                    }, {
                        field: 'addtime',
                        align: 'center',
                        title: '创建时间',
                        templet:function(d){
                            return layui.common.createTime(d.addtime)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'delete'>删除</button>`
                        }
                    }]
                ],
                page: true,
            });
        }
        //渲染轮播图数据
        var render_table3 = function (data) {
            table.render({
                elem: '#bannerTable',
                url: layui.setter.requestUrl + 'api.php?c=config_classify/getBannerList',
                where: data,
                cols: [ 
                    [{
                        field: 'id',
                        title: 'ID',
                        align: 'center',
                        sort: true
                    }, {
                        field: 'banner_pic',
                        title: '轮播图',
                        align: 'center',
                        height: '60px',
                        templet: function (d) {
                            var str = `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                            return str
                        }
                    },{
                        field: 'class_name',
                        title: '所属一级分类',
                        align: 'center'
                    }, {
                        field: 'jump_type_name',
                        title: '类型',
                        align: 'center',
                    },
                    {
                        field: 'status',
                        align: 'center',
                        title: '状态',
                        templet: '#switchTpl'
                    },{
                        field: 'sort',
                        align: 'center',
                        title: '排序',
                        width:170,
                        templet: function (d) {
                            var div = `<div>
                                        <input style="text-align:center;width:100px" class="save" type="number" value='${d.sort}'>
                                        <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                                       </div>`
                            return [div]
                        }
                    }, {
                        field: 'add_time',
                        align: 'center',
                        title: '创建时间',
                        templet:function(d){
                            return layui.common.createTime(d.add_time)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
            });
        }


       
        table.on('tool(table1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'edit'){
                admin.popup({
                    id:'addFirstLevel',
                    title: '编辑一级分类'
                    , area: ['600px', '300px']
                    , success: function () {
                        view(this.id).render('/template/goods/addFirstLevel', data);
                    }
                });
            }else if(layEvent == 'look'){
                admin.popup({
                    id:'lookRecommend',
                    title: '查看推荐商品'
                    , area: ['1200px', '700px']
                    , success: function () {
                        view(this.id).render('/template/goods/lookRecommend', {
                            id:data.id
                        });
                    }
                });
            }else if(layEvent == 'add'){
                admin.popup({
                    id:'addRecommend',
                    title: '添加推荐商品'
                    , area: ['1200px', '700px']
                    , success: function () {
                        view(this.id).render('/template/goods/addRecommend', {
                            id:data.id
                        });
                    }
                });
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'config_classify/delClassify',
                    param: {
                        id:data.id
                    },
                    success: function (res) {
                        table.reload('table1', {
                            url: layui.setter.requestUrl + 'api.php?c=config_classify/getClassifyList',
                            where:field1
                        });
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=config_classify/editClassifySort',
                    data:{
                        id:data.id,
                        sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            table.reload('table1', {
                                url: layui.setter.requestUrl + 'api.php?c=config_classify/getClassifyList',
                                where:field1
                            });
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })
        table.on('tool(table2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.img.split(','));
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'addFirstLevel',
                    title: '编辑二级分类'
                    , area: ['600px', '450px']
                    , success: function () {
                        view(this.id).render('/template/goods/addSecondLevel', data);
                    }
                });
            }else if(layEvent == 'delete'){
                tool.delTableLine({
                    url: 'config_classify/delClassify',
                    param: {
                        id:data.id
                    },
                    success: function (res) {
                        table.reload('table2', {
                            url: layui.setter.requestUrl + 'api.php?c=config_classify/getClassifyList',
                            where:field1
                        });
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=config_classify/editClassifySort',
                    data:{
                        id:data.id,
                        sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            table.reload('table2', {
                                url: layui.setter.requestUrl + 'api.php?c=config_classify/getClassifyList',
                                where:field1
                            });
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })
        table.on('tool(bannerTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.banner_pic.split(','));
            }else if(layEvent == 'edit'){
                if(data.banner_type=='3'){
                    admin.popup({
                        id:'addBannerJump',
                        title: '编辑轮播图'
                        , area: ['600px', '600px']
                        , success: function () {
                            view(this.id).render('/template/goods/addBannerJump', data);
                        }
                    });
                }else{
                    admin.popup({
                        id:'addBanner',
                        title: '编辑轮播图'
                        , area: ['600px', '500px']
                        , success: function () {
                            view(this.id).render('/template/goods/addBanner', data);
                        }
                    });
                }
                
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'banner/delBanner',
                    param: {
                        id:data.id
                    },
                    success: function (res) {
                        table.reload('bannerTable', {
                            url: layui.setter.requestUrl + 'api.php?c=config_classify/getBannerList',
                            where:field2
                        });
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=banner/changeBannerSort',
                    data:{
                        id:data.id,
                        sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            table.reload('bannerTable', {
                                url: layui.setter.requestUrl + 'api.php?c=config_classify/getBannerList',
                                where:field2
                            });
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })

        //监听轮播图是否显示操作
        form.on('switch(statusSwitch)', function(obj){
            let type=''
            if(obj.elem.checked){
                type='1'
            }else{
                type='2'
            }
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=config_classify/editBannerSort',
                data:{
                    id:obj.value,
                    type:type
                },
                success: function (res) {
                    if (res.code == 0) {
                        layer.msg(res.msg);
                        table.reload('bannerTable', {
                            url: layui.setter.requestUrl + 'api.php?c=config_classify/getBannerList',
                            where:field2
                        });
                    } else {
                        layer.msg(res.msg);
                    }
                }
            })
        });

    });
    //对外暴露的接口
    exports('goodsClass', {});
})