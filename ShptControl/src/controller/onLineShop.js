layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'contlist','laydate', 'table', 'common','public','form','element'],
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
            supplier_name:'',
            supplier_phone:'',
            up_start:'',
            up_end:'',
            pass_start:'',
            pass_end:'',
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
        form.render()

        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                $('.checkTime').css('display','none')
                field.type='2'
                render_table1(field)
            }else if(index==1){
                $('.checkTime').css('display','block')
                field.type='1'
                render_table2(field)
            }else if(index==2){
                $('.checkTime').css('display','block')
                field.type='3'
                render_table3(field)
            }else if(index==3){
                $('.checkTime').css('display','block')
                field.type='4'
                render_table4(field)
            }
        });
        form.on('submit(search)', function(data){
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
            field.supplier_name = data.field.supplier_name
            field.supplier_phone = data.field.supplier_phone
            if(field.type==2){
                render_table1(field)
            }else if(field.type==1){
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
               elem: '#shopTable1',
               url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
               where: data,
               cols: cols=[
                   [{
                       field: 'supplier_id',
                       title: 'ID',
                       align: 'center',
                       sort: true,
                       width:90,
                   },{
                       field: 'supplier_name',
                       title: '店铺名称',
                       align: 'center',
                      
                   },{
                        field: 'supplier_scope_name',
                        title: '经营类目',
                        align: 'center',
                    
                    }, {
                       field: 'supplier_contacts',
                       title: '法人信息',
                       align: 'center',
                       templet:function(d){
                        var str = `<div>姓名：${d.supplier_contacts}</div>
                                    <div>身份证号：${d.card_number}</div>`
                        return str
                    }
                       
                   }, {
                       field: 'frequent_name',
                       title: '常用联系人信息',
                       align: 'center',
                       templet:function(d){
                        var str = `<div>姓名：${d.frequent_name==''?'暂无':d.frequent_name}</div>
                        <div>手机号：${d.frequent_phone==''?'暂无':d.frequent_phone}</div>`
                        return str
                    }
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
                   },  {
                    field: 'supplier_pay_period',
                    title: '商家结算时间',
                    align: 'center',
                    templet:function(d){
                        return `<div class="days">${d.supplier_pay_period+'天'}</div>`
                       }
                }, 
                   {
                       fixed: 'right',
                       align: 'center',
                       title: '操作',
                       width:250,
                       templet: function (d) {
                           return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'check'>审核</button>
                           <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看商家信息</button>`
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
      
        table.on('tool(shopTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
                admin.popup({
                    id:'checkGoods',
                    title: '查看商家信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOnlineShop', {
                            supplier_id:data.supplier_id
                        });
                    }
                });
                
            }else if(layEvent == 'check'){
                admin.popup({
                    id:'checkShop',
                    title: '线上商家审核'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOnlineShop', {
                            supplier_id:data.supplier_id,
                            url:'api.php?c=supplier/changeSupplier',
                            table:'shopTable1',
                            checkShop:'true'
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~营业中~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#shopTable2',
                url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
                where: data,
                cols: cols=[
                    [{
                        field: 'supplier_id',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:90,
                    },{
                        field: 'supplier_name',
                        title: '店铺名称',
                        align: 'center',
                       
                    },{
                        field: 'supplier_scope_name',
                        title: '经营类目',
                        align: 'center',
                    
                    },  {
                        field: 'supplier_contacts',
                        title: '店主信息',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>姓名：${d.supplier_contacts}</div>
                                    <div>身份证号：${d.card_number}</div>`
                         return str
                     }
                        
                    }, {
                        field: 'frequent_name',
                        title: '常用联系人信息',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>姓名：${d.frequent_name==''?'暂无':d.frequent_name}</div>
                         <div>手机号：${d.frequent_phone==''?'暂无':d.frequent_phone}</div>`
                         return str
                     }
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
                    },  {
                     field: 'supplier_pay_period',
                     title: '商家结算时间',
                     align: 'center',
                     templet:function(d){
                         return d.supplier_pay_period+'天'
                        }
                 }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:250,
                        templet: function (d) {
                            return `<div><button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看商家信息</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'set'>设置结算日期</button></div>
                            <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'password'>重置登录密码</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>修改银行卡信息</button></div>
                            <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'down'>强制下架</button></div>`
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
    
        table.on('tool(shopTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'look'){
                admin.popup({
                    id:'checkGoods',
                    title: '查看商家信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOnlineShop', {
                            supplier_id:data.supplier_id
                        });
                    }
                });
            }else if(layEvent == 'set'){
                //页面层
                layer.open({
                    type: 1,
                    title:'设置结算日期',
                    shadeClose:true,
                    area: ['500px', '300px'], //宽高
                    content: `
                        <div class="layui-form" style="margin-top:20px;">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label" style="width:150px">设置结算日期：</label>
                                    <div class="layui-input-inline" style="width:250px">
                                        <input type="number" name="day" value="${data.supplier_pay_period}" style="width:200px;display:inline-block;margin-right:5px"  autocomplete="off" placeholder="请输入内容" class="layui-input">天
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label" style="width:150px"></label>
                                <div class="layui-inline" style="width:250px">
                                    <div class="" style="color:rgba(255, 87, 51, 1);height:50px">
                                         比如7天：确认收货7天之后，给商家结算商品款项
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
                            if(obj.field.day==''){
                                layer.msg('请输入设置日期')
                                return false;
                            }
                            admin.req({
                                url:layui.setter.requestUrl+'api.php?c=supplier/setDay',
                                data:{
                                    supplier_id:data.supplier_id,
                                    day:obj.field.day
                                },
                                success:function(res){
                                    if(res.code==0){
                                        layer.msg(res.msg)
                                        layer.closeAll()
                                        table.reload('shopTable2', {
                                            url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
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
                            url:layui.setter.requestUrl + 'api.php?c=supplier/offSupplier',
                            data:{
                                supplier_id: data.supplier_id,
                                type:'4',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    table.reload('shopTable2', {
                                        url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
                                        where:field
                                    });
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'editCard',
                    title: ' 修改店铺银行卡信息'
                    , area: ['600px', '500px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/editCard', {
                            supplier_id:data.supplier_id
                        });
                    }
                });
            }else if(layEvent == 'password'){
                admin.popup({
                    id:'editCard',
                    title: '重置登录密码'
                    , area: ['600px', '400px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/editPass', {
                            supplier_id:data.supplier_id
                        });
                    }
                });
            }
        })
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~未通过审核~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#shopTable3',
                url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
                where: data,
                cols: cols=[
                    [{
                        field: 'supplier_id',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:90,
                    },{
                        field: 'supplier_name',
                        title: '店铺名称',
                        align: 'center',
                       
                    },{
                        field: 'supplier_scope_name',
                        title: '经营类目',
                        align: 'center',
                    
                    },  {
                        field: 'supplier_contacts',
                        title: '店主信息',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>姓名：${d.supplier_contacts}</div>
                                    <div>身份证号：${d.card_number}</div>`
                         return str
                     }
                        
                    }, {
                        field: 'frequent_name',
                        title: '常用联系人信息',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>姓名：${d.frequent_name==''?'暂无':d.frequent_name}</div>
                         <div>手机号：${d.frequent_phone==''?'暂无':d.frequent_phone}</div>`
                         return str
                     }
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
                        field: 'refuse_reason',
                        title: '拒绝原因',
                        align: 'center',
                        templet:function(d){
                            return base.decode(d.refuse_reason)
                        }
                    }, {
                        field: 'audit_time',
                        title: '审核时间',
                        align: 'center',
                        templet:function(d){
                            return d.audit_time==0?'暂无':layui.common.createTime(d.audit_time)
                        }
                    },  {
                     field: 'supplier_pay_period',
                     title: '商家结算时间',
                     align: 'center',
                     templet:function(d){
                         return d.supplier_pay_period+'天'
                        }
                 }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:130,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看商家信息</button>`
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
        
        table.on('tool(shopTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'look'){
                admin.popup({
                    id:'checkGoods',
                    title: '查看商家信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOnlineShop', {
                            supplier_id:data.supplier_id
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已下架商品~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#shopTable4',
                url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
                where: data,
                cols: cols=[
                    [{
                        field: 'supplier_id',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:90,
                    },{
                        field: 'supplier_name',
                        title: '店铺名称',
                        align: 'center',
                       
                    },{
                        field: 'supplier_scope_name',
                        title: '经营类目',
                        align: 'center',
                    
                    },  {
                        field: 'supplier_contacts',
                        title: '店主信息',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>姓名：${d.supplier_contacts}</div>
                                     <div>身份证号：${d.card_number}</div>`
                         return str
                     }
                        
                    }, {
                        field: 'frequent_name',
                        title: '常用联系人信息',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>姓名：${d.frequent_name==''?'暂无':d.frequent_name}</div>
                         <div>手机号：${d.frequent_phone==''?'暂无':d.frequent_phone}</div>`
                         return str
                     }
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
                    }, {
                        field: 'audit_time',
                        title: '审核时间',
                        align: 'center',
                        templet:function(d){
                            return d.audit_time==0?'暂无':layui.common.createTime(d.audit_time)
                        }
                    },  {
                     field: 'supplier_pay_period',
                     title: '商家结算时间',
                     align: 'center',
                     templet:function(d){
                         return d.supplier_pay_period+'天'
                        }
                 }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:180,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'up'>上架</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看商家信息</button>`
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
        table.on('tool(shopTable4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'look'){
                admin.popup({
                    id:'checkGoods',
                    title: '查看商家信息'
                    , area: ['900px', '700px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookOnlineShop', {
                            supplier_id:data.supplier_id
                        });
                    }
                });
            }else if(layEvent == 'up'){
                layer.confirm('确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=supplier/offSupplier',
                            data:{
                                supplier_id: data.supplier_id,
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    table.reload('shopTable4', {
                                        url: layui.setter.requestUrl + 'api.php?c=supplier/getSupplierList',
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
    exports('onLineShop', {});
})