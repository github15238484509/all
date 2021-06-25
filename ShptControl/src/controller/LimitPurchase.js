layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'contlist', 'table', 'common','public','form','element'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            table = layui.table,
            element = layui.element,
            IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限
        var tool = layui.public.tool;
        var field={
            type:'4',
            supplier_name:'',
            goods_name:''
        };
        var checkStatus1=[];
        var checkStatus2=[];
        
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                field.type='4'
                render_table1(field)
                $('.down_more').css('display',"inline-block")
            }else if(index==1){
                field.type='1'
                render_table2(field)
                $('.down_more').css('display',"inline-block")
            }else if(index==2){
                field.type='2'
                render_table3(field)
                $('.down_more').css('display',"none")
            }else if(index==3){
                field.type='3'
                render_table4(field)
                $('.down_more').css('display',"none")
            }
            checkStatus1=[]
            checkStatus2=[]
        });
        
        form.render()

        //多选拿到选择的行的数据
        table.on('checkbox(limitTable1)', function (d) {
            checkStatus1 = table.checkStatus('limitTable1').data;
        });
        table.on('checkbox(limitTable2)', function (d) {
            checkStatus2 = table.checkStatus('limitTable2').data;
        });
        //批量
        $('.down_more').on('click', function () {
            if(field.type=='4'){
                if (checkStatus1.length==0) {
                    layer.msg('请先选择行');
                    return false
                }
                let goods_index=[]
                checkStatus1.forEach(item => {
                    goods_index.push(item.limit_index)
                })
                layer.confirm('确定下架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=mall_goods_limit/upDownMoreGoods',
                            data:{
                                limit_index_str:goods_index.join(','),
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    checkStatus1=[]
                                    parent.layui.table.reload("limitTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }
            if(field.type=='1'){
                if (checkStatus2.length==0) {
                    layer.msg('请先选择行');
                    return false
                }
                let goods_index=[]
                checkStatus2.forEach(item => {
                    goods_index.push(item.limit_index)
                })
                layer.confirm('确定下架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=mall_goods_limit/upDownMoreGoods',
                            data:{
                                limit_index_str:goods_index.join(','),
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    checkStatus2=[]
                                    parent.layui.table.reload("limitTable2");
                                }
                            }
                        })
                }, function(){
                    
                });
            }
            
        })
        
      //搜索
        form.on('submit(search)', function (data) {
                field.supplier_name=data.field.supplier_name
                field.goods_name=data.field.goods_name
                if(field.type=='4'){
                    render_table1(field)
                }else if(field.type=='1'){
                    render_table2(field)
                }else if(field.type=='2'){
                    render_table3(field)
                }else if(field.type=='3'){
                    render_table4(field)
                }
        });
        //添加限量抢购商品
        $('.addGoods').click(function(){
            admin.popup({
                id:'addLimitGoods',
                title: '添加限量抢购商品'
                , area: ['1000px', '600px']
                , success: function () {
                    view(this.id).render('/template/marketing/addLimitGoods', {});
                }
            });
        })
        var cols=[
            [{
                type: 'checkbox',
            },{
                field: 'limit_index',
                title: 'ID',
                align: 'center',
                sort: true,
                width:60,
            },{
                field: 'goods_name',
                title: '商品名称',
                align: 'center',
               
            }, {
                 field: 'goods_icon',
                 title: '商品图',
                 align: 'center',
                 templet: function (d) {
                    var str = `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                    return str
                }
             
             }, {
                field: 'sort2_name',
                title: '商品分类',
                align: 'center',
                templet:function(d){
                 var str = `<div>${d.sort1_name}/${d.sort2_name}</div>`
                 return str
             }
                
            }, {
                field: 'supplier_name',
                title: '商户名称',
                align: 'center',
                templet: function (d) {
                    return d.supplier_name?d.supplier_name:'暂无'
                }
            }, {
                field: 'goods_price',
                title: '商品价格',
                align: 'center',
                templet:function(d){
                    var str = `<div>市场价：${d.goods_price/100}</div>
                                <div>售价：${d.goods_cost/100}</div>
                                <div>成本价：${d.retail_price/100}</div>`
                    return str
                }
            }, {
                field: 'goods_sale',
                title: '销量/库存',
                align: 'center',
                templet:function(d){
                    return`<div>${d.goods_sale}/${d.goods_sku_count}</div>`
                }
            }, {
                field: 'limit_num',
                title: '参与活动数量',
                align: 'center',
            },  {
                 field: 'left_num',
                 title: '活动剩余数量',
                 align: 'center',
             },  {
                 field: 'limit_sort',
                 title: '排序',
                 align: 'center',
                 width:125,
                 templet: function (d) {
                    var div = `<div>
                                <input style="text-align:center;width:50px" min="0" class="save" type="number" value='${d.limit_sort}'>
                                <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                               </div>`
                    return [div]
                }
             }, {
                 field: 'start_time',
                 title: '活动时间',
                 align: 'center',
                 templet:function(d){
                      return d.start_time==0?'暂无':layui.common.createTime(d.start_time)
                  }
             }, 
            {
                fixed: 'right',
                align: 'center',
                title: '操作',
                templet: function (d) {
                    if(field.type==1){
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'down'>下架</button>`
                    }else if(field.type==2){
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>再次开始</button>`
                    }else if(field.type==3){
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>再次开始</button>`
                    }else{
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'down'>下架</button>`
                    }
                   
                }
            }]
        ]
        // ~~~~~~~~~~~~~~~~即将开始~~~~~~~~~~~~~~~~~~~~~~~
       
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#limitTable1',
               url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/getGoodsLimitList',
               where: data,
               cols: cols,
               page: true,
           });
       }
       //先自调用请求渲染数据
       render_table1(field);
      
        table.on('tool(limitTable1)', function (obj) { 
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'down'){
                layer.confirm('确定下架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=mall_goods_limit/upDownMoreGoods',
                            data:{
                                limit_index_str:data.limit_index,
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("limitTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/editSort',
                    data:{
                        limit_index:data.limit_index,
                        limit_sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("limitTable1");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~进行中~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#limitTable2',
                url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/getGoodsLimitList',
                where: data,
                cols: cols,
                page: true
            });
        }
    
        table.on('tool(limitTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'down'){
                layer.confirm('确定下架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=mall_goods_limit/upDownMoreGoods',
                            data:{
                                limit_index_str:data.limit_index,
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("limitTable2");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/editSort',
                    data:{
                        limit_index:data.limit_index,
                        limit_sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("limitTable2");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~已抢完~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#limitTable3',
                url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/getGoodsLimitList',
                where: data,
                cols: cols,
                page: true,
            });
        }
        
        table.on('tool(limitTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'up'){
                admin.popup({
                    id:'add',
                    title: '添加'
                    , area: ['600px', '400px']
                    , success: function (res,index) {
                        view(this.id).render('/template/marketing/addModel', {
                            obj
                        });
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/editSort',
                    data:{
                        limit_index:data.limit_index,
                        limit_sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("limitTable3");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已下架~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#limitTable4',
                url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/getGoodsLimitList',
                where: data,
                cols: [
                    [{
                        field: 'limit_index',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:60,
                    },{
                        field: 'goods_name',
                        title: '商品名称',
                        align: 'center',
                       
                    }, {
                         field: 'goods_icon',
                         title: '商品图',
                         align: 'center',
                         templet: function (d) {
                            var str = `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                            return str
                        }
                     
                     }, {
                        field: 'sort2_name',
                        title: '商品分类',
                        align: 'center',
                        templet:function(d){
                         var str = `<div>${d.sort1_name}/${d.sort2_name}</div>`
                         return str
                     }
                        
                    }, {
                        field: 'supplier_name',
                        title: '商户名称',
                        align: 'center',
                        templet: function (d) {
                            return d.supplier_name?d.supplier_name:'暂无'
                        }
                    }, {
                        field: 'goods_price',
                        title: '商品价格',
                        align: 'center',
                        templet:function(d){
                            var str = `<div>市场价：${d.goods_price/100}</div>
                                        <div>售价：${d.goods_cost/100}</div>
                                        <div>成本价：${d.retail_price/100}</div>`
                            return str
                        }
                    }, {
                        field: 'goods_sale',
                        title: '销量/库存',
                        align: 'center',
                        templet:function(d){
                            return`<div>${d.goods_sale}/${d.goods_sku_count}</div>`
                        }
                    }, {
                        field: 'limit_num',
                        title: '参与活动数量',
                        align: 'center',
                    },  {
                         field: 'left_num',
                         title: '活动剩余数量',
                         align: 'center',
                     },  {
                         field: 'limit_sort',
                         title: '排序',
                         align: 'center',
                         width:125,
                         templet: function (d) {
                            var div = `<div>
                                        <input style="text-align:center;width:50px" class="save" type="number" value='${d.limit_sort}'>
                                        <a class="layui-btn layui-btn-sm layui-btn-danger"  lay-event="saveSort">保存</a>
                                       </div>`
                            return [div]
                        }
                     }, {
                         field: 'start_time',
                         title: '活动时间',
                         align: 'center',
                         templet:function(d){
                              return d.start_time==0?'暂无':layui.common.createTime(d.start_time)
                          }
                     }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            if(field.type==1){
                                return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'down'>下架</button>`
                            }else if(field.type==2){
                                return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>再次开始</button>`
                            }else if(field.type==3){
                                return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>再次开始</button>`
                            }else{
                                return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'down'>下架</button>`
                            }
                           
                        }
                    }]
                ],
                page: true,
            });
        }
        table.on('tool(limitTable4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'up'){
                console.log(obj)
                admin.popup({
                    id:'add',
                    title: '添加'
                    , area: ['600px', '400px']
                    , success: function (res,index) {
                        view(this.id).render('/template/marketing/addModel', {
                            data,
                            index
                        });
                    }
                });
            }else if(layEvent=='saveSort'){
                admin.req({
                    url: layui.setter.requestUrl + 'api.php?c=mall_goods_limit/editSort',
                    data:{
                        limit_index:data.limit_index,
                        limit_sort:$(this).siblings('.save').val()
                    },
                    success: function (res) {
                        if (res.code == 0) {
                            layer.msg(res.msg);
                            parent.layui.table.reload("limitTable4");
                        } else {
                            layer.msg(res.msg);
                        }
                    }
                })
            }
        })


    });
    //对外暴露的接口
    exports('LimitPurchase', {});
})