layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'contlist', 'table', 'common','public','form','element','laydate'],
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
            comment_status:'0',
            name:'',
            phone:'',
            start_time:'',
            end_time:'',
        };
        form.render()
          //日期格式化
          laydate.render({
            elem: '#test',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
                
            }
        });
        element.on('tab(tab)', function(data){
            if(data.index==0){
                field.comment_status="0"
                render_table1(field);
            }else if(data.index==1){
                field.comment_status="1"
                render_table2(field);
            }else{
                field.comment_status="2"
                render_table3(field);
            }
        });
        //搜索
        form.on('submit(search5)', function (data) {
            if (data.field.time != '') {
                field.start_time = data.field.time.split('-')[0].trim()
                var date = new Date(field.start_time);
                field.start_time = date.getTime()/1000
                field.end_time = data.field.time.split('-')[1].trim()
                var date = new Date(field.end_time);
                field.end_time = date.getTime()/1000
            } else {
                field.start_time = ''
                field.end_time = ''
            }
            field.name=data.field.name
            field.phone=data.field.phone
            if(field.comment_status=='0'){
                render_table1(field);
            }else if(field.comment_status=='1'){
                render_table2(field);
            }else{
                render_table3(field);
            }
        });
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table1 = function (data) {
            table.render({
                elem: '#wordTable1',
                url: layui.setter.requestUrl + 'api.php?c=hot_word/word_list',
                method:'post',
                where: data,
                cols: cols=[
                    [{
                        field: 'comment_index',
                        title: 'ID',
                        align: 'center',
                        sort: true
                       
                    }, {
                     field: 'name',
                     title: '推荐官昵称',
                     align: 'center',
                    
                 },{
                        field: 'phone',
                        title: '推荐官手机号',
                        align: 'center',
                        
                    }, {
                        field: 'goods_icon',
                        title: '商品图片',
                        align: 'center',
                        templet:function(d){
                            var str = `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                            return str
                        }
                        
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                        templet:function(d){
                            return d.supplier_name==''?'暂无':d.supplier_name
                        }
                        
                    },{
                        field: 'comment_content',
                        title: '推荐词内容',
                        align: 'center',
                        
                    }, {
                        field: 'comment_time',
                        title: '提交时间',
                        align: 'center',
                        templet:function(d){
                         return d.comment_time==0?'暂无':layui.common.createTime(d.comment_time)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-xs" lay-event = 'check'>审核</button>`
                        }
                    }]
                ],
                page: true,
            });
        }
        //自调渲染表格
        render_table1(field);

        table.on('tool(wordTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'check'){
                admin.popup({
                    id:'checkWords',
                    title: '推荐词审核'
                    , area: ['500px', '450px']
                    , success: function () {
                        view(this.id).render('/template/operateManage/checkWords', {
                            comment_index:data.comment_index
                        });
                    }
                });
            }
        })
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~审核通过~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#wordTable2',
                url: layui.setter.requestUrl + 'api.php?c=hot_word/word_list',
                method:'post',
                where: data,
                cols: cols=[
                    [{
                        field: 'comment_index',
                        title: 'ID',
                        align: 'center',
                       
                    }, {
                     field: 'name',
                     title: '推荐官昵称',
                     align: 'center',
                    
                 },{
                        field: 'phone',
                        title: '推荐官手机号',
                        align: 'center',
                        
                    }, {
                        field: 'goods_icon',
                        title: '商品图片',
                        align: 'center',
                        templet:function(d){
                            var str = `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                            return str
                        }
                        
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                        templet:function(d){
                            return d.supplier_name==''?'暂无':d.supplier_name
                        }
                        
                    },{
                        field: 'comment_content',
                        title: '推荐词内容',
                        align: 'center',
                        
                    }, {
                        field: 'comment_time',
                        title: '提交时间',
                        align: 'center',
                        templet:function(d){
                         return d.comment_time==0?'暂无':layui.common.createTime(d.comment_time)
                        }
                    },{
                        field: 'check_time',
                        title: '审核时间',
                        align: 'center',
                        templet:function(d){
                         return d.check_time==0?'暂无':layui.common.createTime(d.check_time)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-xs" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
            });
        }
        table.on('tool(wordTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'hot_word/word_del',
                    param: {
                        id:data.comment_index,
                        is_del:'1'
                    },
                    success: function (res) {
                        parent.layui.table.reload("wordTable2");
                    }
                });
            }
        })
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~审核拒绝~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#wordTable3',
                url: layui.setter.requestUrl + 'api.php?c=hot_word/word_list',
                method:'post',
                where: data,
                cols: cols=[
                    [{
                        field: 'comment_index',
                        title: 'ID',
                        align: 'center',
                       
                    }, {
                     field: 'name',
                     title: '推荐官昵称',
                     align: 'center',
                    
                 },{
                        field: 'phone',
                        title: '推荐官手机号',
                        align: 'center',
                        
                    }, {
                        field: 'goods_icon',
                        title: '商品图片',
                        align: 'center',
                        templet:function(d){
                            var str = `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                            return str
                        }
                        
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                        templet:function(d){
                            return d.supplier_name==''?'暂无':d.supplier_name
                        }
                        
                    },{
                        field: 'comment_content',
                        title: '推荐词内容',
                        align: 'center',
                        
                    }, {
                        field: 'comment_time',
                        title: '提交时间',
                        align: 'center',
                        templet:function(d){
                         return d.comment_time==0?'暂无':layui.common.createTime(d.comment_time)
                        }
                    },{
                        field: 'check_time',
                        title: '审核时间',
                        align: 'center',
                        templet:function(d){
                         return d.check_time==0?'暂无':layui.common.createTime(d.check_time)
                        }
                    },{
                        field: 'comment_reason',
                        title: '拒绝原因',
                        align: 'center',
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-xs" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
            });
        }

        table.on('tool(wordTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'hot_word/word_del',
                    param: {
                        id:data.comment_index,
                        is_del:'1'
                    },
                    success: function (res) {
                        parent.layui.table.reload("wordTable3");
                    }
                });
            }
        })

    });
    //对外暴露的接口
    exports('recommendWord', {});
})