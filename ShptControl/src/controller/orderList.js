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
            type:'',
            goods_name:'',
            supplier_phone:'',
            time_start:'',
            profit_status:'',
            time_end:'',
            order_status:''
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
            data.field.order_status=field.order_status
            delete data.field.time
            if(field.order_status==''){
                render_table1(data.field)
            }else if(field.order_status=='1'){
                render_table2(data.field)
            }else if(field.order_status=='2'){
                render_table3(data.field)
            }else if(field.order_status=='5'){
                render_table4(data.field)
            }else if(field.order_status=='0'){
                render_table5(data.field)
            }else if(field.order_status=='6'){
                render_table6(data.field)
            }else if(field.order_status==6){
                render_table7(data.field)
            }
        });
        form.render()
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                field.order_status=''
                render_table1(field)
            }else if(index==1){
                field.order_status='1'
                render_table2(field)
            }else if(index==2){
                field.order_status='2'
                render_table3(field)
            }else if(index==3){
                field.order_status='5'
                render_table4(field)
            }else if(index==4){
                field.order_status='0'
                render_table5(field)
            }else if(index==5){
                field.order_status='6'
                render_table6(field)
            }else if(index==6){
                field.order_status='4'
                render_table7(field)
            }
        });
        form.render()
        var cols=[
            [{
                field: 'order_id',
                title: '订单号',
                align: 'center',
               
            }, {
                field: 'supplier_name',
                title: '店铺信息',
                align: 'center',
                templet:function(d){
                 var str = `<div>店铺名称：${d.supplier_name}</div>
                             <div>联系电话：${d.frequent_phone}</div>`
                 return str
             }
                
            }, {
                field: 'frequent_name',
                title: '订单支付详情',
                align: 'center',
                templet:function(d){
                    var str = `<div>用户支付：${d.order_total_price==''?'暂无':d.order_total_price/100}</div>
                    <div>结算价：${d.order_supplier_coupon==''?'暂无':d.order_supplier_coupon/100}</div>
                    <div>运费：${d.order_freight_price==''?'暂无':d.order_freight_price/100}</div>`
                    return str
                }
            }, {
                field: 'order_contacts',
                title: '收货人信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>姓名：${d.order_contacts==''?'暂无':d.order_contacts}</div>
                        <div>地址：${d.order_address==''?'暂无':d.order_address}</div>`
                    return str
                }
            }, {
                field: 'name',
                title: '购买人信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>昵称：${d.name==''?'暂无':d.name}</div>
                        <div>手机号：${d.phone==''?'暂无':d.phone}</div>`
                    return str
                }
            }, {
                field: 'goods_count',
                title: '商品总数量',
                align: 'center',
            }, {
                field: 'order_time',
                title: '下单时间',
                align: 'center',
                templet:function(d){
                 return d.order_time==0?'暂无':layui.common.createTime(d.order_time)
             }
            }, {
                field: 'payment_time',
                title: '支付时间',
                align: 'center',
                templet:function(d){
                 return d.payment_time==0?'暂无':layui.common.createTime(d.payment_time)
                }
            }, {
                field: 'order_payment',
                title: '支付类型',
                align: 'center',
                templet:function(d){
                    return d.order_payment==0?'余额支付':d.order_payment==1?'支付宝app':d.order_payment==2?'微信app':d.order_payment==3?'微信h5':d.order_payment==4?'微信公众号':d.order_payment==8?'未支付':d.order_payment==9?'拼团本金':'支付宝web'
                }
            }, {
                field: 'fahuo_time',
                title: '其他时间',
                align: 'center',
                templet:function(d){
                    var str = `<div>发货时间：${d.fahuo_time=='0'?'暂无':layui.common.createTime(d.fahuo_time)}</div>
                        <div>确认收货：${d.confirm_time=='0'?'暂无':layui.common.createTime(d.confirm_time)}</div>`
                    return str
                }
            }, {
                field: 'profit_status',
                title: '结算状态',
                align: 'center',
                templet:function(d){
                    return d.profit_status==0?'未结算':'已结算'
                }
            }, {
                field: 'order_remark',
                title: '备注',
                align: 'center',
                templet:function(d){
                    return d.order_remark==''?'暂无':base.decode(d.order_remark)
                }
            }, {
                field: 'order_status',
                title: '订单状态',
                align: 'center',
                templet:function(d){
                    return d.order_status==0?'已取消':d.order_status==1?'待支付':d.order_status==2?'待出库':d.order_status==3?'正在出库':d.order_status==4?'已部分发货':d.order_status==5?'待收货':d.order_status==6?'已完成':'退款审核中'
                }
            },
            {
                fixed: 'right',
                align: 'center',
                title: '操作',
                width:180,
                templet: function (d) {
                    return `<div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>订单详情</button>
                    <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look1'>查看商品</button><div>
                    <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'look2'>打印订单</button><div>`
                }
            }]
        ]
      
        // ~~~~~~~~~~~~~~~~全部~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#orderList1',
               url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
               where: data,
               cols: cols,
               page: true,
               parseData: function(res){
                $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
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
      
        table.on('tool(orderList1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail',data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~待付款~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //搜索
        form.on('submit(search2)', function (data) {
           
                // render_table2(field);
        });
       
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#orderList2',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
                where: data,
                cols: cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    
        table.on('tool(orderList2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~待发货~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#orderList3',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
                where: data,
                cols: cols=cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        
        table.on('tool(orderList3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~待收货~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#orderList4',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
                where: data,
                cols: cols=cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(orderList4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已取消~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table5 = function (data) {
            table.render({
                elem: '#orderList5',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
                where: data,
                cols: cols=cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(orderList5)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已完成~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table6 = function (data) {
            table.render({
                elem: '#orderList6',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
                where: data,
                cols: cols=cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(orderList6)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~超时发货~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table7 = function (data) {
            table.render({
                elem: '#orderList7',
                url: layui.setter.requestUrl + 'api.php?c=order/getOrderList',
                where: data,
                cols: cols=cols,
                page: true,
                parseData: function(res){
                    $('.status1').html('全部'+'&nbsp;'+res.data.order_status_count)
                $('.status2').html('待付款'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待发货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('已取消'+'&nbsp;'+res.data.order_status0)
                $('.status6').html('已完成'+'&nbsp;'+res.data.order_status6)
                $('.status7').html('超时发货'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(orderList7)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'orderDetail',
                    title: '查看订单信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }else if (layEvent == 'look1') {
                admin.popup({
                    id:'orderGoods',
                    title: '查看订单商品'
                    , area: ['1100px', '500px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderGoods', {
                            order_index:data.order_index
                        });
                    }
                });
            }else if (layEvent == 'look2') {
                data.print='1'
                admin.popup({
                    id:'orderGoods',
                    title: '打印订单'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/orderDetail', data);
                    }
                });
            }
        })


    });
    //对外暴露的接口
    exports('orderList', {});
})