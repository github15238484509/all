
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
            type:'1',
            key:'',
            value:'',
            start:'',
            end:'',
        }
        //日期格式化
        laydate.render({
            elem: '#time',
            type: 'datetime',
            range: true,
            trigger: 'click',
            format: 'yyyy/M/d',
            change: function (value, date, endDate) {

            },
            done: function (value, date, endDate) {
                if (!value) {
                    $("input[name=time]").val("");
                    field.start = '';
                    field.end = '';
                } else {
                    field.start = new Date(value.split('-')[0]).getTime() / 1000;
                    field.end = new Date(value.split('-')[1]).getTime() / 1000;
                }
            }
        });
        form.render()
        //搜索
        form.on('submit(search6)', function (data) {
            data.field.start = field.start
            data.field.end = field.end
            data.field.type=field.type
            if(field.type=='1'){
                data.field.type=='1'
                render_table1(data.field)
            }else if(field.type=='2'){
                data.field.type=='2'
                render_table2(data.field)
            }else{
                data.field.type=='3'
                render_table3(data.field)
            }
        });
        
        //tab切换清空搜索框的值
        element.on('tab(complaintTab)', function(data){
            var index = data.index
            console.log(index);
            if(index==0){
                field.type='1'
                render_table1(field)
            }else if(index==1){
                field.type='2'
                render_table2(field)
            }else{
                field.type='3'
                render_table3(field)
            }
        });
        form.render()
        var cols=[
            [{
                field: 'complaint_index',
                title: '投诉ID',
                align: 'center',
                sort:true
            
            }, {
                field: 'name',
                title: '用户信息',
                align: 'center',
                templet: function (d) {
                    var str =
                        `<div>姓名:${d.name}</div><div>手机号:${d.phone}</div>`
                    return str
                }
            },{
                field: 'title',
                title: '头条名称',
                align: 'center',
            }, {
                field: 'class_name',
                title: '所属分类',
                align: 'center',
                templet:function(d){
                    return d.class_name==''?'暂无':d.class_name
                }
            },  {
                field: 'type',
                title: '投诉原因',
                align: 'center',
                templet:function(d){
                    return d.type==''?'暂无':d.type
                }
            },  {
                field: 'content',
                title: '投诉内容',
                align: 'center',
                templet:function(d){
                    return d.content==''?'暂无':d.content
                }
            }, {
                field: 'picture',
                title: '投诉证据',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                }
            }, {
            //     field: 'is_del',
            //     title: '状态',
            //     align: 'center',
            //     templet:function(d){
            //         return d.is_del==0?'未处理':'已处理'
            //     }
            // }, {
                field: 'add_time',
                title: '提交投诉时间',
                align: 'center',
                templet:function(d){
                    return d.add_time==0?'暂无':layui.common.createTime(d.add_time)
                }
            // },  {
            //     field: 'remark',
            //     title: '备注',
            //     align: 'center',
            //     templet:function(d){
            //         return d.remark==''?'暂无':d.remark
            //     }
            },
            {
                fixed: 'right',
                align: 'center',
                title: '操作',
                width:130,
                templet: function (d) {
                    return `<div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'add'>投诉处理</button>`
                }
            }]
        ]
        var cols1=[
            [{
                field: 'complaint_index',
                title: '投诉ID',
                align: 'center',
                sort:true
            
            }, {
                field: 'name',
                title: '用户信息',
                align: 'center',
                templet: function (d) {
                    var str =
                        `<div>姓名:${d.name}</div><div>手机号:${d.phone}</div>`
                    return str
                }
            },{
                field: 'title',
                title: '头条名称',
                align: 'center',
            }, {
                field: 'class_name',
                title: '所属分类',
                align: 'center',
                templet:function(d){
                    return d.class_name==''?'暂无':d.class_name
                }
            },  {
                field: 'type',
                title: '投诉原因',
                align: 'center',
                templet:function(d){
                    return d.type==''?'暂无':d.type
                }
            },  {
                field: 'content',
                title: '投诉内容',
                align: 'center',
                templet:function(d){
                    return d.content==''?'暂无':d.content
                }
            }, {
                field: 'picture',
                title: '投诉证据',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                }
            }, {
                field: 'add_time',
                title: '提交投诉时间',
                align: 'center',
                templet:function(d){
                    return d.add_time==0?'暂无':layui.common.createTime(d.add_time)
                }
            },{
                field: 'ignore_time',
                title: '处理投诉时间',
                align: 'center',
                templet:function(d){
                    return d.ignore_time==0?'暂无':layui.common.createTime(d.ignore_time)
                }
            },{
                field: 'ignore',
                title: '原因',
                align: 'center',
            }]
        ]
        // ~~~~~~~~~~~~~~~~待处理~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#complaintTable1',
               url: layui.setter.requestUrl + 'api.php?c=headline/getComplaintList',
               where: data,
               cols: cols,
               page: true,
               parseData: function(res){
                return {
                    "count": res.count, //解析接口状态
                    "code": res.code, //解析接口状态
                    "data": res.data.list //解析数据列表
                };
            },
           });
       }
       //先自调用请求渲染数据
       render_table1(field);
      
        table.on('tool(complaintTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.picture.split(','));
            }else if(layEvent == 'add'){
                admin.popup({
                    id:'addRemark',
                    title: '投诉处理'
                    , area: ['500px', '400px']
                    , success: function () {
                        view(this.id).render('/template/headLines/addRemark', {
                            complaint_index:data.complaint_index
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~已处理~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#complaintTable2',
                url: layui.setter.requestUrl + 'api.php?c=headline/getComplaintList',
                where: data,
                cols:cols1,
                page: true,
                parseData: function(res){
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~已删除~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#complaintTable3',
                url: layui.setter.requestUrl + 'api.php?c=headline/getComplaintList',
                where: data,
                cols:cols1,
                page: true,
                parseData: function(res){
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    });
    //对外暴露的接口
    exports('complaint', {});
})