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
            var base = new layui.public.Base64();
            IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限
        var tool = layui.public.tool;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~提现设置~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       var render_table1 = function () {
           table.render({
               elem: '#setTable',
               url: layui.setter.requestUrl + 'api.php?c=withdraw_setting/withdrawSettingShow',
               cols: cols=[
                   [{
                       field: 'rank_des',
                       title: '等级名称',
                       align: 'center',
                   },{
                       field: 'withdraw_day_des',
                       title: '提现次数',
                       align: 'center',
                      
                   }, {
                    field: 'low_cash',
                    title: '最低提现金额',
                    align: 'center',
                    templet:function(d){
                        return d.low_cash/100
                    }
                },{
                       field: 'cash_rule_des',
                       title: '提现金额规则',
                       align: 'center',
                       
                   }, {
                       field: 'service_key_des',
                       title: '手续费类型',
                       align: 'center',
                   }, 
                   {
                       fixed: 'right',
                       align: 'center',
                       title: '操作',
                       width:  210,
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
       render_table1();
       $('.addRule').click(function(){
            admin.popup({
                id:'addWithdrawal',
                title: '添加提现规则'
                , area: ['600px', '550px']
                , success: function () {
                    view(this.id).render('/template/finance/addWithdrawal', {});
                }
            });
       })
        table.on('tool(setTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'withdraw_setting/delWithdrawSetting',
                    param: {
                        withdraw_index:data.withdraw_index
                    },
                    success: function (res) {
                        table.reload('setTable', {
                            url: layui.setter.requestUrl + 'api.php?c=withdraw_setting/withdrawSettingShow'
                        });
                    }
                });
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'addWithdrawal',
                    title: '编辑提现规则'
                    , area: ['600px', '550px']
                    , success: function () {
                        view(this.id).render('/template/finance/addWithdrawal', data);
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~提现说明~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=mall_set/getMallSet',
            data: {
                type:'4'
            },
            success: function (res) {
                if (res.code == 0) {
                    $('.accounting_time').val(res.data.accounting_time)
                    $('.sos_phone').val(res.data.sos_phone)
                    $('.withdraw_rule').val(base.decode(res.data.withdraw_rule))
                } else {
                    layer.msg(res.msg);
                }
            }
        })
        form.on('submit(sure)', function(data){
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=mall_set/set_withdraw_hint',
                data: data.field,
                success: function (res) {
                    if (res.code == 0) {
                        layer.msg(res.msg);
                    } else {
                        layer.msg(res.msg);
                    }
                }
            })
            return false
        })
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~银行卡~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        $('.addBank').click(function(){
            admin.popup({
                id:'addBank',
                title: '添加银行信息'
                , area: ['600px', '550px']
                , success: function () {
                    view(this.id).render('/template/finance/addBank', {});
                }
            });
       })
       var render_table2 = function () {
        table.render({
            elem: '#bankTable',
            url: layui.setter.requestUrl + 'api.php?c=bank/getWithdrawBankCardList',
            cols: cols=[
                [{
                    field: 'bank_name',
                    title: '银行名称',
                    align: 'center',
                },{
                    field: 'logo',
                    title: 'logo',
                    align: 'center',
                    templet: function (d) {
                        var src = layui.setter.CDN + d.logo
                        var str = `<img src = ${src} style="cursor:pointer;width:30px;height:30px" lay-event = 'enlarge' ></img>`
                        return str
                    }
                   
                }, {
                    field: 'bank_type',
                    title: '银行类型',
                    align: 'center',
                    templet:function(d){
                        return d.bank_type=='1'?'传统银行':d.bank_type=='2'?'支付宝':'微信'
                    }
                },{
                    field: 'is_used',
                    title: '是否支持提现',
                    align: 'center',
                    templet:function(d){
                        var str=`<input type="checkbox" name="is_used" value="${d.id}" lay-skin="switch" lay-text="是|否" lay-filter="statusSwitch" ${ d.is_used == 1 ? 'checked' : '' }>`
                        return str
                    }
                    
                }, {
                    field: 'bank_note',
                    title: '备注信息',
                    align: 'center',
                    templet:function(d){
                        return d.bank_note==''?'暂无':base.decode(d.bank_note)
                    }
                },  {
                    field: 'sort',
                    title: '排序',
                    align: 'center',
                    templet: function (d) {
                        var div = `<div>
                                    <input style="text-align:center;width:60px" class="save" type="number" value='${d.sort}'>
                                    <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                                   </div>`
                        return [div]
                    }
                }, 
                {
                    field: 'time',
                    title: '添加时间',
                    align: 'center',
                    templet:function(d){
                        return layui.common.createTime(d.time)
                    }
                }, 
                {
                    fixed: 'right',
                    align: 'center',
                    title: '操作',
                    width:  210,
                    templet: function (d) {
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" lay-event = 'del'>删除</button>`
                    }
                }]
            ],
            page: true,
        });
    }
    //先自调用请求渲染数据
        render_table2();
          //监听状态操作
       form.on('switch(statusSwitch)', function(data){
            let type=''
            if(data.elem.checked){
                type='1'
            }else{
                type='0'
            }
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=bank/setWithdrawBankCard',
                data:{
                    id:data.value,
                    type:type
                },
                success: function (res) {
                    if (res.code == 0) {
                        layer.msg(res.msg);
                        parent.layui.table.reload("bankTable");
                    } else {
                        layer.msg(res.msg);
                    }
                }
            })
        });
        table.on('tool(bankTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.zone_pic.split(','));
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=bank/sortWithdrawBankCard',
                    data:{
                        id:data.id,
                        sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("bankTable");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'bank/delWithdrawBankCard',
                    param: {
                        id:data.id
                    },
                    success: function (res) {
                        parent.layui.table.reload("bankTable");
                    }
                });
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'addBank',
                    title: '编辑银行信息'
                    , area: ['600px', '550px']
                    , success: function () {
                        view(this.id).render('/template/finance/addBank', data);
                    }
                });
            }
        })

    });
    
    //对外暴露的接口
    exports('set_withdrawal', {});
})