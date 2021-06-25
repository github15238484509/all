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
            merchant_name:'',
            merchant_tel:'',
            up_start:'',
            up_end:'',
        };
        form.render()
          //日期格式化
          laydate.render({
            elem: '#test',
            type: 'datetime',
            range: true,
            trigger: 'click',
            format: 'yyyy/M/d',
            change: function (value, date, endDate) {

            },
            done: function (value, date, endDate) {
                if (!value) {
                    $("input[name=time]").val("");
                    field.up_start = '';
                    field.up_end = '';
                } else {
                    field.up_start = new Date(value.split('-')[0]).getTime() / 1000;
                    field.up_end = new Date(value.split('-')[1]).getTime() / 1000;
                }
            }
        });
        //搜索
        form.on('submit(search)', function (data) {
            data.field.up_start=field.up_start
            data.field.up_end=field.up_end
            delete  data.field.time
            render_table(data.field);
        });
       
        //渲染表格数据
        var render_table = function (data) {
            table.render({
                elem: '#merchantTable',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getRankOrderList',
                where: data,
                cols: cols=[
                    [{
                        field: 'order_id',
                        title: '订单编号',
                        align: 'center',
                       
                    }, {
                     field: 'merchant_name',
                     title: '商家名称',
                     align: 'center',
                    
                 },{
                        field: 'merchant_tel',
                        title: '商家手机号',
                        align: 'center',
                        
                    },
                    {
                        field: 'payment_order_id',
                        title: '交易单号/商户单号',
                        align: 'center',
                        templet:function(d){
                            return `<div style="">交易单号：${d.payment_order_id==null?'暂无':d.payment_order_id}</div>
                            <div style="">商户单号：${d.payment_transaction_id==null?'暂无':d.payment_transaction_id}</div>`
                        }
                    }, {
                        field: 'pay_type',
                        title: '支付方式',
                        align: 'center',
                        templet:function(d){
                            return d.pay_type=='1'?'微信支付':'支付宝支付'
                        }
                    }, {
                        field: 'payment_succeed_time',
                        title: '支付时间',
                        align: 'center',
                        templet:function(d){
                         return d.payment_succeed_time==0?'暂无':layui.common.createTime(d.payment_succeed_time)
                        }
                    },{
                        field: 'note',
                        title: '备注',
                        align: 'center',
                        templet:function(d){
                            return d.note==0?'暂无':base.decode(d.note)
                        }
                    }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:210,
                        templet: function (d) {
                            return `<div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-normal layui-btn-xs" lay-event = 'look'>查看店铺资料</button>
                            <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event = 'look1'>查看店铺资质</button></div>
                            <div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-xs" lay-event = 'edit'>编辑特色介绍</button>
                            <button type="button" class="layui-btn layui-btn-xs" lay-event = 'add'>${d.note==''?'添加备注信息':'编辑备注信息'}</button></div>`
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
        //自调渲染表格
        render_table(field);

        table.on('tool(merchantTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'look'){
                console.log(data);
                admin.popup({
                    id:'lookOfflineShop',
                    title: '线下店铺资料'
                    , area: ['900px', '600px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOfflineShop', {
                            merchant_id:data.merchant_id
                        });
                    }
                });
            }else if(layEvent == 'look1'){
                admin.popup({
                    id:'lookQualifications',
                    title: '线下店铺资质'
                    , area: ['900px', '600px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookQualifications', {
                            merchant_id:data.merchant_id
                        });
                    }
                });
            }else if(layEvent == 'add'){
                admin.popup({
                    id:'addNote',
                    title: '添加备注'
                    , area: ['500px', '400px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/addNote', {
                            order_index:data.order_index,
                            note:data.note
                        });
                    }
                });
            }else if(layEvent == 'edit'){
                data.jump_type='1'
                admin.popup({
                    id:'editIntroduce',
                    title: ' 编辑特色介绍'
                    , area: ['600px', '500px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/editIntroduce', data);
                    }
                });
            }
        })

    });
    //对外暴露的接口
    exports('merchantOrder', {});
})