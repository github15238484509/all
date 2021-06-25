layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'laydate','contlist', 'table', 'common','public','form','element'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            laydate = layui.laydate,
            table = layui.table,
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
                render_table2(field)
            }else{
                render_table3(field)
            }
        });
      
        // ~~~~~~~~~~~~~~~~待审核~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#qualifications1',
               url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantListV2',
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
                       templet: function (d) {
                            return d.merchant_tel==0?'暂无':d.merchant_tel
                        }
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
                       field: 'auth_time',
                       title: '审核时间',
                       align: 'center',
                       templet:function(d){
                        return d.auth_time==0?'暂无':layui.common.createTime(d.auth_time)
                       }
                   }, 
                   {
                       fixed: 'right',
                       align: 'center',
                       title: '操作',
                       width:  210,
                       templet: function (d) {
                           return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'check'>审核资质</button>
                           <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看店铺资质</button>`
                       }
                   }]
               ],
               page: true,
               parseData: function(res){
                $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                $('.status2').html('审核通过'+'&nbsp;'+res.data.success_count)
                $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
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
      
        table.on('tool(qualifications1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'look') {
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
                
            }else if(layEvent == 'check'){
                admin.popup({
                    id:'check',
                    title: '审核资质'
                    , area: ['900px', '600px']
                    , success: function () {
                        view(this.id).render('/template/shopManage/lookQualifications', {
                            merchant_id:data.merchant_id,
                            url:'api.php?c=merchant/changeMerchantV2',
                            table:'qualifications1',
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
                elem: '#qualifications2',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantListV2',
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
                        templet: function (d) {
                            return d.merchant_tel==0?'暂无':d.merchant_tel
                        }
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
                        field: 'auth_time',
                        title: '审核时间',
                        align: 'center',
                        templet:function(d){
                         return d.auth_time==0?'暂无':layui.common.createTime(d.auth_time)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event = 'look1'>查看店铺资质</button></div>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                $('.status2').html('审核通过'+'&nbsp;'+res.data.success_count)
                $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
    
        table.on('tool(qualifications2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'look1'){
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
        });
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~未通过审核~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#qualifications3',
                url: layui.setter.requestUrl + 'api.php?c=merchant/getMerchantListV2',
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
                        templet: function (d) {
                            return d.merchant_tel==0?'暂无':d.merchant_tel
                        }
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
                    field: 'auth_time',
                    title: '审核时间',
                    align: 'center',
                    templet:function(d){
                        return d.auth_time==0?'暂无':layui.common.createTime(d.auth_time)
                       }
                },  {
                    field: 'refuse_auth_reason',
                    title: '拒绝原因',
                    align: 'center',
                    templet:function(d){
                        return d.refuse_auth_reason==''?'暂无':base.decode(d.refuse_auth_reason)
                    }
                }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'look1'>查看店铺资质</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核'+'&nbsp;'+res.data.wait_count)
                $('.status2').html('审核通过'+'&nbsp;'+res.data.success_count)
                $('.status3').html('未通过审核'+'&nbsp;'+res.data.fail_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
        
        table.on('tool(qualifications3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if(layEvent == 'look1'){
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
    });
    //对外暴露的接口
    exports('qualifications', {});
})