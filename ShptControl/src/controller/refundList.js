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
        var tool = layui.public.tool,
        base = new layui.public.Base64(),
        IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限


        var field={
            barter_status:'1',
            supplier_name:'',
            order_name:'',
            time_start:'',
            time_end:'',
        };
        //日期格式化
        laydate.render({
            elem: '#time',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
            }
        });
         //搜索
         form.on('submit(search1)', function (data) {
            if (data.field.time != '') {
                data.field.time_start = data.field.time.split('-')[0].trim()
                var date = new Date(data.field.time_start);
                data.field.time_start = date.getTime()/1000
                data.field.time_end = data.field.time.split('-')[1].trim()
                var date = new Date(data.field.time_end);
                data.field.time_end = date.getTime()/1000
            } else {
                data.field.time_start = ''
                data.field.time_end = ''
            }
            data.field.barter_status=field.barter_status
            delete data.field.time
            if(field.barter_status=='1'){ //待审核
                render_table1(data.field)
            }else if(field.barter_status=='2'){  //未通过
                render_table2(data.field)
            }else if(field.barter_status=='3'){   //待发货
                render_table3(data.field)
            }else if(field.barter_status=='4'){   //待收货
                render_table4(data.field)
            }else if(field.barter_status=='5'){    //已收货待退款
                render_table5(data.field)
            }else if(field.barter_status=='6'){    //已完成
                render_table6(data.field)
            }
        });
        form.render()
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){  //待审核
                field.barter_status='1'
                render_table1(field)
            }else if(index==1){   //未通过
                field.barter_status='2'
                render_table2(field)
            }else if(index==2){    //待发货
                field.barter_status='3'
                render_table3(field)
            }else if(index==3){  //待收货
                field.barter_status='4'
                render_table4(field)
            }else if(index==4){  //已收货待退款
                field.barter_status='5'
                render_table5(field)
            }else if(index==5){  //已完成
                field.barter_status='6'
                render_table6(field)
            }
        });
        form.render()
        var cols=[
            [{
                field: 'refund_order',
                title: '退货信息',
                align: 'left',
                templet:function(d){
                    var str = `<div>售后编号：${d.refund_order==''?'暂无':d.refund_order}</div>
                        <div>原订单号：${d.order_id== null ?'暂无':d.order_id}</div>`
                    return str
                }
            }, {
                field: 'supplier_name',
                title: '商户名称',
                align: 'left',
               
                }, {
                field: 'name',
                title: '用户信息',
                align: 'left',
                templet:function(d){
                    var str = `<div>用户名：${d.name}</div>
                                <div>手机号：${d.phone}</div>`
                    return str
                }
                }, {
                field: 'goods_name',
                title: '商品信息',
                align: 'left',
                templet:function(d){
                    var str = `<div>商品名称：${d.goods_name}</div>
                                <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                    return str
                }
                }, {
                field: 'refund_images',
                title: '退货商品图片',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                }
                }, {
                field: 'refund_remark',
                title: '问题描述',
                align: 'left',
                templet:function(d){
                    return d.refund_remark==''?'暂无':base.decode(d.refund_remark)
                }
                }, {
                field: 'refund_goods_count',
                title: '售后数量',
                align: 'left',
                templet:function(d){
                    var str = `<div>售后数量：${d.refund_goods_count==''?'暂无':d.refund_goods_count}</div>
                        <div>售后价格：${d.refund_total_price==''?'暂无':d.refund_total_price/100}</div>`
                    return str
                }
                }, {
                field: 'times',
                title: '售后时间信息',
                align: 'left',
                templet:function(d){
                    var str = `<div>申请售后时间：${d.refund_time=='0'?'暂无':layui.common.createTime(d.refund_time)}</div>
                        <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                        <div>用户退货时间：${d.times=='0'?'暂无':layui.common.createTime(d.times)}</div>
                        <div>商家确认收货：${d.confirm_time=='0'?'暂无':layui.common.createTime(d.confirm_time)}</div>
                        <div>商家退款时间：${d.supplier_money_time=='0'?'暂无':layui.common.createTime(d.supplier_money_time)}</div>`
                    return str
                }
                }, {
                field: 'express_company',
                title: '快递信息',
                align: 'left',
                templet:function(d){
                    var str = `<div>快递公司：${d.express_company==''?'暂无':d.express_company}</div>
                        <div>快递单号：${d.express_number==''?'暂无':d.express_number}</div>`
                    return str
                }
            }, 
            {  width:200,
                fixed: 'right',
                title: '操作',
                templet: function (d) {
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看详细信息</button>`
                }
            }]
        ]
      
        // ~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#refundTable1',
               url: layui.setter.requestUrl + 'api.php?c=order/getOrdersRefund',
               where: data,
               cols: cols,
               page: true,
               parseData: function(res){
                $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                    $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                    $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                    $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                    $('.status5').html('已收货待退款'+'&nbsp;'+res.data.order_status4)
                    $('.status6').html('已完成'+'&nbsp;'+res.data.order_status5)
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
      
        table.on('tool(refundTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.refund_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'refundDetail',
                    title: '订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/refundDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~审核未通过~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#refundTable2',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrdersRefund',
                where: data,
                cols: [
                    [{
                        field: 'refund_order',
                        title: '退货信息',
                        align: 'left',
                        templet:function(d){
                            var str = `<div>售后编号：${d.refund_order==''?'暂无':d.refund_order}</div>
                                <div>原订单号：${d.order_id== null ?'暂无':d.order_id}</div>`
                            return str
                        }
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'left',
                       
                        }, {
                        field: 'name',
                        title: '用户信息',
                        align: 'left',
                        templet:function(d){
                            var str = `<div>用户名：${d.name}</div>
                                        <div>手机号：${d.phone}</div>`
                            return str
                        }
                        }, {
                        field: 'frequent_name',
                        title: '商品信息',
                        align: 'left',
                        templet:function(d){
                            var str = `<div>商品名称：${d.goods_name}</div>
                                        <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                            return str
                        }
                        }, {
                        field: 'refund_images',
                        title: '退货商品图片',
                        align: 'center',
                        templet:function(d){
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                        }, {
                        field: 'refund_remark',
                        title: '问题描述',
                        align: 'left',
                        templet:function(d){
                            return d.refund_remark==''?'暂无':base.decode(d.refund_remark)
                        }
                        }, {
                        field: 'refund_goods_count',
                        title: '售后数量',
                        align: 'left',
                        templet:function(d){
                            var str = `<div>售后数量：${d.refund_goods_count==''?'暂无':d.refund_goods_count}</div>
                                <div>售后价格：${d.refund_total_price==''?'暂无':d.refund_total_price/100}</div>`
                            return str
                        }
                        }, {
                        field: 'times',
                        title: '售后时间信息',
                        align: 'left',
                        templet:function(d){
                            var str = `<div>申请售后时间：${d.times=='0'?'暂无':layui.common.createTime(d.times)}</div>
                                <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                                <div>用户退货时间：${d.barter_express_time=='0'?'暂无':layui.common.createTime(d.barter_express_time)}</div>
                                <div>商家确认收货：${d.confirm_time=='0'?'暂无':layui.common.createTime(d.confirm_time)}</div>
                                <div>商家退款时间：${d.supplier_money_time=='0'?'暂无':layui.common.createTime(d.supplier_money_time)}</div>`
                            return str
                        }
                        }, {
                        field: 'refund_refuse',
                        title: '拒绝原因',
                        align: 'left',
                        templet:function(d){
                            return d.refund_refuse==''?'暂无':base.decode(d.refund_refuse)
                        }
                    },
                        {
                        width:200,
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看详细信息</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                    $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                    $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                    $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                    $('.status5').html('已收货待退款'+'&nbsp;'+res.data.order_status4)
                    $('.status6').html('已完成'+'&nbsp;'+res.data.order_status5)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    
        table.on('tool(refundTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.refund_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'refundDetail',
                    title: '订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/refundDetail', data);
                    }
                });
            }
        })
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~待发货~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#refundTable3',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrdersRefund',
                where: data,
                cols: cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                    $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                    $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                    $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                    $('.status5').html('已收货待退款'+'&nbsp;'+res.data.order_status4)
                    $('.status6').html('已完成'+'&nbsp;'+res.data.order_status5)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        
        table.on('tool(refundTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.refund_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'refundDetail',
                    title: '订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/refundDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~待收货~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#refundTable4',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrdersRefund',
                where: data,
                cols: cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                    $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                    $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                    $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                    $('.status5').html('已收货待退款'+'&nbsp;'+res.data.order_status4)
                    $('.status6').html('已完成'+'&nbsp;'+res.data.order_status5)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(refundTable4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.refund_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'refundDetail',
                    title: '订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/refundDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已收货退款~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table5 = function (data) {
            table.render({
                elem: '#refundTable5',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrdersRefund',
                where: data,
                cols: cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                    $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                    $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                    $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                    $('.status5').html('已收货待退款'+'&nbsp;'+res.data.order_status4)
                    $('.status6').html('已完成'+'&nbsp;'+res.data.order_status5)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(refundTable5)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.refund_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'refundDetail',
                    title: '订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/refundDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已完成~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table6 = function (data) {
            table.render({
                elem: '#refundTable6',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrdersRefund',
                where: data,
                cols: cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                    $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                    $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                    $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                    $('.status5').html('已收货待退款'+'&nbsp;'+res.data.order_status4)
                    $('.status6').html('已完成'+'&nbsp;'+res.data.order_status5)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(refundTable6)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.refund_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'refundDetail',
                    title: '订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/refundDetail', data);
                    }
                });
            }
        })
    });
    //对外暴露的接口
    exports('refundList', {});
})