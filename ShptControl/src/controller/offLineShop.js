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
        var base = new layui.public.Base64();

        var field={
            type:'2',
            merchant_name:'',
            merchant_tel:'',
            up_start:'',
            up_end:'',
            pass_start:'',
            pass_end:'',
            is_auth:''
        };
        //日期格式化
        laydate.render({
            elem: '#time',
            range: true,
            format: 'yyyy/MM/dd',
        });
        //日期格式化
        laydate.render({
            elem: '#time1',
            range: true,
            format: 'yyyy/MM/dd',
        });
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            field.is_auth='-1'
            var index = data.index
            if(index==0){
                $('.checkTime').css('display','none')
                $('.is_auth').css('display','none')
                field.type='2'
                render_table1(field)
            }else if(index==1){
                $('.checkTime').css('display','block')
                $('.is_auth').css('display','inline-block')
                form.render()
                field.type='1'
                render_table2(field)
            }else if(index==2){
                $('.checkTime').css('display','block')
                $('.is_auth').css('display','none')
                field.type='3'
                render_table3(field)
            }else if(index==3){
                $('.is_auth').css('display','none')
                $('.checkTime').css('display','block')
                field.type='4'
                render_table4(field)
            }
        });
        
        form.render()

        form.on('submit(search1)', function(data){
            if (data.field.time != '') {
                field.up_start = data.field.time.split('-')[0].trim()
                var date = new Date(field.up_start);
                field.up_start = date.getTime()/1000
                field.up_end = data.field.time.split('-')[1].trim()
                var date = new Date(field.up_end);
                field.up_end = date.getTime()/1000
            } else {
                field.up_start = ''
                field.up_end = ''
            }
            if (data.field.time1 != '') {
                field.pass_start = data.field.time1.split('-')[0].trim()
                var date = new Date(field.pass_start);
                field.pass_start = date.getTime()/1000
                field.pass_end = data.field.time1.split('-')[1].trim()
                var date = new Date(field.pass_end);
                field.pass_end = date.getTime()/1000
            } else {
                field.pass_start = ''
                field.pass_end = ''
            }
            field.merchant_name = data.field.merchant_name
            field.merchant_tel = data.field.merchant_tel
            if(field.type==2){
                render_table1(field)
            }else if(field.type==1){
                field.is_auth = data.field.is_auth
                render_table2(field)
            }else if(field.type==3){
                render_table3(field)
            }else{
                render_table4(field)
            }
        });
      
        // ~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#tableShop1',
               url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
               where: data,
               cols: cols=[
                   [{
                       field: 'merchant_id',
                       title: 'ID',
                       align: 'center',
                       sort: true,
                       width:90,
                   },{
                       field: 'merchant_name',
                       title: '店铺名称',
                       align: 'center',
                      
                   }, {
                    field: 'scope_name',
                    title: '入驻行业',
                    align: 'center',
                   
                },{
                       field: 'merchant_contacts',
                       title: '商家联系人',
                       align: 'center',
                       
                   }, {
                       field: 'merchant_tel',
                       title: '商家联系人手机号',
                       align: 'center',
                   }, {
                    field: 'reg_phone',
                    title: '商家注册手机号',
                    align: 'center',
                },  {
                       field: 'submit_time',
                       title: '提交时间',
                       align: 'center',
                       templet:function(d){
                        return d.submit_time==0?'暂无':layui.common.createTime(d.submit_time)
                    }
                   }, {
                       field: 'audit_time',
                       title: '审核时间',
                       align: 'center',
                       templet:function(d){
                        return d.audit_time==0?'暂无':layui.common.createTime(d.audit_time)
                       }
                   }, 
                   {
                       fixed: 'right',
                       align: 'center',
                       title: '操作',
                    //    width:  210,
                       templet: function (d) {
                           return `<div><button type="button" class="layui-btn layui-btn-sm" lay-event = 'check'>审核资料</button></div>
                           <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看店铺资料</button></div>`
                       }
                   }]
               ],
               page: true,
               parseData: function(res){
                $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                $('.status2').html('营业中'+'&nbsp;'+res.data.success_count)
                $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
                $('.status4').html('已下架'+'&nbsp;'+res.data.down_count)
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
      
        table.on('tool(tableShop1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
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
                
            }else if(layEvent == 'check'){
                admin.popup({
                    id:'checkOffLineShop',
                    title: '线下店铺审核'
                    , area: ['900px', '600px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOfflineShop', {
                            merchant_id:data.merchant_id,
                            check:'true'
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~营业中~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#tableShop2',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
                where: data,
                cols: cols=[
                    [{
                        field: 'merchant_id',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:90,
                    },{
                        field: 'merchant_name',
                        title: '店铺名称',
                        align: 'center',
                       
                    }, {
                     field: 'scope_name',
                     title: '入驻行业',
                     align: 'center',
                    
                 },{
                        field: 'merchant_contacts',
                        title: '商家联系人',
                        align: 'center',
                        
                    }, {
                        field: 'merchant_tel',
                        title: '商家联系人手机号',
                        align: 'center',
                    }, {
                     field: 'reg_phone',
                     title: '商家注册手机号',
                     align: 'center',
                 }, {
                        field: 'submit_time',
                        title: '提交时间',
                        align: 'center',
                        templet:function(d){
                         return d.submit_time==0?'暂无':layui.common.createTime(d.submit_time)
                     }
                    }, {
                        field: 'audit_time',
                        title: '审核时间',
                        align: 'center',
                        templet:function(d){
                         return d.audit_time==0?'暂无':layui.common.createTime(d.audit_time)
                        }
                    },  {
                     field: 'merchant_percent',
                     title: '商家让利折扣',
                     align: 'center',
                     templet:function(d){
                        return d.merchant_percent+'%'
                       }
                 }, {
                    field: 'rank_order_status',
                    title: '是否是金牌商户',
                    align: 'center',
                    templet:function(d){
                        return d.rank_order_status=='2'?'否':'是'
                       }
                }, {
                    field: 'medal_time',
                    title: '成为金牌商户时间',
                    align: 'center',
                    templet:function(d){
                        return d.medal_time==0?'暂无':layui.common.createTime(d.medal_time)
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
                            <div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-xs" lay-event = 'set'>设置结算折扣</button>
                            <button type="button" class="layui-btn layui-btn-xs" lay-event = 'edit'>编辑特色介绍</button></div>
                            <div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-danger layui-btn-xs" lay-event = 'down'>强制下架</button></div>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                    $('.status2').html('营业中'+'&nbsp;'+res.data.success_count)
                    $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
                    $('.status4').html('已下架'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    
        table.on('tool(tableShop2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'look'){
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
            }else if(layEvent == 'set'){
                //页面层
                layer.open({
                    type: 1,
                    title:'设置结算折扣',
                    shadeClose:true,
                    area: ['500px', '200px'], //宽高
                    content: `
                        <div class="layui-form" style="margin-top:20px;">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label" style="width:120px">设置结算折扣：</label>
                                    <div class="layui-input-inline" style="width:220px">
                                        <input type="number" value="${data.merchant_percent}" name="merchant_percent" style="width:200px;margin-right:5px;display:inline-block"  autocomplete="off" placeholder="请输入内容" class="layui-input">%
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item" style="margin-top:30px;text-align: center;">
                                <div class="layui-inline">
                                    <button class="layui-btn layui-btn-lg" lay-submit lay-filter="sure">
                                        确定
                                    </button>
                                </div>
                            </div>
                        </div>
                    `,
                    success:function(){
                        form.on('submit(sure)', function (obj) {
                            if(obj.field.merchant_percent==''){
                                layer.msg('请输入结算折扣')
                                return false;
                            }
                            admin.req({
                                url:layui.setter.requestUrl+'api.php?c=merchant/setPercent',
                                data:{
                                    merchant_id:data.merchant_id,
                                    merchant_percent:obj.field.merchant_percent
                                },
                                success:function(res){
                                    if(res.code==0){
                                        layer.msg(res.msg)
                                        layer.closeAll()
                                        table.reload('tableShop2', {
                                            url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
                                            where:field
                                        });
                                    }else{
                                        layer.msg(res.msg)
                                    }
                                }
                            })
                        });            
                        
                    }
                });
            }else if(layEvent == 'down'){
                layer.confirm('确定下架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=merchant/offMerchant',
                            data:{
                                merchant_id: data.merchant_id,
                                type:'4',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    table.reload('tableShop2', {
                                        url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
                                        where:field
                                    });
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent == 'edit'){
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
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~未通过审核~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#tableShop3',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
                where: data,
                cols: cols=[
                    [{
                        field: 'merchant_id',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:90,
                    },{
                        field: 'merchant_name',
                        title: '店铺名称',
                        align: 'center',
                       
                    }, {
                     field: 'scope_name',
                     title: '入驻行业',
                     align: 'center',
                    
                 },{
                        field: 'merchant_contacts',
                        title: '商家联系人',
                        align: 'center',
                        
                    }, {
                        field: 'merchant_tel',
                        title: '商家联系人手机号',
                        align: 'center',
                    }, {
                     field: 'reg_phone',
                     title: '商家注册手机号',
                     align: 'center',
                 },  {
                        field: 'submit_time',
                        title: '提交时间',
                        align: 'center',
                        templet:function(d){
                         return d.submit_time==0?'暂无':layui.common.createTime(d.submit_time)
                        }
                    },  {
                     field: 'merchant_refuse',
                     title: '拒绝原因',
                     align: 'center',
                     templet:function(d){
                        return base.decode(d.merchant_refuse)
                    }
                 }, {
                    field: 'audit_time',
                    title: '审核时间',
                    align: 'center',
                    templet:function(d){
                        return d.audit_time==0?'暂无':layui.common.createTime(d.audit_time)
                       }
                }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<div> <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look1'>查看店铺资质</button></div>
                            <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看店铺资料</button></div>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                    $('.status2').html('营业中'+'&nbsp;'+res.data.success_count)
                    $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
                    $('.status4').html('已下架'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        
        table.on('tool(tableShop3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'look'){
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
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已下架商品~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#tableShop4',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
                where: data,
                cols: cols=[
                    [{
                        field: 'merchant_id',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:90,
                    },{
                        field: 'merchant_name',
                        title: '店铺名称',
                        align: 'center',
                       
                    }, {
                     field: 'scope_name',
                     title: '入驻行业',
                     align: 'center',
                    
                 },{
                        field: 'merchant_contacts',
                        title: '商家联系人',
                        align: 'center',
                        
                    }, {
                        field: 'merchant_tel',
                        title: '商家联系人手机号',
                        align: 'center',
                    }, {
                     field: 'reg_phone',
                     title: '商家注册手机号',
                     align: 'center',
                 }, {
                        field: 'submit_time',
                        title: '提交时间',
                        align: 'center',
                        templet:function(d){
                         return d.submit_time==0?'暂无':layui.common.createTime(d.submit_time)
                        }
                    },   {
                    field: 'audit_time',
                    title: '审核时间',
                    align: 'center',
                    templet:function(d){
                        return d.audit_time==0?'暂无':layui.common.createTime(d.audit_time)
                       }
                }, {
                    field: 'merchant_percent',
                    title: '结算折后',
                    align: 'center',
                    templet:function(d){
                        return d.merchant_percent+'%'
                       }
                }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:200,
                        templet: function (d) {
                            return `<div style="margin-bottom:5px"><button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'up'>上架</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看店铺资料</button></div>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look1'>查看店铺资质</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                    $('.status2').html('营业中'+'&nbsp;'+res.data.success_count)
                    $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
                    $('.status4').html('已下架'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        table.on('tool(tableShop4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'look'){
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
            }else if(layEvent == 'up'){
                layer.confirm('确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=merchant/offMerchant',
                            data:{
                                merchant_id: data.merchant_id,
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    table.reload('tableShop4', {
                                        url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantList',
                                        where:field
                                    });
                                }
                            }
                        })
                }, function(){
                    
                });
            }
        })


    });
    //对外暴露的接口
    exports('offLineShop', {});
})