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
            start_time:'',
            end_time:'',
        };
        form.render()
          //日期格式化
          laydate.render({
            elem: '#test',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
                
            }
        });
        //搜索
        form.on('submit(search)', function (data) {
            if (data.field.time != '') {
                data.field.start_time = data.field.time.split('-')[0].trim()
                var date = new Date(data.field.start_time);
                data.field.start_time = date.getTime()/1000
                data.field.end_time = data.field.time.split('-')[1].trim()
                var date = new Date(data.field.end_time);
                data.field.end_time = date.getTime()/1000
            } else {
                data.field.start_time = ''
                data.field.end_time = ''
            }
            delete  data.field.time
            render_table(data.field);
        });
       
        //渲染表格数据
        var render_table = function (data) {
            table.render({
                elem: '#regionalTable',
                url: layui.setter.requestUrl + 'api.php?c=mall_facilitator/facilitator_list',
                type: 'post',
                where: data,
                cols: cols=[
                    [{
                        field: 'id',
                        title: '序号',
                        align: 'center',
                       
                    }, {
                     field: 'name',
                     title: '姓名',
                     align: 'center',
                    
                 },{
                        field: 'phone',
                        title: '联系电话',
                        align: 'center',
                        
                    }, {
                        field: 'address_lianxi',
                        title: '联系地址',
                        align: 'center',
                        templet:function(d){
                            return d.address_lianxi+d.contact_address
                        }
                        
                    }, {
                        field: 'address_quyu',
                        title: '所属区域',
                        align: 'center',
                    }, {
                        field: 'img',
                        title: '相关资料',
                        align: 'center',
                        templet:function(d){
                            if(d.img==''){
                                return '暂无'
                            }else{
                                return `<button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                            }
                        }
                        
                    }, {
                        field: 'note',
                        title: '状态',
                        align: 'center',
                        templet:function(d){
                            return d.status==1?'禁用':'启用'
                        }
                        
                    }, {
                        field: 'create_time',
                        title: '添加时间',
                        align: 'center',
                        templet:function(d){
                         return d.create_time==0?'暂无':layui.common.createTime(d.create_time)
                        }
                    },
                    {
                        fixed: 'right',
                        align: 'center',
                        title: '操作',
                        width:210,
                        templet: function (d) {
                            return `
                            <div style="margin-top:5px;"><button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-event = 'edit'>编辑</button>
                            <button type="button" class="layui-btn layui-btn-sm" lay-event = 'del'>${d.status=='1'?'启用':d.status=='2'?'禁用':'删除'}</button>`
                        }
                    }]
                ],
                page: true,
            });
        }
        //自调渲染表格
        render_table(field);

        table.on('tool(regionalTable)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.img.split(','));
            }else if(layEvent == 'del'){
                let status=''
                let title=''
                if(data.status==1){
                    status='2'
                    title="确定启用吗"
                }else if(data.status==2){
                    status='1'
                    title="确定禁用吗"
                }else{
                    status='3'
                    title="确定删除吗"
                }
                layer.confirm(title, {
                    btn: ['确定','取消'] //按钮
                  }, function(){
                    admin.req({
                        url:layui.setter.requestUrl+'api.php?c=mall_facilitator/facilitator_edit',
                        type:'post',
                        data:{
                            id:data.id,
                            status:status
                        },success:function(res){
                            if(res.code==0){
                                layer.msg(res.msg)
                                parent.layui.table.reload("regionalTable");
                            }
                        }
                    })
                  }, function(){
                  });
                
            }else if(layEvent == 'edit'){
                admin.popup({
                    id:'addService',
                    title: ' 编辑服务商'
                    , area: ['800px', '600px']
                    , success: function () {
                        view(this.id).render('/template/operateManage/addService', {
                            id:data.id
                        });
                    }
                });
            }
        })
        $('.add').click(function(){
            admin.popup({
                id:'addService',
                title: ' 添加服务商'
                , area: ['800px', '600px']
                , success: function () {
                    view(this.id).render('/template/operateManage/addService', {});
                }
            });
        })

    });
    //对外暴露的接口
    exports('regionalService', {});
})