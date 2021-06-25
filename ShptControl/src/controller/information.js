
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
        var field={
            type:'3',
            title:'',
            status:'',
            start:'',
            end:'',
            headline_classify:'',
            is_topping:''
        };
        $('.addVideo').click(function(){
            admin.popup({
                id:'addVideo',
                title: '添加视频资讯'
                , area: ['700px', '600px']
                , success: function () {
                    view(this.id).render('/template/headLines/addVideo', {
                        jump_id:"3"
                    });
                }
            });
        })
        $('.addImage').click(function(){
            admin.popup({
                id:'addVideo',
                title: '添加图文资讯'
                , area: ['700px', '600px']
                , success: function () {
                    view(this.id).render('/template/headLines/addVideo', {
                        jump_id:"2"
                    });
                }
            });
        })
        //日期格式化
        laydate.render({
            elem: '#time',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
            }
        });
        admin.req({
            url:layui.setter.requestUrl+'api.php?c=headline/getHeadlineClassifyList'
            ,success:function(res){
                if(res.code==0){
                    $('.headline_classify1').empty()
                    $('.headline_classify1').append(`<option value="">请选择</option>`)
                    var dataList = res.data
                    dataList.forEach(item => {
                        $('.headline_classify1').append(`<option value=${item.class_index}>${item.class_name}</option>`)
                    });
                    layui.form.render("select");
                }
            }
        })
        form.render()
        //搜索
       form.on('submit(search)', function (data) {
            if (data.field.time != '') {
                data.field.start = data.field.time.split('-')[0].trim()
                var date = new Date(data.field.start);
                data.field.start = date.getTime()/1000
                data.field.end = data.field.time.split('-')[1].trim()
                var date = new Date(data.field.end);
                data.field.end = date.getTime()/1000
            } else {
                data.field.start = ''
                data.field.end = ''
            }
            delete data.field.time
            data.field.order_status=field.order_status
            delete data.field.time
            if(field.type=='3'){
                data.field.type='3'
                render_table1(data.field)
            }else if(field.type=='2'){
                data.field.type='2'
                render_table2(data.field)
            }
        });
        
        //tab切换清空搜索框的值
        element.on('tab(tabVP)', function (data) {
            var index = data.index
            if(index==0){
                field.type='3'
                render_table1(field)
            }else if(index==1){
                field.type = '2'
                render_table2(field)
            }
        });
        form.render()
        // ~~~~~~~~~~~~~~~~全部~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#infoTable1',
               url: layui.setter.requestUrl + 'api.php?c=headline/getHeadlineList',
               where: data,
               cols: [
                    [{
                        field: 'headlines_id',
                        title: 'ID',
                        align: 'center',
                    
                    }, {
                        field: 'title',
                        title: '内容标题',
                        align: 'center',
                    }, {
                        field: 'class_name',
                        title: '所属类目',
                        align: 'center',
                    }, {
                        field: 'video_url',
                        title: '视频',
                        align: 'center',
                        templet:function(d){
                            var src =layui.setter.CDN+d.video_url
                            var str =  `<video src = ${src} style="cursor:pointer;width:30px;height:30px" lay-event = 'enlarge1'></video>`
                            return str
                        }
                    }, {
                        field: 'goods_name',
                        title: '关联产品名称',
                        align: 'center'
                    }, {
                        field: 'time',
                        title: '添加时间',
                        align: 'center',
                        templet:function(d){
                        return d.time==0?'暂无':layui.common.createTime(d.time)
                    }
                    }, {
                        field: 'status',
                        title: '头条状态',
                        align: 'center',
                        templet:function(d){
                        return d.status=='1'?'上架':'下架'
                        }
                    }, {
                        field: 'is_reward',
                        title: '奖励状态',
                        align: 'center',
                        templet:function(d){
                            return d.is_reward=='1'?'开启':'关闭'
                        }
                    }, {
                        field: 'minute',
                        title: '奖励规则',
                        align: 'center',
                        templet:function(d){
                            return  `每浏览${d.minute}分钟,解锁总消费金的${d.consumption}%,最高可解锁${d.consumption_most/100}元消费金,最低可解锁${d.consumption_least/100}元消费金,或获得${d.cash/100}元佣金`
                        }
                    // }, {
                    //     field: 'copy_content',
                    //     title: '自动复制内容',
                    //     align: 'center',
                    }, {
                        field: 'comment',
                        title: '评论数量',
                        align: 'center',
                    }, {
                        field: 'label_str',
                        title: '资讯标签',
                        align: 'center',
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:210,
                        templet: function (d) {
                            return `<div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'top'>${d.is_topping=='1'?'取消置顶':'置顶'}</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>${d.status=='1'?'下架':'上架'}</button></div>
                            <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'del'>删除</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'browse'>查看浏览数据</button></div>`
                        }
                    }]
                ],
               page: true,
            //    height: 'full-200',
           });
       }
       //先自调用请求渲染数据
        render_table1(field);
        
      
        table.on('tool(infoTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'edit') {
                admin.popup({
                    id:'addVideo',
                    title: '编辑视频资讯'
                    , area: ['700px', '600px']
                    , success: function () {
                        view(this.id).render('/template/headLines/addVideo', data);
                    }
                });
            }else if(layEvent=='del'){
                layer.confirm('确定删除？', {
                    btn: ['确定','取消'] //按钮
                    }, function(index){
                        admin.req({
                            url:layui.setter.requestUrl+'api.php?c=headline/delHeadline',
                            data:{
                                headlines_id:data.headlines_id
                            },success:function(res){
                                if(res.code==0){
                                    layer.msg('删除成功',{icon:1})
                                    layer.close(index)
                                    render_table1(field);
                                }
                            }
                        })
                    }, function(index){
                        layer.close(index)
                });
            }else if(layEvent=='enlarge1'){
                var src = layui.setter.CDN+data.video_url
                layer.open({
                    type: 1,
                    title: false,
                    area: ['auto'],
                    shadeClose: true, //点击遮罩关闭
                    content: `<video src = ${src} style="width:600px;height:500px" controls="controls"></video>`
                });
            }else if(layEvent=='top'){
                let top=''
                if(data.is_topping=='1'){
                    top='2'
                }else{
                    top='1'
                }
                admin.req({
                    url:layui.setter.requestUrl+'api.php?c=headline/topHeadline',
                    data:{
                        headlines_id:data.headlines_id,
                        type:top
                    },
                    success:function(res){
                        if(res.code==0){
                            layer.msg(res.msg,{icon:1})
                            layer.closeAll('page')
                            parent.layui.table.reload("infoTable1");
                        }
                    }
                })
            }
            else if(layEvent=='up'){
                layer.confirm(data.status=='1'?'确定下架吗？':'确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=headline/upHeadline',
                            data:{
                                headlines_id:data.headlines_id,
                                type:data.status=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("infoTable1");
                                }else{
                                    layer.closeAll()
                                    layer.msg(res.msg)
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='browse'){
                admin.popup({
                    id:'browseData',
                    title: '浏览数据'
                    , area: ['800px', '400px']
                    , success: function () {
                        view(this.id).render('/template/headLines/browseData', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~待付款~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#infoTable2',
                url: layui.setter.requestUrl + 'api.php?c=headline/getHeadlineList',
                where: data,
                cols: [
                    [{
                        field: 'headlines_id',
                        title: 'ID',
                        align: 'center',
                    
                    }, {
                        field: 'title',
                        title: '内容标题',
                        align: 'center',
                    }, {
                        field: 'class_name',
                        title: '所属类目',
                        align: 'center',
                    }, {
                        field: 'video_url',
                        title: '内容',
                        align: 'center',
                        templet:function(d){
                            return `<button type="button" class="layui-btn layui-btn-xs" lay-event = 'look'>查看</button>`
                        }
                    }, {
                        field: 'goods_name',
                        title: '关联产品名称',
                        align: 'center'
                    }, {
                        field: 'time',
                        title: '添加时间',
                        align: 'center',
                        templet:function(d){
                        return d.time==0?'暂无':layui.common.createTime(d.time)
                    }
                    }, {
                        field: 'status',
                        title: '头条状态',
                        align: 'center',
                        templet:function(d){
                        return d.status=='1'?'上架':'下架'
                        }
                    }, {
                        field: 'is_reward',
                        title: '奖励状态',
                        align: 'center',
                        templet:function(d){
                            return d.is_reward=='1'?'开启':'关闭'
                        }
                    }, {
                        field: 'minute',
                        title: '奖励规则',
                        align: 'center',
                        templet:function(d){
                            return  `每浏览${d.minute}分钟可解锁${d.minute}元消费金或获得${d.cash}元佣金`
                        }
                    // }, {
                    //     field: 'copy_content',
                    //     title: '自动复制内容',
                    //     align: 'center',
                    }, {
                        field: 'comment',
                        title: '评论数量',
                        align: 'center',
                    }, {
                        field: 'label_str',
                        title: '资讯标签',
                        align: 'center',
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:210,
                        templet: function (d) {
                            return `<div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'top'>${d.is_topping=='1'?'取消置顶':'置顶'}</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>${d.status=='1'?'下架':'上架'}</button></div>
                            <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'del'>删除</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'browse'>查看浏览数据</button><div>`
                        }
                    }]
                ],
                page: true,
            });
        }

        table.on('tool(infoTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'edit') {
                admin.popup({
                    id:'addVideo',
                    title: '编辑图文资讯'
                    , area: ['700px', '600px']
                    , success: function () {
                        view(this.id).render('/template/headLines/addVideo', data);
                    }
                });
            }if (layEvent == 'look') {
                admin.popup({
                    id:'look',
                    title: '查看图文资讯内容'
                    , area: ['500px', '400px']
                    , success: function () {
                        view(this.id).render('/template/headLines/look', {
                            url:data.content
                        });
                    }
                });
            }else if(layEvent=='del'){
                layer.confirm('确定删除？', {
                    btn: ['确定','取消'] //按钮
                    }, function(index){
                        admin.req({
                            url:layui.setter.requestUrl+'api.php?c=headline/delHeadline',
                            data:{
                                headlines_id:data.headlines_id
                            },success:function(res){
                                if(res.code==0){
                                    layer.msg('删除成功',{icon:1})
                                    layer.close(index)
                                    render_table2(field);
                                }
                            }
                        })
                    }, function(index){
                        layer.close(index)
                });
            }else if(layEvent=='top'){
                let top=''
                if(data.is_topping=='1'){
                    top='2'
                }else{
                    top='1'
                }
                admin.req({
                    url:layui.setter.requestUrl+'api.php?c=headline/topHeadline',
                    data:{
                        headlines_id:data.headlines_id,
                        type:top
                    },
                    success:function(res){
                        if(res.code==0){
                            layer.msg(res.msg,{icon:1})
                            layer.closeAll('page')
                            parent.layui.table.reload("infoTable2");
                        }
                    }
                })
            }
            else if(layEvent=='up'){
                layer.confirm(data.status=='1'?'确定下架吗？':'确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=headline/upHeadline',
                            data:{
                                headlines_id:data.headlines_id,
                                type:data.status=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("infoTable2");
                                }else{
                                    layer.closeAll()
                                    layer.msg(res.msg)
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='browse'){
                admin.popup({
                    id:'browseData',
                    title: '浏览数据'
                    , area: ['800px', '400px']
                    , success: function () {
                        view(this.id).render('/template/headLines/browseData', data);
                    }
                });
            }
        })

    });
    //对外暴露的接口
    exports('information', {});
})