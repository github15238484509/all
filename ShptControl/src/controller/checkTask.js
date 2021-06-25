layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'contlist', 'table', 'common','public','form','element','laydate'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            table = layui.table,
            element = layui.element,
            laydate=layui.laydate,
            IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限
        var tool = layui.public.tool;
        var base = new layui.public.Base64();


        var field={
            type:'',
            word:'',
            type_id:'',
            start_time:'',
            end_time:'',
            status:''
        };
        //日期格式化
        laydate.render({
            elem: '#test',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
               
            }
        });
        form.on('submit(search)', function(data){
            if (data.field.time != '') {
                data.field.start_time = data.field.time.split('-')[0].trim()
                var date = new Date(data.field.start_time);
                data.field.start_time = date.getTime()/1000
                data.field.end_time = data.field.time.split('-')[1].trim()
                var date = new Date(data.field.end_time);
                data.field.end_time = date.getTime()/1000
            } else {
                data.field.start_time = ''
                data.field.end_time = ''
            }
            delete data.field.time
            data.field.status=field.status
            if(field.status==''){
                render_table1(data.field)
            }else if(field.status==2){
                render_table2(data.field)
            }else if(field.status==3){
                render_table3(data.field)
            }else{
                render_table4(data.field)
            }
        });
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                field.status=''
                render_table1(field)
            }else if(index==1){
                field.status='2'
                render_table2(field)
            }else if(index==2){
                field.status='3'
                render_table3(field)
            }else{
                field.status='4'
                render_table4(field)
            }
        });
        
        form.render()
        var cols=[
            [{
                field: 'task_index',
                title: '任务ID',
                align: 'center',
                sort:'true'
            }, {
                field: 'title',
                title: '任务标题',
                align: 'center',
               
            }, {
                field: 'type_id',
                title: '任务类型',
                align: 'center',
                templet:function(d){
                    return d.type_id=='1'?'视频分享':d.type_id=='2'?'链接分享':'图文分享'
                }
            },{
                field: 'name',
                title: '用户昵称',
                align: 'center'
            },  {
             field: 'phone',
             title: '手机号',
             align: 'center'
            }, {
                field: 'receive_time',
                title: '领取任务时间',
                align: 'center',
                sort:'true',
                width:160,
                templet: function (d) {
                    return d.receive_time==0?'暂无':layui.common.createTime(d.receive_time)
                }
            }, {
                field: 'submit_time',
                title: '提交任务时间',
                align: 'center',
                sort:'true',
                width:160,
                templet:function(d){
                return d.submit_time==0?'暂无':layui.common.createTime(d.submit_time)
            }
            },{
                field: 'status',
                title: '任务状态',
                align: 'center',
                templet:function(d){
                    if(d.status=='2'){
                        return '待审核'
                    }else if(d.status=='3'){
                        return `<div style="color:#43cm7c">审核通过</div>`
                    }else if(d.status=='4'){
                        return `<div style="color:red">已驳回</div>
                        <div>拒绝原因：${d.refuse?base.decode(d.refuse):'暂无'}</div>`
                    }else if(d.status=='5'){
                        return '直接奖励'
                    }

                }
            },
            {
                field: 'content',
                title: '任务内容',
                align: 'center',
                templet:function(d){
                    return d.content==''?'暂无':base.decode(d.content)
                }
            },{
                field: 'picture',
                title: '任务截图',
                align: 'center',
                width:  100,
                templet: function (d) {
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看</button>`
                }
            },
            {
                fixed: 'right',
                align: 'center',
                title: '操作',
                width:  180,
                templet: function (d) {
                    if(d.status=='2'){
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'check'>审核</button>
                        <button type="button" class="layui-btn layui-btn-sm" lay-event = 'lookDetail'>查看详情</button>`
                    }else{
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'lookDetail'>查看详情</button>`
                    }
                }
            }]
        ]
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~全部~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var render_table1 = function (data) {
            table.render({
                elem: '#checkTable1',
                url: layui.setter.requestUrl + 'api.php?c=user_task/user_task_list',
                where: data,
                cols: cols,
                page: true,
            });
        }
        //先自调用请求渲染数据
        render_table1(field);
       
         table.on('tool(checkTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
             var data = obj.data; //获得当前行数据
             var layEvent = obj.event; //获得 lay-event 对应的值
             if (layEvent == 'look') {
                 tool.lookBigImg(data.picture.split(',')); 
             }else if(layEvent == 'check'){
                 data.tab='1'
                 admin.popup({
                     id:'check',
                     title: '任务审核'
                     , area: ['500px', '450px']
                     , success: function () {
                         view(this.id).render('/template/taskManage/check', data);
                     }
                 });
             }else if(layEvent == 'lookDetail'){
                admin.popup({
                    id:'lookTask',
                    title: '查看详情'
                    , area: ['600px', '600px']
                    , success: function () {
                        view(this.id).render('/template/taskManage/lookTask', {
                            task_index:data.task_id
                        });
                    }
                });
            }
         })
        // ~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table2 = function (data) {
           table.render({
               elem: '#checkTable2',
               url: layui.setter.requestUrl + 'api.php?c=user_task/user_task_list',
               where: data,
               cols: cols,
               page: true,
           });
       }
      
        table.on('tool(checkTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                tool.lookBigImg(data.picture.split(',')); 
            }else if(layEvent == 'check'){
                data.tab='2'
                admin.popup({
                    id:'check',
                    title: '任务审核'
                    , area: ['650px', '500px']
                    , success: function () {
                        view(this.id).render('/template/taskManage/check', data);
                    }
                });
            }else if(layEvent == 'lookDetail'){
                admin.popup({
                    id:'lookTask',
                    title: '查看详情'
                    , area: ['600px', '600px']
                    , success: function () {
                        view(this.id).render('/template/taskManage/lookTask', {
                            task_index:data.task_id
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~已通过~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#checkTable3',
                url: layui.setter.requestUrl + 'api.php?c=user_task/user_task_list',
                where: data,
                cols: cols,
                page: true,
            });
        }
    
        table.on('tool(checkTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                tool.lookBigImg(data.picture.split(',')); 
            }else if(layEvent == 'lookDetail'){
                admin.popup({
                    id:'lookTask',
                    title: '查看详情'
                    , area: ['600px', '600px']
                    , success: function () {
                        view(this.id).render('/template/taskManage/lookTask', {
                            task_index:data.task_id
                        });
                    }
                });
            }
        });
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~已驳回~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#checkTable4',
                url: layui.setter.requestUrl + 'api.php?c=user_task/user_task_list',
                where: data,
                cols: cols,
                page: true,
            });
        }
        
        table.on('tool(checkTable4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                tool.lookBigImg(data.picture.split(',')); 
            }else if(layEvent == 'lookDetail'){
                admin.popup({
                    id:'lookTask',
                    title: '查看详情'
                    , area: ['600px', '600px']
                    , success: function () {
                        view(this.id).render('/template/taskManage/lookTask', {
                            task_index:data.task_id
                        });
                    }
                });
            }
        })
    });
    //对外暴露的接口
    exports('checkTask', {});
})