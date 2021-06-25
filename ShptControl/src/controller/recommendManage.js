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
        var field={
            name:'',
            phone:'',
            start:'',
            end:'',
        };
        form.render()
          //日期格式化
          laydate.render({
            elem: '#testTime',
            type: 'datetime',
            range: true,
            trigger: 'click',
            format: 'yyyy/M/d',
            change: function (value, date, endDate) {

            },
              done: function (value, date, endDate) {
                // if (data.field.time != '') {
                //     field.start_time = data.field.time.split('-')[0].trim()
                //     var date = new Date(field.start_time);
                //     field.start_time = date.getTime()/1000
                //     field.end_time = data.field.time.split('-')[1].trim()
                //     var date = new Date(field.end_time);
                //     field.end_time = date.getTime()/1000
                // } else {
                //     field.start_time = ''
                //     field.end_time = ''
                // }
                if (!value) {
                    $("input[name=testInput]").val("");
                    field.start = '';
                    field.end = '';
                } else {
                    field.start = new Date(value.split('-')[0]).getTime() / 1000;
                    field.end = new Date(value.split('-')[1]).getTime() / 1000;
                }
            }
        });
          laydate.render({
            elem: '#test',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
                
            }
        });
        //搜索
        form.on('submit(search6)', function (data) {
            if(data.field.type=='2'){
                field.phone=data.field.content
            }else{
                field.name=data.field.content
            }
          
            render_table(field);
           
        });
       
        //渲染表格数据
        var render_table = function (data) {
            table.render({
                elem: '#recommendTable',
                url: layui.setter.requestUrl + 'api.php?c=user_recommend/recommend_list',
                method:'post',
                where: data,
                cols: cols=[
                    [{
                        field: 'user_id',
                        title: 'ID',
                        align: 'center',
                       sort:true
                    }, {
                     field: 'name',
                     title: '昵称',
                     align: 'center',
                    
                 },{
                        field: 'phone',
                        title: '手机号',
                        align: 'center',
                        
                    }, {
                        field: 'cash',
                        title: '余额/累计营收（元) ',
                        align: 'center',
                        templet:function(d){
                            return d.cash/100+'/'+d.sum_amount/100
                        }
                        
                    }, {
                        field: 'sum_zhitui',
                        title: '直推VIP数量',
                        align: 'center',
                        
                    },{
                        field: 'user_vip_1',
                        title: '体系内VIP数量',
                        align: 'center',
                        
                    },{
                        field: 'user_vip_2',
                        title: '体系内推荐官数量',
                        align: 'center',
                        
                    }, {
                        field: 'switch_recommend',
                        title: '状态',
                        align: 'center',
                        templet:function(d){
                            return d.switch_recommend==2?'禁用':'启用'
                        }
                        
                    }, {
                        field: 'recommend_time',
                        title: '升级时间',
                        align: 'center',
                        templet:function(d){
                         return d.recommend_time==0?'暂无':layui.common.createTime(d.recommend_time)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:210,
                        templet: function (d) {
                            return `
                            <div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event = 'look'>查看推荐商品</button>
                            <button type="button" class="layui-btn layui-btn-xs" lay-event = 'del'>${d.switch_recommend==1?'禁用':'启用'}</button>`
                        }
                    }]
                ],
                page: true,
            });
        }
        //自调渲染表格
        render_table(field);

        table.on('tool(recommendTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.img.split(','));
            }else if(layEvent == 'look'){
                admin.popup({
                    id:'recommendGoods',
                    title: ' 推荐商品'
                    , area: ['900px', '600px']
                    , success: function () {
                        view(this.id).render('/template/operateManage/recommendGoods', {
                            comment_consumer:data.user_id
                        });
                    }
                });
            }else if(layEvent == 'del'){
                let status=''
                let title=''
                if(data.switch_recommend==1){
                    status='2'
                    title="确定禁用吗"
                }else{
                    status='1'
                    title="确定启用吗"
                }
                layer.confirm(title, {
                    btn: ['确定','取消'] //按钮
                  }, function(){
                    admin.req({
                        url:layui.setter.requestUrl+'api.php?c=user_recommend/recommend_switch',
                        type:'post',
                        data:{
                            user_id:data.user_id,
                            switch:status
                        },success:function(res){
                            if(res.code==0){
                                layer.msg(res.msg)
                                parent.layui.table.reload("recommendTable");
                            }
                        }
                    })
                  }, function(){
                  });
            }
        })

    });
    //对外暴露的接口
    exports('recommendManage', {});
})