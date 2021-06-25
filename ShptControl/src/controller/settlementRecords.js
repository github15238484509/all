layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'contlist', 'laydate','table', 'common','public','form','element'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            table = layui.table,
            laydate = layui.laydate,
            element = layui.element,
            IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限
        var tool = layui.public.tool;


        var field={
            type:'1',
            supplier_name:'',
            supplier_phone:'',
            phone:'',
            start:'',
            end:'',
        };
        //日期格式化
        laydate.render({
            elem: '#time',
            range: true,
            format: 'yyyy/MM/dd',
        });
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            field.start = ''
            field.end = ''
            var index = data.index
            if(index==0){
                field.type='1'
                render_table1(field)
            }else if(index==1){
                field.type='2'
                render_table2(field)
            }
        });
        
        form.render()

        form.on('submit(search1)', function(data){
            if (data.field.time != '') {
                field.start = data.field.time.split('-')[0].trim()
                var date = new Date(field.start);
                field.start = date.getTime()/1000
                field.end = data.field.time.split('-')[1].trim()
                var date = new Date(field.end);
                field.end = date.getTime()/1000
            } else {
                field.start = ''
                field.end = ''
            }
            field.supplier_name = data.field.supplier_name
            field.supplier_phone = data.field.supplier_phone
            field.phone = data.field.phone
            if(field.type==1){
                render_table1(field)
            }else if(field.type==2){
                field.is_auth = data.field.is_auth
                render_table2(field)
            }
        });
      
        // ~~~~~~~~~~~~~~~~待结算~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#settlementTable1',
               url: layui.setter.requestUrl + 'api.php?c=supplier/getSettlementList',
               where: data,
               cols: cols=[
                   [{
                       field: 'order_id',
                       title: '订单号',
                       align: 'center',
                       sort:'true'
                   },{
                       field: 'supplier_name',
                       title: '商家信息',
                       align: 'center',
                       templet: function (d) {
                            return `<div>店铺名称：${d.supplier_name ? d.supplier_name : '无'}</div>
                                    <div>手机号：${d.frequent_phone ? d.frequent_phone : '无'}</div>`
                        }
                   }, {
                    field: 'name',
                    title: '会员信息',
                    align: 'center',
                    templet: function (d) {
                        return `<div>昵称：${d.name ? d.name : '无'}</div>
                                <div>手机号：${d.phone ? d.phone : '无'}</div>`
                    }
                },{
                       field: 'goods_num',
                       title: '商品数量',
                       align: 'center',
                       sort:'true'
                   }, {
                       field: 'cash',
                       title: '结算金额',
                       align: 'center',
                       sort:'true',
                       templet: function (d) {
                        return d.cash/100
                    }
                   },{
                        field: 'accomplish_time',
                        title: '订单完成时间',
                        sort: true,
                        align: 'center',
                        sort:'true',
                        templet: function (d) {
                            return d.accomplish_time==0?'暂无':layui.common.createTime(d.accomplish_time)
                        }
                   }]
               ],
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~已结算~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#settlementTable2',
                url: layui.setter.requestUrl + 'api.php?c=supplier/getSettlementList',
                where: data,
                cols: cols=[
                    [{
                        field: 'order_id',
                        title: '订单号',
                        align: 'center',
                        sort:'true'
                    },{
                        field: 'supplier_name',
                        title: '商家信息',
                        align: 'center',
                        templet: function (d) {
                             return `<div>店铺名称：${d.supplier_name}</div>
                                     <div>手机号：${d.frequent_phone}</div>`
                         }
                    }, {
                     field: 'name',
                     title: '会员信息',
                     align: 'center',
                     templet: function (d) {
                         return `<div>昵称：${d.name}</div>
                                 <div>手机号：${d.phone}</div>`
                     }
                 },{
                        field: 'goods_num',
                        title: '商品数量',
                        align: 'center',
                        sort:'true'
                    }, {
                        field: 'cash',
                        title: '结算金额',
                        align: 'center',
                        sort:'true',
                        templet: function (d) {
                         return d.cash/100
                     }
                    },{
                        field: 'accomplish_time',
                        title: '订单完成时间',
                        align: 'center',
                        sort:'true',
                        templet: function (d) {
                            return d.accomplish_time==0?'暂无':layui.common.createTime(d.accomplish_time)
                        }
                    },{
                        field: 'profit_time',
                        title: '结算时间',
                        align: 'center',
                        sort:'true',
                        templet: function (d) {
                            return d.profit_time==0?'暂无':layui.common.createTime(d.profit_time)
                        }
                    }]
                ],
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
    exports('settlementRecords', {});
})