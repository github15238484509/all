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
            order_name:'',
            supplier_name:'',
            time_start:'',
            time_end:'',
        };
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
                    $("input[name=testInput]").val("");
                    field.time_start = '';
                    field.time_end = '';
                } else {
                    field.time_start = new Date(value.split('-')[0]).getTime() / 1000;
                    field.time_end = new Date(value.split('-')[1]).getTime() / 1000;
                }
            }
        });
         //搜索
        form.on('submit(search1)', function (data) {
            data.field.time_start = field.time_start
            data.field.time_end = field.time_end
            data.field.barter_status=field.barter_status
            delete data.field.time
            if(field.barter_status=='1'){
                render_table1(data.field)
            }else if(field.barter_status=='2'){
                render_table2(data.field)
            }else if(field.barter_status=='3'){
                render_table3(data.field)
            }else if(field.barter_status=='4'){
                render_table5(data.field)
            }else if(field.barter_status=='5'){
                render_table6(data.field)
            }else if(field.barter_status=='6'){
                render_table4(data.field)
            }else if(field.barter_status=='8'){
                render_table7(data.field)
            }else if(field.barter_status=='7'){
                render_table8(data.field)
            }
        });
        form.render()
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){ //待审核
                field.barter_status='1'  
                render_table1(field)
            }else if(index==1){  //未通过
                field.barter_status='2'  
                render_table2(field)
            }else if(index==2){  //待退货
                field.barter_status='3'
                render_table3(field)
            }else if(index==3){  //待收货
                field.barter_status='6'
                render_table4(field)
            }else if(index==4){  //换货
                field.barter_status='4'
                render_table5(field)
            }else if(index==5){   //待发货
                field.barter_status='5'
                render_table6(field)   
            }else if(index==6){   //已发货
                field.barter_status='8'
                render_table7(field)
            }else if(index==7){   //已完成
                field.barter_status='7'
                render_table8(field)
            }
        });
        form.render()
        var cols=[
            [{
                field: 'barter_index',
                title: '订单信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>售后编号：${d.barter_order==''?'暂无':d.barter_order}</div>
                        <div>原订单号：${d.order_id==''?'暂无':d.order_id}</div>`
                    return str
                }
            }, {
                field: 'supplier_name',
                title: '商户名称',
                align: 'center',
               
            }, {
                field: 'name',
                title: '会员信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>用户名：${d.name}</div>
                                <div>手机号：${d.phone}</div>`
                    return str
                }
            }, {
                field: 'frequent_name',
                title: '商品信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>商品名称：${d.goods_name}</div>
                                <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                    return str
                }
            }, {
                field: 'barter_images',
                title: '售后图片',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                }
            },{
                field: 'barter_remark',
                title: '问题描述',
                align: 'center',
                templet:function(d){
                    return d.barter_remark==''|| !d.barter_remark ?'暂无':base.decode(d.barter_remark)

                }
            }, {
                field: 'barter_goods_count',
                title: '售后数量',
                align: 'center',
                templet:function(d){
                    var str = `<div>售后数量：${d.barter_goods_count==''?'暂无':d.barter_goods_count}</div>
                        <div>售后价格：${d.barter_total_price==''?'暂无':d.barter_total_price/100}</div>`
                    return str
                }
            }, {
                field: 'times',
                title: '售后时间信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>申请售后时间：${d.barter_time=='0'?'暂无':layui.common.createTime(d.barter_time)}</div>
                        <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                        <div>用户退/换货时间：${d.times=='0' || d.times==null?'暂无':layui.common.createTime(d.times)}</div>
                        <div>线上商家确认收货时间：${d.merchant_confirm_time=='0'?'暂无':layui.common.createTime(d.merchant_confirm_time)}</div>
                        <div>用户最终确认收货时间：${d.consumer_confirm_time=='0'?'暂无':layui.common.createTime(d.consumer_confirm_time)}</div>`
                    return str
                }
            }, 
            {
                fixed: 'right',
                align: 'center',
                title: '操作',
                templet: function (d) {
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看详细信息</button>`
                }
            }]
        ]
        var cols1=[
            [{
                field: 'barter_index',
                title: '订单信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>售后编号：${d.barter_order==''?'暂无':d.barter_order}</div>
                        <div>原订单号：${d.order_id==''?'暂无':d.order_id}</div>`
                    return str
                }
            }, {
                field: 'supplier_name',
                title: '商户名称',
                align: 'center',
               
            }, {
                field: 'name',
                title: '会员信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>用户名：${d.name}</div>
                                <div>手机号：${d.phone}</div>`
                    return str
                }
            }, {
                field: 'frequent_name',
                title: '商品信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>商品名称：${d.goods_name}</div>
                                <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                    return str
                }
            }, {
                field: 'barter_images',
                title: '售后图片',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                }
            },{
                field: 'barter_remark',
                title: '问题描述',
                align: 'center',
                templet:function(d){
                    return d.barter_remark==''|| !d.barter_remark ?'暂无':base.decode(d.barter_remark)

                }
            }, {
                field: 'barter_goods_count',
                title: '售后数量',
                align: 'center',
                templet:function(d){
                    var str = `<div>售后数量：${d.barter_goods_count==''?'暂无':d.barter_goods_count}</div>
                        <div>售后价格：${d.barter_total_price==''?'暂无':d.barter_total_price/100}</div>`
                    return str
                }
            }, {
                field: 'times',
                title: '售后时间信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>申请售后时间：${d.barter_time=='0'?'暂无':layui.common.createTime(d.barter_time)}</div>
                        <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                        <div>用户退/换货时间：${d.times=='0'|| d.times==null?'暂无':layui.common.createTime(d.times)}</div>
                        <div>线上商家确认收货时间：${d.merchant_confirm_time=='0'?'暂无':layui.common.createTime(d.merchant_confirm_time)}</div>
                        <div>用户最终确认收货时间：${d.consumer_confirm_time=='0'?'暂无':layui.common.createTime(d.consumer_confirm_time)}</div>`
                    return str
                }
            }, {
                field: 'merchant_express_number',
                title: '用户快递信息',
                align: 'center',
                templet:function(d){
                    var str = `<div>快递公司：${d.merchant_express_company==''?'暂无':d.merchant_express_company}</div>
                        <div>快递单号：${d.merchant_express_number==''?'暂无':d.merchant_express_number}</div>`
                    return str
                }
            }, 
            {
                fixed: 'right',
                align: 'center',
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
               elem: '#exchangeTable1',
               url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
               where: data,
               cols: cols,
               page: true,
               parseData: function(res){
                $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
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
      
        table.on('tool(exchangeTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~审核未通过~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#exchangeTable2',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: [
                    [{
                        field: 'barter_index',
                        title: '订单信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>售后编号：${d.barter_order==''?'暂无':d.barter_order}</div>
                                <div>原订单号：${d.order_id==''?'暂无':d.order_id}</div>`
                            return str
                        }
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                       
                    }, {
                        field: 'name',
                        title: '会员信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>用户名：${d.name}</div>
                                        <div>手机号：${d.phone}</div>`
                            return str
                        }
                    }, {
                        field: 'frequent_name',
                        title: '商品信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>商品名称：${d.goods_name}</div>
                                        <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                            return str
                        }
                    }, {
                        field: 'barter_images',
                        title: '售后图片',
                        align: 'center',
                        templet:function(d){
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                    },{
                        field: 'barter_remark',
                        title: '问题描述',
                        align: 'center',
                        templet:function(d){
                            return d.barter_remark==''|| !d.barter_remark ?'暂无':base.decode(d.barter_remark)

                        }
                    }, {
                        field: 'barter_goods_count',
                        title: '售后数量',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>售后数量：${d.barter_goods_count==''?'暂无':d.barter_goods_count}</div>
                                <div>售后价格：${d.barter_total_price==''?'暂无':d.barter_total_price/100}</div>`
                            return str
                        }
                    }, {
                        field: 'times',
                        title: '售后时间信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>申请售后时间：${d.barter_time=='0'?'暂无':layui.common.createTime(d.barter_time)}</div>
                                <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                                <div>用户退/换货时间：${d.times=='0'|| d.times==null?'暂无':layui.common.createTime(d.times)}</div>
                                <div>线上商家确认收货时间：${d.merchant_confirm_time=='0'?'暂无':layui.common.createTime(d.merchant_confirm_time)}</div>
                                <div>用户最终确认收货时间：${d.consumer_confirm_time=='0'?'暂无':layui.common.createTime(d.consumer_confirm_time)}</div>`
                            return str
                        }
                    }, {
                        field: 'barter_refuse',
                        title: '拒绝原因',
                        align: 'center',
                        templet:function(d){
                            return d.barter_refuse==''?'暂无':base.decode(d.barter_refuse)
                        }
                    }, 
                    {
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
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    
        table.on('tool(exchangeTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~待退货~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#exchangeTable3',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: cols1,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        
        table.on('tool(exchangeTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~待收货~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#exchangeTable4',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: cols1,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(exchangeTable4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~换货中~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table5 = function (data) {
            table.render({
                elem: '#exchangeTable5',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: cols1,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(exchangeTable5)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~待发货~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table6 = function (data) {
            table.render({
                elem: '#exchangeTable6',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: cols1,
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.order_status0)
                $('.status2').html('审核未通过'+'&nbsp;'+res.data.order_status1)
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(exchangeTable6)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已发货~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table7 = function (data) {
            table.render({
                elem: '#exchangeTable7',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: [
                    [{
                        field: 'barter_index',
                        title: '订单信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>售后编号：${d.barter_order==''?'暂无':d.barter_order}</div>
                                <div>原订单号：${d.order_id==''?'暂无':d.order_id}</div>`
                            return str
                        }
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                       
                    }, {
                        field: 'name',
                        title: '会员信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>用户名：${d.name}</div>
                                        <div>手机号：${d.phone}</div>`
                            return str
                        }
                    }, {
                        field: 'frequent_name',
                        title: '商品信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>商品名称：${d.goods_name}</div>
                                        <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                            return str
                        }
                    }, {
                        field: 'barter_images',
                        title: '售后图片',
                        align: 'center',
                        templet:function(d){
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                    },{
                        field: 'barter_remark',
                        title: '问题描述',
                        align: 'center',
                        templet:function(d){
                            return d.barter_remark==''|| !d.barter_remark ?'暂无':base.decode(d.barter_remark)
                        }
                    }, {
                        field: 'barter_goods_count',
                        title: '售后数量',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>售后数量：${d.barter_goods_count==''?'暂无':d.barter_goods_count}</div>
                                <div>售后价格：${d.barter_total_price==''?'暂无':d.barter_total_price/100}</div>`
                            return str
                        }
                    }, {
                        field: 'times',
                        title: '售后时间信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>申请售后时间：${d.barter_time=='0'?'暂无':layui.common.createTime(d.barter_time)}</div>
                                <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                                <div>用户退/换货时间：${d.times=='0'|| d.times==null?'暂无':layui.common.createTime(d.times)}</div>
                                <div>线上商家确认收货时间：${d.merchant_confirm_time=='0'?'暂无':layui.common.createTime(d.merchant_confirm_time)}</div>
                                <div>用户最终确认收货时间：${d.consumer_confirm_time=='0'?'暂无':layui.common.createTime(d.consumer_confirm_time)}</div>`
                            return str
                        }
                    }, {
                        field: 'barter_express_number',
                        title: '商家发货快递信息',
                        align: 'center',
                        templet:function(d){
                            var str = `
                                <div>快递单号：${d.barter_express_number==''?'暂无':d.barter_express_number}</div>`
                            return str
                        }
                    }, 
                    {
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
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(exchangeTable7)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已完成~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table8 = function (data) {
            table.render({
                elem: '#exchangeTable8',
                url: layui.setter.requestUrl + 'api.php?c=order/getExchangeGoods',
                where: data,
                cols: [
                    [{
                        field: 'barter_index',
                        title: '订单信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>售后编号：${d.barter_order==''?'暂无':d.barter_order}</div>
                                <div>原订单号：${d.order_id==''?'暂无':d.order_id}</div>`
                            return str
                        }
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                       
                    }, {
                        field: 'name',
                        title: '会员信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>用户名：${d.name}</div>
                                        <div>手机号：${d.phone}</div>`
                            return str
                        }
                    }, {
                        field: 'frequent_name',
                        title: '商品信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>商品名称：${d.goods_name}</div>
                                        <div>商品sku：${d.sku==''?'暂无':d.sku}</div>`
                            return str
                        }
                    }, {
                        field: 'barter_images',
                        title: '售后图片',
                        align: 'center',
                        templet:function(d){
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                    },{
                        field: 'barter_remark',
                        title: '问题描述',
                        align: 'center',
                        templet:function(d){
                            return d.barter_remark==''|| !d.barter_remark ?'暂无':base.decode(d.barter_remark)

                        }
                    }, {
                        field: 'barter_goods_count',
                        title: '售后数量',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>售后数量：${d.barter_goods_count==''?'暂无':d.barter_goods_count}</div>
                                <div>售后价格：${d.barter_total_price==''?'暂无':d.barter_total_price/100}</div>`
                            return str
                        }
                    }, {
                        field: 'times',
                        title: '售后时间信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>申请售后时间：${d.barter_time=='0'?'暂无':layui.common.createTime(d.barter_time)}</div>
                                <div>审核时间：${d.check_time=='0'?'暂无':layui.common.createTime(d.check_time)}</div>
                                <div>用户退/换货时间：${d.times=='0' || d.times==null?'暂无':layui.common.createTime(d.times)}</div>
                                <div>线上商家确认收货时间：${d.merchant_confirm_time=='0'?'暂无':layui.common.createTime(d.merchant_confirm_time)}</div>
                                <div>用户最终确认收货时间：${d.consumer_confirm_time=='0'?'暂无':layui.common.createTime(d.consumer_confirm_time)}</div>`
                            return str
                        }
                    }, {
                        field: 'merchant_express_number',
                        title: '用户快递信息',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>快递公司：${d.merchant_express_company==''?'暂无':d.merchant_express_company}</div>
                                <div>快递单号：${d.merchant_express_number==''?'暂无':d.merchant_express_number}</div>`
                            return str
                        }
                    }, {
                        field: 'barter_express_number',
                        title: '商家发货快递信息',
                        align: 'center',
                        templet:function(d){
                            var str = `
                                <div>快递单号：${d.barter_express_number==''?'暂无':d.barter_express_number}</div>`
                            return str
                        }
                    },
                    {
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
                $('.status3').html('待退货'+'&nbsp;'+res.data.order_status2)
                $('.status4').html('待收货'+'&nbsp;'+res.data.order_status3)
                $('.status5').html('维修中/换货中'+'&nbsp;'+res.data.order_status4)
                $('.status6').html('待发货'+'&nbsp;'+res.data.order_status5)
                $('.status7').html('已发货'+'&nbsp;'+res.data.order_status6)
                $('.status8').html('已完成'+'&nbsp;'+res.data.order_status7)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(exchangeTable8)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.barter_images.split(',')); 
            }else if(layEvent == 'look'){
                data.barter_status=field.barter_status
                admin.popup({
                    id:'exchangeDetail',
                    title: '换修货订单详情'
                    , area: ['700px', '700px']
                    , success: function () {
                        view(this.id).render('/template/orderManage/exchangeDetail',data);
                    }
                });
            }
        })
    });
    //对外暴露的接口
    exports('exchangeList', {});
})