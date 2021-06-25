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
        var base = new layui.public.Base64();


        var field={
            barter_status:'1',
            supplier_name:'',
            order_name:'',
            start_time:'',
            end_time:'',
        };
        //日期格式化
        laydate.render({
            elem: '#time',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
            }
        });
        //显示标签
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=goods_tag/getGoodsTagList',
            data:{
                is_able:'0'
            },
            success: function (res) {
                if(res.code == 0){
                    var data = res.data
                    $('.label1').empty()
                    $('.label1').append(`
                        <option value="" selected>请选择</option>
                    `)
                    data.forEach(items=>{
                        $('.label1').append(`
                            <option value="${items.tag_index}">${items.tag_name}</option>
                        `)
                    })
                    layui.form.render("select");
                }
            }
        })
         
        $('.add_jump_link').click(function(){
            var title=''
            var jump_id = $(this).attr('id')
            if(jump_id=='1'){
                title='添加视频分享任务'
            }else if(jump_id=='2'){
                title='添加链接分享任务'
            }else{
                title='添加图文分享任务'
            }
            admin.popup({
                id:'addTask',
                title: title
                , area: ['800px', '600px']
                , success: function () {
                    view(this.id).render('/template/taskManage/addTask', {
                        jump_id:jump_id 
                    });
                }
            });
        })
         //搜索
         form.on('submit(search1)', function (data) {
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
            console.log(data.field);
            render_table1(data.field)
        });
        form.render()
        // ~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#taskTable',
               url: layui.setter.requestUrl + 'api.php?c=task/task_list',
               method:'post',
               where: data,
               cols: [
                [{
                    field: 'task_index',
                    title: '任务ID',
                    align: 'center',
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
                }, {
                    field: 'statement',
                    title: '任务说明',
                    align: 'center',
                    templet:function(d){
                        return base.decode(d.statement)
                    }
                }, {
                    field: 'thum',
                    title: '任务缩略图',
                    align: 'center',
                    templet:function(d){
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                    }
                },{
                    field: 'refund_remark',
                    title: '奖励设置',
                    align: 'center',
                    templet:function(d){
                        return `解锁${d.consumption}%消费金,最高解锁${d.consumption_most/100}元,最低解锁${d.consumption_least/100}元,佣金${d.cash/100}元`
                    }
                }, {
                    field: 'is_examine	',
                    title: '是否审核',
                    align: 'center',
                    templet:function(d){
                        return d.is_examine=='1'?'是':'否'
                    }
                }, {
                    field: 'is_repeat	',
                    title: '重复完成任务',
                    align: 'center',
                    templet:function(d){
                        return d.is_repeat	=='1'?'开启':'暂停'
                    }
                }, {
                    field: 'label_str',
                    title: '任务标签',
                    align: 'center',
                }, {
                    field: 'frequency_complete',
                    title: '完成任务数/任务总数',
                    align: 'center',
                    templet:function(d){
                        var str = d.frequency_complete+'/'+d.frequency_count
                        return str
                    }
                }, {
                    field: 'time',
                    title: '创建时间',
                    align: 'center',
                    templet:function(d){
                        return layui.common.createTime(d.time)
                    }
                }, 
                {
                    fixed: 'right',
                    align: 'center',
                    title: '操作',
                    width:150,
                    templet: function (d) {
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                        <button type="button" class="layui-btn layui-btn-sm" lay-event = 'del'>删除</button>`
                    }
                }]
            ],
               page: true,
           });
       }
       //先自调用请求渲染数据
       render_table1(field);
      
        table.on('tool(taskTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.thum.split(',')); 
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'task/task_del',
                    param: {
                        task_index:data.task_index,
                        is_del:'2'
                    },
                    success: function (res) {
                        table.reload('taskTable', {
                            url: layui.setter.requestUrl + 'api.php?c=task/task_list',
                            where:field
                        });
                    }
                });
            }else if(layEvent == 'edit'){
                if(data.type_id=='1'){
                    title='编辑视频分享任务'
                }else if(data.type_id=='2'){
                    title='编辑链接分享任务'
                }else{
                    title='编辑图文分享任务'
                }
                admin.popup({
                    id:'addTask',
                    title: title
                    , area: ['800px', '600px']
                    , success: function () {
                        view(this.id).render('/template/taskManage/addTask', data);
                    }
                });
            }
        })
      
    });
    //对外暴露的接口
    exports('taskList', {});
})