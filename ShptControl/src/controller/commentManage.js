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
            type:'1',
            pass_start:'',
            pass_end:''
        };
        //日期格式化
        laydate.render({
            elem: '#test',
            range: true,
            format: 'yyyy/MM/dd',
        });
        form.on('submit(search)', function(data){
            if (data.field.time != '') {
                field.pass_start = data.field.time.split('-')[0].trim()
                var date = new Date(field.pass_start);
                field.pass_start = date.getTime()/1000
                field.pass_end = data.field.time.split('-')[1].trim()
                var date = new Date(field.pass_end);
                field.pass_end = date.getTime()/1000
            } else {
                field.pass_start = ''
                field.pass_end = ''
            }
            delete data.field.time
            if(field.type==1){
                render_table1(field)
            }else if(field.type==2){
                render_table2(field)
            }else{
                render_table3(field)
            }
        });
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                field.type='1'
                render_table1(field)
            }else if(index==1){
                field.type='2'
                render_table2(field)
            }else if(index==2){
                field.type='3'
                render_table3(field)
            }
        });
        
        form.render()
      
        // ~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#comment1',
               url: layui.setter.requestUrl + 'api.php?c=merchant/getCommentList',
               where: data,
               cols: cols=[
                   [{
                       field: 'comment_index',
                       title: 'ID',
                       align: 'center',
                       sort: true,
                       width:80,
                   },{
                       field: 'merchant_name',
                       title: '线下店铺名称',
                       align: 'center',
                      
                   }, {
                    field: 'user_name',
                    title: '评论用户',
                    align: 'center',
                    templet: function (d) {
                        var str=`<div>昵称：${d.user_name}</div><div>手机号：${d.user_phone}</div>`
                        return str
                    }
                   
                },{
                       field: 'comment_content',
                       title: '评论内容',
                       align: 'center',
                       templet: function (d) {
                        return d.comment_content==''?'暂无':d.comment_content
                    }
                       
                   }, {
                       field: 'comment_images',
                       title: '评价图片',
                       align: 'center',
                       width:  100,
                       templet: function (d) {
                        return `<button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-event = 'look'>查看</button>`
                    }
                   }, {
                    field: 'comment_all_score',
                    title: '店铺评分',
                    align: 'center',
                    width:  100,
                    templet: function (d) {
                        var str=`<div>整体：${d.comment_all_score}</div><div>环境：${d.comment_evn_score}</div><div>服务：${d.comment_service_score}</div>`
                        return str
                    }
                }, {
                       field: 'payment_time',
                       title: '付款时间',
                       align: 'center',
                       templet: function (d) {
                           return d.payment_time==0?'暂无':layui.common.createTime(d.payment_time)
                       }
                   }, {
                       field: 'comment_time',
                       title: '评论时间',
                       align: 'center',
                       templet:function(d){
                        return d.comment_time==0?'暂无':layui.common.createTime(d.comment_time)
                    }
                   },
                   {
                       fixed: 'right',
                       align: 'center',
                       title: '操作',
                       width:  80,
                       templet: function (d) {
                           return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'check'>审核</button>`
                       }
                   }]
               ],
               page: true,
               parseData: function(res){
                $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                $('.status2').html('已通过'+'&nbsp;'+res.data.success_count)
                $('.status3').html('未通过'+'&nbsp;'+res.data.fail_count)
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
      
        table.on('tool(comment1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                tool.lookBigImg(data.comment_images.split(',')); 
            }else if(layEvent == 'check'){
                admin.popup({
                    id:'check',
                    title: '评论审核'
                    , area: ['500px', '450px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/check', {
                            comment_index:data.comment_index,
                            url:'api.php?c=merchant/changeComment',
                            table:'comment1'
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~已通过~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#comment2',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getCommentList',
                where: data,
                cols: cols=[
                    [{
                        field: 'comment_index',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:80,
                    },{
                        field: 'merchant_name',
                        title: '线下店铺名称',
                        align: 'center',
                       
                    }, {
                     field: 'user_name',
                     title: '评论用户',
                     align: 'center',
                     templet: function (d) {
                         var str=`<div>昵称：${d.user_name}</div><div>手机号：${d.user_phone}</div>`
                         return str
                     }
                    
                 },{
                        field: 'comment_content',
                        title: '评论内容',
                        align: 'center',
                        templet: function (d) {
                            return d.comment_content==''?'暂无':d.comment_content
                        }
                        
                    }, {
                        field: 'comment_images',
                        title: '评价图片',
                        align: 'center',
                        width:  100,
                        templet: function (d) {
                         return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看</button>`
                     }
                    }, {
                     field: 'comment_all_score',
                     title: '店铺评分',
                     align: 'center',
                     width:  110,
                     templet: function (d) {
                         var str=`<div>整体：${d.comment_all_score}</div><div>环境：${d.comment_evn_score}</div><div>服务：${d.comment_service_score}</div>`
                         return str
                     }
                 }, {
                        field: 'payment_time',
                        title: '付款时间',
                        align: 'center',
                        templet: function (d) {
                            return d.payment_time==0?'暂无':layui.common.createTime(d.payment_time)
                        }
                    }, {
                        field: 'comment_time',
                        title: '评论时间',
                        align: 'center',
                        templet:function(d){
                         return d.comment_time==0?'暂无':layui.common.createTime(d.comment_time)
                     }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:  80,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                 $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                 $('.status2').html('已通过'+'&nbsp;'+res.data.success_count)
                 $('.status3').html('未通过'+'&nbsp;'+res.data.fail_count)
                     return {
                         "count": res.count, //解析接口状态
                         "code": res.code, //解析接口状态
                         "data": res.data.list //解析数据列表
                     };
                 },
            });
        }
    
        table.on('tool(comment2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                tool.lookBigImg(data.comment_images.split(',')); 
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'merchant/delComment',
                    param: {
                        comment_index:data.comment_index
                    },
                    success: function (res) {
                        table.reload('comment2', {
                            url: layui.setter.requestUrl + 'api.php?c=merchant/getCommentList'
                        });
                    }
                });
            }
        });
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~未通过审核~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#comment3',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getCommentList',
                where: data,
                cols: cols=[
                    [{
                        field: 'comment_index',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:80,
                    },{
                        field: 'merchant_name',
                        title: '线下店铺名称',
                        align: 'center',
                       
                    }, {
                     field: 'user_name',
                     title: '评论用户',
                     align: 'center',
                     templet: function (d) {
                         var str=`<div>昵称：${d.user_name}</div><div>手机号：${d.user_phone}</div>`
                         return str
                     }
                    
                 },{
                        field: 'comment_content',
                        title: '评论内容',
                        align: 'center',
                        templet: function (d) {
                            return d.comment_content==''?'暂无':d.comment_content
                        }
                    }, {
                        field: 'comment_images',
                        title: '评价图片',
                        align: 'center',
                        width:  100,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看</button>`
                        }
                    }, {
                     field: 'comment_all_score',
                     title: '店铺评分',
                     align: 'center',
                     width:  110,
                     templet: function (d) {
                         var str=`<div>整体：${d.comment_all_score}</div><div>环境：${d.comment_evn_score}</div><div>服务：${d.comment_service_score}</div>`
                         return str
                     }
                 }, {
                        field: 'payment_time',
                        title: '付款时间',
                        align: 'center',
                        templet: function (d) {
                            return d.payment_time==0?'暂无':layui.common.createTime(d.payment_time)
                        }
                    }, {
                        field: 'comment_time',
                        title: '评论时间',
                        align: 'center',
                        templet:function(d){
                         return d.comment_time==0?'暂无':layui.common.createTime(d.comment_time)
                     }
                    },{
                        field: 'pass_time',
                        title: '拒绝时间',
                        align: 'center',
                        templet:function(d){
                         return d.pass_time==0?'暂无':layui.common.createTime(d.pass_time)
                     }
                    },
                    {
                        field: 'comment_reason',
                        title: '拒绝原因',
                        align: 'center',
                        templet:function(d){
                            return d.comment_reason==''?'暂无':base.decode(d.comment_reason)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:  80,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                 $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                 $('.status2').html('已通过'+'&nbsp;'+res.data.success_count)
                 $('.status3').html('未通过'+'&nbsp;'+res.data.fail_count)
                     return {
                         "count": res.count, //解析接口状态
                         "code": res.code, //解析接口状态
                         "data": res.data.list //解析数据列表
                     };
                 },
            });
        }
        
        table.on('tool(comment3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                tool.lookBigImg(data.comment_images.split(',')); 
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'merchant/delComment',
                    param: {
                        comment_index:data.comment_index
                    },
                    success: function (res) {
                        table.reload('comment3', {
                            url: layui.setter.requestUrl + 'api.php?c=merchant/getCommentList'
                        });
                    }
                });
            }
        })
    });
    //对外暴露的接口
    exports('commentManage', {});
})