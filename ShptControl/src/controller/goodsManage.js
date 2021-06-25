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
        var base = new layui.public.Base64();
        var checkStatus1=[];
        var checkStatus2=[];
        var checkStatus3=[];


        var field1={
            type:'2',
            goods_sort2:'-1',
            goods_supplier:'',
            goods_tag:'',
            goods_name:''
        };//待审核商品
        var field2={
            type:'1',
            goods_sort2:'-1',
            goods_supplier:'',
            goods_tag:'',
            goods_name:''
        };//出售中商品
        var field3={
            type:'3',
            goods_sort2:'-1',
            goods_supplier:'',
            goods_name:''
        };//未通过
        var field4={
            type:'4',
            goods_sort2:'-1',
            goods_supplier:'',
            goods_name:''
        };//已下架
        //tab切换清空搜索框的值
        element.on('tab(tab)', function(data){
            var index = data.index
            $('.goods_sort1').empty()
            $('.goods_sort1').append(
               `<option value="">请选择一级分类</option>`
            )
            $('.goods_sort2').empty()
            $('.goods_sort2').append(
               `<option value="">请选择二级分类</option>`
            )
            if(index==0){
                render_table1(field1)
            }else if(index==1){
                render_table2(field2)
            }else if(index==2){
                render_table3(field3)
            }else if(index==3){
                render_table4(field4)
            }
        });
        //标签筛选
        admin.req({
            url:layui.setter.requestUrl+'api.php?c=goods_tag/getGoodsTag',
            success:function(res){
                if(res.code==0){
                    if(res.data.length!=0){
                        res.data.forEach(item => {
                            $('.search_tag').append(
                                `<option value="${item.tag_index}">${item.tag_name}</option>`
                            )
                        });
                        form.render()
                    }else{
                        $('.search_tag').append(
                            `<option value="" disabled>暂无标签</option>`
                        )
                        form.render()
                    }
                }
            }
        })
        form.render()
       
       admin.req({
           url:layui.setter.requestUrl+'api.php?c=config_classify/getClassifyInfo',
           success:function(res){
               if(res.code==0){
                   goods_sort=res.data
                   goods_sort.forEach(item=>{
                       $('.goods_sort1').append(
                           `<option value="${item.id}">${item.name}</option>`
                       )
                   })
                   form.render()
               }
           }
       })
       //监听选择1的
       form.on('select(select1)', function (data) {
           $('.goods_sort2').empty()
           $('.goods_sort2').append(
               `<option value="">请选择二级分类</option>`
           )
           goods_sort.forEach(item=>{
               if(data.value==item.id){
                   item.children.forEach(item=>{
                       $('.goods_sort2').append(
                           `<option value="${item.id}">${item.name}</option>`
                       )
                   })
               }
           })
           
           form.render()
       });
        // ~~~~~~~~~~~~~~~~待审核商品~~~~~~~~~~~~~~~~~~~~~~~
       //搜索
       form.on('submit(search1)', function (data) {
           if(data.field.goods_sort1!='' && data.field.goods_sort2==''){
               layer.msg('请选择二级分类')
           }else{
               if(data.field.goods_sort2==''){
                   field1.goods_sort2='-1'
               }else{
                   field1.goods_sort2=data.field.goods_sort2
               }
               field1.goods_supplier=data.field.goods_supplier
               field1.goods_name=data.field.goods_name
               render_table1(field1);
           }
       });
       //多选拿到选择的行的数据
       table.on('checkbox(goodsTable1)', function (d) {
           checkStatus1 = table.checkStatus('goodsTable1').data;
       });
       //批量审核
       $('#moreCheck').on('click', function () {
           if (checkStatus1.length==0) {
               layer.msg('请先选择行');
               return false
           }
           let goods_index=[]
           checkStatus1.forEach(item => {
               goods_index.push(item.goods_index)
           })
           let index=goods_index.join(',')
           checkStatus1=[]
           admin.popup({
                id:'checkGoods',
                title: '商品审核'
                , area: ['500px', '450px']
                , success: function () {
                    view(this.id).render('/template/goods/checkGoods', {
                        goods_index:index
                    });
                }
            });
       })
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#goodsTable1',
               url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
               where: data,
               cols: [
                   [{
                       type: 'checkbox',
                   },{
                       field: 'goods_index',
                       title: 'ID',
                       align: 'center',
                       sort: true,
                       width:90,
                   },{
                       field: 'goods_name',
                       title: '商品名称',
                       align: 'center',
                      
                   }, {
                       field: 'goods_icon',
                       title: '商品图',
                       align: 'center',
                       templet: function (d) {
                        return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                       }
                   }, {
                       field: 'sort1_name',
                       title: '商品分类',
                       align: 'center',
                       templet:function(d){
                           if(d.sort1_name!='' && d.sort2_name!=''){
                               return`<div>${d.sort1_name}/${d.sort2_name}</div>`
                           }else if(d.sort1_name!=''){
                               return`<div>${d.sort1_name}</div>`
                           }else if(d.sort2_name!=''){
                               return`<div>${d.sort2_name}</div>`
                           }else{
                               return`<div>暂无</div>`
                           }
                           
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
                       field: 'goods_add_time',
                       title: '创建时间',
                       align: 'center',
                       templet:function(d){
                           return layui.common.createTime(d.goods_add_time)
                       }
                       },
                    //    {
                    //     field: 'goods_copy_writer',
                    //     title: '自动复制内容',
                    //     align: 'center',
                    //     templet:function(d){
                    //         return d.goods_copy_writer?d.goods_copy_writer:'暂无'
                    //     }
                    // }, 
                   {
                       fixed: 'right',
                       width:200,
                       align: 'center',
                       title: '操作',
                       templet: function (d) {
                           return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'check'>审核</button>
                                <button type="button" class="layui-btn layui-btn-sm" lay-event = 'look'>查看详情</button>`
                       }
                   }]
               ],
               page: true,
               parseData: function(res){
                   $('.status1').html('待审核商品'+'&nbsp;'+res.data.wait_count)
                   $('.status2').html('出售中商品'+'&nbsp;'+res.data.success_count)
                   $('.status3').html('未通过审核商品'+'&nbsp;'+res.data.fail_count)
                   $('.status4').html('已下架商品'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
               //解决高度自适应固定的列高度不一致
               done: function(res, curr, count){
                   $(".layui-table-main  tr").each(function (index ,val) {
                       $($(".layui-table-fixed .layui-table-body tbody tr")[index]).height($(val).height());
                   });
               }
           });
       }
       //先自调用请求渲染数据
       render_table1(field1);

      
        table.on('tool(goodsTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            } else if (layEvent == 'check') {
                data.type = 1
                admin.popup({
                    id: 'checkGoods',
                    title: '商品审核'
                    , area: ['1000px', '700px']
                    , success: function () {
                        view(this.id).render('/template/goods/checkGoodsOne', {
                            data
                        });
                    }
                });
            } else if (layEvent == 'look') { 
                admin.popup({
                    id: 'checkGoods',
                    title: '商品详情'
                    , area: ['1000px', '700px']
                    , success: function () {
                        view(this.id).render('/template/goods/checkGoodsOne', {
                            data
                        });
                    }
                });
            }
        })
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~出售中商品~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //搜索
        form.on('submit(search2)', function (data) {
            if(data.field.goods_sort1!='' && data.field.goods_sort2==''){
                layer.msg('请选择二级分类')
            }else{
                if(data.field.goods_sort2==''){
                    field2.goods_sort2='-1'
                }else{
                    field2.goods_sort2=data.field.goods_sort2
                }
                field2.goods_supplier=data.field.goods_supplier
                field2.goods_name=data.field.goods_name
                render_table2(field2);
            }
        });
        //多选拿到选择的行的数据
        table.on('checkbox(goodsTable2)', function (d) {
            checkStatus2 = table.checkStatus('goodsTable2').data;
        });
        //批量审核
        $('#moreDown').on('click', function () {
            if (checkStatus2.length==0) {
                layer.msg('请先选择行');
                return false
            }
            let goods_index=[]
            checkStatus2.forEach(item => {
                goods_index.push(item.goods_index)
            })
            let index=goods_index.join(',')
            
            layer.confirm('确定都下架吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                admin.req({
                    url:layui.setter.requestUrl + 'api.php?c=supplier_goods/upDownMoreGoods',
                    data:{
                        goods_index_str: index,
                        type:'2',
                    },
                    success:function(res){
                        if(res.code==0){
                            layer.msg(res.msg)
                            checkStatus2=[]
                            table.reload('goodsTable2', {
                                url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                                where:field2
                            });
                        }
                    }
                })
            }, function(){
                
            });
        })
        //渲染表格数据
        var render_table2 = function (data) {
            table.render({
                elem: '#goodsTable2',
                url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                where: data,
                cols: cols=[
                    [{
                        type: 'checkbox',
                    },{
                        field: 'goods_index',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                    },{
                        field: 'goods_name',
                        title: '商品名称',
                        align: 'center',
                    
                    }, {
                        field: 'goods_icon',
                        title: '商品图',
                        align: 'center',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                    }, {
                        field: 'sort1_name',
                        title: '商品分类',
                        align: 'center',
                        templet:function(d){
                            if(d.sort1_name!='' && d.sort2_name!=''){
                                return`<div>${d.sort1_name}/${d.sort2_name}</div>`
                            }else if(d.sort1_name!=''){
                                return`<div>${d.sort1_name}</div>`
                            }else if(d.sort2_name!=''){
                                return`<div>${d.sort2_name}</div>`
                            }else{
                                return`<div>暂无</div>`
                            }
                            
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
                        field: 'goods_add_time',
                        title: '创建时间',
                        align: 'center',
                        templet:function(d){
                            return layui.common.createTime(d.goods_add_time)
                        }
                    }, {
                        field: 'goods_tag_name',
                        title: '标签',
                        align: 'center',
                        templet:function(d){
                            return`<div>${d.goods_tag_name?d.goods_tag_name:'暂无'}</div>`
                        }
                    // }, {
                    //     field: 'goods_copy_writer',
                    //     title: '自动复制内容',
                    //     align: 'center',
                    //     templet:function(d){
                    //         return d.goods_copy_writer?d.goods_copy_writer:'暂无'
                    //     }
                    }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:350,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'addLabel'>添加标签</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-event = 'editCount'>供应价格</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-event = 'addComment'>添加评价</button>
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'down'>下架</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核商品'+'&nbsp;'+res.data.wait_count)
                    $('.status2').html('出售中商品'+'&nbsp;'+res.data.success_count)
                    $('.status3').html('未通过审核商品'+'&nbsp;'+res.data.fail_count)
                    $('.status4').html('已下架商品'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
                // 解决高度自适应固定的列高度不一致
                done: function(res, curr, count){
                    $(".layui-table-main  tr").each(function (index ,val) {
                        $($(".layui-table-fixed .layui-table-body tbody tr")[index]).height($(val).height());
                    });
                }
            });
        }
    
        table.on('tool(goodsTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'addComment'){
                admin.popup({
                    id:'addComment',
                    title: '添加评价'
                    , area: ['500px', '600px']
                    , success: function () {
                        view(this.id).render('/template/goods/addComment', {
                            goods_index:data.goods_index
                        });
                    }
                });
            } else if (layEvent == 'editCount') {  //供应价格
                admin.popup({
                    id:'editCount',
                    title: '编辑供应价格'
                    , area: ['1100px', '700px']
                    , success: function () {
                        view(this.id).render('/template/goods/editCount', {
                            goods_index:data.goods_index
                        });
                    }
                });
            }else if(layEvent == 'addLabel'){
                //页面层
                layer.open({
                    type: 1,
                    title:'添加标签',
                    shadeClose:true,
                    area: ['420px', '400px'], //宽高
                    content: `
                        <div class="layui-form" style="margin-top:20px;">
                            <div class="layui-form-item">
                                <div class="layui-inline">
                                    <label class="layui-form-label">选择标签：</label>
                                    <div class="layui-input-inline">
                                        <select name="goods_tag" class="tags">
                                            <option value="">请选择</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item" style="margin-top:200px;text-align: center;">
                                <div class="layui-inline">
                                    <button class="layui-btn layui-btn-lg" lay-submit lay-filter="sure">
                                        确定
                                    </button>
                                </div>
                            </div>
                        </div>
                    `,
                    success:function(){
                        //判断是否显示标签
                        admin.req({
                            url:layui.setter.requestUrl+'api.php?c=goods_tag/getGoodsTag',
                            success:function(res){
                                if(res.code==0){
                                    if(res.data.length!=0){
                                        res.data.forEach(item => {
                                            $('.tags').append(
                                                `<option value="${item.tag_index}">${item.tag_name}</option>`
                                            )
                                        });
                                        form.render()
                                    }else{
                                        $('.tags').append(
                                            `<option value="" disabled>暂无标签</option>`
                                        )
                                        form.render()
                                    }
                                }
                            }
                        })
                        form.on('submit(sure)', function (obj) {
                            if(obj.field.goods_tags==''){
                                layer.closeAll()
                                return false;
                            }
                            admin.req({
                                url:layui.setter.requestUrl+'api.php?c=supplier_goods/addGoodsTag',
                                data:{
                                    goods_index:data.goods_index,
                                    goods_tags:obj.field.goods_tag
                                },
                                success:function(res){
                                    if(res.code==0){
                                        layer.msg(res.msg)
                                        layer.closeAll()
                                        table.reload('goodsTable2', {
                                            url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                                            where:field2
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
                            url:layui.setter.requestUrl + 'api.php?c=supplier_goods/upDownMoreGoods',
                            data:{
                                goods_index_str: data.goods_index,
                                type:'2',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    table.reload('goodsTable2', {
                                        url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                                        where:field2
                                    });
                                }
                            }
                        })
                }, function(){
                    
                });
            }
        })
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~未通过审核商品~~~~~~~~~~~~~~~~~~~~~~~~~
         //搜索
         form.on('submit(search3)', function (data) {
            if(data.field.goods_sort1!='' && data.field.goods_sort2==''){
                layer.msg('请选择二级分类')
            }else{
                if(data.field.goods_sort2==''){
                    field3.goods_sort2='-1'
                }else{
                    field3.goods_sort2=data.field.goods_sort2
                }
                field3.goods_supplier=data.field.goods_supplier
                field3.goods_name=data.field.goods_name
                render_table3(field3);
            }
        });
        //渲染表格数据
        var render_table3 = function (data) {
            table.render({
                elem: '#goodsTable3',
                url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                where: data,
                cols: cols=[
                    [{
                        field: 'goods_index',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:70,
                    },{
                        field: 'goods_name',
                        title: '商品名称',
                        align: 'center',
                    
                    }, {
                        field: 'goods_icon',
                        title: '商品图',
                        align: 'center',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                    }, {
                        field: 'sort1_name',
                        title: '商品分类',
                        align: 'center',
                        templet:function(d){
                            if(d.sort1_name!='' && d.sort2_name!=''){
                                return`<div>${d.sort1_name}/${d.sort2_name}</div>`
                            }else if(d.sort1_name!=''){
                                return`<div>${d.sort1_name}</div>`
                            }else if(d.sort2_name!=''){
                                return`<div>${d.sort2_name}</div>`
                            }else{
                                return`<div>暂无</div>`
                            }
                            
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
                        field: 'goods_add_time',
                        title: '创建时间',
                        align: 'center',
                        templet:function(d){
                            return layui.common.createTime(d.goods_add_time)
                        }
                    }, {
                        field: 'refuse_reason',
                        title: '拒绝原因',
                        align: 'center',
                        templet:function(d){
                            return`<div>${d.refuse_reason?base.decode(d.refuse_reason):'暂无'}</div>`
                        }
                    // }, {
                    //     field: 'goods_copy_writer',
                    //     title: '自动复制内容',
                    //     align: 'center',
                    //     templet:function(d){
                    //         return d.goods_copy_writer?d.goods_copy_writer:'暂无'
                    //     }
                    }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核商品'+'&nbsp;'+res.data.wait_count)
                    $('.status2').html('出售中商品'+'&nbsp;'+res.data.success_count)
                    $('.status3').html('未通过审核商品'+'&nbsp;'+res.data.fail_count)
                    $('.status4').html('已下架商品'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
            });
        }
     
        //~~~~~~~~~~~~~~~~~~~~~~~~~~已下架商品~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //搜索
        form.on('submit(search4)', function (data) {
            if(data.field.goods_sort1!='' && data.field.goods_sort2==''){
                layer.msg('请选择二级分类')
            }else{
                if(data.field.goods_sort2==''){
                    field4.goods_sort2='-1'
                }else{
                    field4.goods_sort2=data.field.goods_sort2
                }
                field4.goods_supplier=data.field.goods_supplier
                field4.goods_name=data.field.goods_name
                render_table4(field4);
            }
        });
        //多选拿到选择的行的数据
        table.on('checkbox(goodsTable4)', function (d) {
            checkStatus3 = table.checkStatus('goodsTable4').data;
        });
        //批量上架
        $('#moreUp').on('click', function () {
            if (checkStatus3.length==0) {
                layer.msg('请先选择行');
                return false
            }
            let goods_index=[]
            checkStatus3.forEach(item => {
                goods_index.push(item.goods_index)
            })
            let index=goods_index.join(',')
            layer.confirm('确定都上架吗？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                admin.req({
                    url:layui.setter.requestUrl + 'api.php?c=supplier_goods/upDownMoreGoods',
                    data:{
                        goods_index_str: index,
                        type:'1',
                    },
                    success:function(res){
                        if(res.code==0){
                            layer.msg(res.msg)
                            checkStatus3=[]
                            table.reload('goodsTable4', {
                                url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                                where:field4
                            });
                        }
                    }
                })
            }, function(){
                
            });
        })
        //渲染表格数据
        var render_table4 = function (data) {
            table.render({
                elem: '#goodsTable4',
                url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                where: data,
                cols: cols=[
                    [{
                        type: 'checkbox',
                    },{
                        field: 'goods_index',
                        title: 'ID',
                        align: 'center',
                        sort: true,
                        width:70,
                    },{
                        field: 'goods_name',
                        title: '商品名称',
                        align: 'center',
                    
                    }, {
                        field: 'goods_icon',
                        title: '商品图',
                        align: 'center',
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                        }
                    }, {
                        field: 'sort1_name',
                        title: '商品分类',
                        align: 'center',
                        templet:function(d){
                            if(d.sort1_name!='' && d.sort2_name!=''){
                                return`<div>${d.sort1_name}/${d.sort2_name}</div>`
                            }else if(d.sort1_name!=''){
                                return`<div>${d.sort1_name}</div>`
                            }else if(d.sort2_name!=''){
                                return`<div>${d.sort2_name}</div>`
                            }else{
                                return`<div>暂无</div>`
                            }
                            
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
                        field: 'goods_add_time',
                        title: '创建时间',
                        align: 'center',
                        templet:function(d){
                            return layui.common.createTime(d.goods_add_time)
                        }
                    }, {
                        field: 'goods_tag_name',
                        title: '标签',
                        align: 'center',
                        templet:function(d){
                            return`<div>${d.goods_tag_name?d.goods_tag_name:'暂无'}</div>`
                        }
                    // }, {
                    //     field: 'goods_copy_writer',
                    //     title: '自动复制内容',
                    //     align: 'center',
                    //     templet:function(d){
                    //         return d.goods_copy_writer?d.goods_copy_writer:'暂无'
                    //     }
                    }, 
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width: 140,
                        templet: function (d) {
                            return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'up'>上架</button>
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'del'>删除</button>`
                        }
                    }]
                ],
                page: true,
                parseData: function(res){
                    $('.status1').html('待审核商品'+'&nbsp;'+res.data.wait_count)
                    $('.status2').html('出售中商品'+'&nbsp;'+res.data.success_count)
                    $('.status3').html('未通过审核商品'+'&nbsp;'+res.data.fail_count)
                    $('.status4').html('已下架商品'+'&nbsp;'+res.data.down_count)
                    return {
                        "count": res.count, //解析接口状态
                        "code": res.code, //解析接口状态
                        "data": res.data.list //解析数据列表
                    };
                },
                // 解决高度自适应固定的列高度不一致
                done: function(res, curr, count){
                    $(".layui-table-main  tr").each(function (index ,val) {
                        $($(".layui-table-fixed .layui-table-body tbody tr")[index]).height($(val).height());
                    });
                }
            });
        }

        table.on('tool(goodsTable4)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.goods_icon.split(','));
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'supplier_goods/delGoods',
                    param: {
                        goods_index:data.goods_index,
                    },
                    success: function (res) {
                        table.reload('goodsTable4', {
                            url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                            where:field4
                        });
                    }
                });
            }else if(layEvent == 'up'){
                layer.confirm('确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=supplier_goods/upDownMoreGoods',
                            data:{
                                goods_index_str: data.goods_index,
                                type:'1',
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    table.reload('goodsTable4', {
                                        url: layui.setter.requestUrl + 'api.php?c=supplier_goods/getGoodsList',
                                        where:field4
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
    exports('goodsManage', {});
})