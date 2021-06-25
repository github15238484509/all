layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'laydate', 'table', 'common','public','form','element'],
    function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            view = layui.view,
            table = layui.table,
            element = layui.element,
            laydate=layui.laydate;
        var tool = layui.public.tool;
     

        var field={
            title:'',
            classif_id:'',
            is_hot:'',
            time_start:'',
            time_end:'',
            status:''
        };
        //日期格式化
        laydate.render({
            elem: '#time',
            range: true,
            format: 'yyyy/MM/dd',
            done: function (value, date, endDate) {
            }
        });
        //显示分类
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=course/CourseClassifList',
            success: function (res) {
                if(res.code == 0){
                    var data = res.data
                    $('.classif_id').empty()
                    $('.classif_id').append(`
                        <option value="" selected>请选择</option>
                    `)
                    data.forEach(items=>{
                        $('.classif_id').append(`
                            <option value="${items.classif_index}">${items.name}</option>
                        `)
                    })
                    layui.form.render("select");
                }
            }
        })
         
        $('.add_jump_link').click(function(){
            var title=''
            var jump_name=''
            var jump_id = $(this).attr('id')
            if(jump_id=='1'){
                title='添加视频课程'
                jump_name='视频'
            }else if(jump_id=='2'){
                title='添加图文课程'
                jump_name='图文'
            }
            admin.popup({
                id:'addCourse',
                title: title
                , area: ['800px', '600px']
                , success: function () {
                    view(this.id).render('/template/learnCenter/addCourse', {
                        jump_id:jump_id,
                        jump_name:jump_name,
                        table:field.status
                    });
                }
            });
        })
        //切换tabbar
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                field.status=''
                render_table1(field)
            }else if(index==1){
                field.status='1'
                render_table2(field)
            }else if(index==2){
                field.status='2'
                render_table3(field)
            }
        });
         //搜索
         form.on('submit(search1)', function (data) {
            if (data.field.time != '') {
                data.field.time_start = data.field.time.split('-')[0].trim()
                var date = new Date(data.field.time_start);
                data.field.time_start = date.getTime()/1000
                data.field.time_end = data.field.time.split('-')[1].trim()
                var date = new Date(data.field.time_end);
                data.field.time_end = date.getTime()/1000
            } else {
                data.field.time_start = ''
                data.field.time_end = ''
            }
            delete data.field.time
            if(data.field.status==''){
                render_table1(data.field)
            }else if(data.field.status=='1'){
                render_table2(data.field)
            }else{
                render_table3(data.field)
            }
        });
        form.render()
        var cols=[
            [{
                field: 'course_index',
                title: '课程ID',
                align: 'center',
            }, {
                field: 'type',
                title: '课程类型',
                align: 'center',
                templet:function(d){
                    return d.type=='1'?'视频':'图文'
                }
            }, {
                field: 'name',
                title: '课程名称',
                align: 'center',
            },  {
                field: 'cover',
                title: '课程封面',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'enlarge'>查看</button>`
                }
            },{
                field: 'content',
                title: '课程详情',
                align: 'center',
                templet:function(d){
                    return `<button type="button" class="layui-btn layui-btn-sm" lay-event = 'lookDetail'>查看</button>`
                }
            }, {
                field: 'class_name',
                title: '课程分类',
                align: 'center'
            }, {
                field: 'status	',
                title: '状态',
                align: 'center',
                templet:function(d){
                    return d.status	=='1'?'上架':'下架'
                }
            }, {
                field: 'look',
                title: '浏览量',
                align: 'center',
            }, {
                field: 'is_hot',
                title: '是否推荐为热门',
                align: 'center',
                templet:function(d){
                    return d.is_hot	=='1'?'是':'否'
                }
            }, {
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
                width:180,
                templet: function (d) {
                    return `<div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-sm" lay-event = 'edit'>编辑</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-event = 'del'>删除</button></div>
                    <div style="margin-top:5px"><button type="button" class="layui-btn layui-btn-warn layui-btn-sm" lay-event = 'up'>${d.status=='1'?'下架':'上架'}</button>
                    <button type="button" class="layui-btn layui-btn-sm" lay-event = 'set'>${d.is_hot=='1'?'取消热门推荐':'设为热门推荐'}</button></div>`
                }
            }]
        ]
        // ~~~~~~~~~~~~~~~~全部~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table1 = function (data) {
           table.render({
               elem: '#courseTable1',
               url: layui.setter.requestUrl + 'api.php?c=course/CourseList',
               method:'post',
               where: data,
               cols: cols,
               page: true,
           });
       }
       //先自调用请求渲染数据
       render_table1(field);
      
        table.on('tool(courseTable1)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.cover.split(',')); 
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'course/CourseDel',
                    param: {
                        course_index:data.course_index
                    },
                    success: function (res) {
                        table.reload('courseTable1', {
                            url: layui.setter.requestUrl + 'api.php?c=course/CourseList',
                            where:field
                        });
                    }
                });
            }else if(layEvent=='up'){
                layer.confirm(data.status=='1'?'确定下架吗？':'确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=course/CourseStatus',
                            data:{
                                course_index:data.course_index,
                                status:data.status=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("courseTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='set'){
                layer.confirm(data.is_hot=='1'?'确定取消热门推荐吗？':'确定设为热门推荐吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=course/CourseIsHot',
                            data:{
                                course_index:data.course_index,
                                is_hot:data.is_hot=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("courseTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent == 'edit'){
                let jump_name=''
                if(data.type=='1'){
                    title='编辑视频课程'
                    jump_name='视频'
                }else if(data.type=='2'){
                    title='编辑图文课程'
                    jump_name='图文'
                }
                data.jump_name=jump_name
                data.table=field.status
                admin.popup({
                    id:'addCourse',
                    title: title
                    , area: ['800px', '600px']
                    , success: function () {
                        view(this.id).render('/template/learnCenter/addCourse', data);
                    }
                });
            }
            else if(layEvent == 'lookDetail'){
                if(data.type=='1'){
                    var src = layui.setter.CDN+data.video_url
                    layer.open({
                        type: 1,
                        title: '课程详情',
                        area: ['600px', '528px'],
                        shadeClose: true, //点击遮罩关闭
                        content: `<video src = ${src} style="width:600px;height:500px" controls="controls"></video>`
                    });
                } else {
                    layer.open({
                        type: 1,
                        title: '课程详情',
                        area: ['600px', '528px'],
                        shadeClose: true, //点击遮罩关闭
                        content: `<code class="getContent">${new layui.public.Base64().decode(data.content)}</code>`
                    });
                }
                
            }
        })
         // ~~~~~~~~~~~~~~~~上架~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table2 = function (data) {
            table.render({
                elem: '#courseTable2',
                url: layui.setter.requestUrl + 'api.php?c=course/CourseList',
                method:'post',
                where: data,
                cols: cols,
                page: true,
            });
        }

        table.on('tool(courseTable2)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.cover.split(',')); 
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'course/CourseDel',
                    param: {
                        course_index:data.course_index
                    },
                    success: function (res) {
                        table.reload('courseTable1', {
                            url: layui.setter.requestUrl + 'api.php?c=course/CourseList',
                            where:field
                        });
                    }
                });
            }else if(layEvent=='up'){
                layer.confirm(data.status=='1'?'确定下架吗？':'确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=course/CourseStatus',
                            data:{
                                course_index:data.course_index,
                                status:data.status=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("courseTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='set'){
                layer.confirm(data.is_hot=='1'?'确定取消热门推荐吗？':'确定设为热门推荐吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=course/CourseIsHot',
                            data:{
                                course_index:data.course_index,
                                is_hot:data.is_hot=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("courseTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent == 'edit'){
                let jump_name=''
                if(data.type=='1'){
                    title='编辑视频课程'
                    jump_name='视频'
                }else if(data.type=='2'){
                    title='编辑图文课程'
                    jump_name='图文'
                }
                data.jump_name=jump_name
                data.table=field.status
                admin.popup({
                    id:'addCourse',
                    title: title
                    , area: ['800px', '600px']
                    , success: function () {
                        view(this.id).render('/template/learnCenter/addCourse', data);
                    }
                });
            }
        })
         // ~~~~~~~~~~~~~~~~全部~~~~~~~~~~~~~~~~~~~~~~~
       //渲染表格数据
       var render_table3 = function (data) {
            table.render({
                elem: '#courseTable3',
                url: layui.setter.requestUrl + 'api.php?c=course/CourseList',
                method:'post',
                where: data,
                cols: cols,
                page: true,
            });
        }
        table.on('tool(courseTable3)', function (obj) { //注：tool table 是 table  lay-filter="对应的值"
            var data = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == 'enlarge') {
                tool.lookBigImg(data.cover.split(',')); 
            }else if(layEvent == 'del'){
                tool.delTableLine({
                    url: 'course/CourseDel',
                    param: {
                        course_index:data.course_index
                    },
                    success: function (res) {
                        table.reload('courseTable1', {
                            url: layui.setter.requestUrl + 'api.php?c=course/CourseList',
                            where:field
                        });
                    }
                });
            }else if(layEvent=='up'){
                layer.confirm(data.status=='1'?'确定下架吗？':'确定上架吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=course/CourseStatus',
                            data:{
                                course_index:data.course_index,
                                status:data.status=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("courseTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent=='set'){
                layer.confirm(data.is_hot=='1'?'确定取消热门推荐吗？':'确定设为热门推荐吗？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                        admin.req({
                            url:layui.setter.requestUrl + 'api.php?c=course/CourseIsHot',
                            data:{
                                course_index:data.course_index,
                                is_hot:data.is_hot=='1'?'2':'1'
                            },
                            success:function(res){
                                if(res.code==0){
                                    layer.msg(res.msg)
                                    parent.layui.table.reload("courseTable1");
                                }
                            }
                        })
                }, function(){
                    
                });
            }else if(layEvent == 'edit'){
                let jump_name=''
                if(data.type=='1'){
                    title='编辑视频课程'
                    jump_name='视频'
                }else if(data.type=='2'){
                    title='编辑图文课程'
                    jump_name='图文'
                }
                data.jump_name=jump_name
                data.table=field.status
                admin.popup({
                    id:'addCourse',
                    title: title
                    , area: ['800px', '600px']
                    , success: function () {
                        view(this.id).render('/template/learnCenter/addCourse', data);
                    }
                });
            }
        })
        
    });
    //对外暴露的接口
    exports('courseManage', {});
})