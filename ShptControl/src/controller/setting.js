layui.define(function (exports) {
    layui.use('contlist', layui.factory('contlist')).use(['admin', 'common','public','form','element','upload'],function () {
        var $ = layui.$,
            admin = layui.admin,
            form = layui.form,
            element = layui.element,
            IsshowAnNiu = layui.common.IsshowAnNiu;
        var menuPermissions = IsshowAnNiu('addviews');  //菜单权限
        var type=1;
        var setData={};
        var share_image=''; //分享设置的默认图片
        var after_desc = new layui.public.Edit({
            el:'#after_desc',
        })
        form.render()
        //切换tabbar
        element.on('tab(tab)', function(data){
            var index = data.index
            if(index==0){
                type='1'
            }else if(index==1){
                type='3'
            }else if(index==2){
                type='5'
            }
            getSetting(type)
        });
        var base = new layui.public.Base64();
        //渲染页面
        function  getSetting(e){
            admin.req({
                url:layui.setter.requestUrl+'api.php?c=mall_set/getMallSet',
                async:false,
                data:{
                    type:type
                }
                ,success:function(res){
                    setData=res.data
                    if(type==1){
                        $('.order_button').empty()
                        // $('.msg_button').empty()
                        $('.reply_button').empty()
                        if(setData.order_button=='0'){
                            $('.order_button').append(`<input type="checkbox" name="order_button" lay-skin="switch" lay-text="ON|OFF">`)
                        }else{
                            $('.order_button').append(`<input type="checkbox" name="order_button" lay-skin="switch" lay-text="ON|OFF" checked="">`)
                        }
                        // if(setData.msg_button=='0'){
                        //     $('.msg_button').append(`<input type="checkbox" name="msg_button" lay-skin="switch" lay-text="ON|OFF">`)
                        // }else{
                        //     $('.msg_button').append(`<input type="checkbox" name="msg_button" lay-skin="switch" lay-text="ON|OFF" checked="">`)
                        // }
                        // if(setData.reply_button=='0'){
                        //     $('.reply_button').append(`<input type="checkbox" name="reply_button" lay-skin="switch" lay-text="ON|OFF">`)
                        // }else{
                        //     $('.reply_button').append(`<input type="checkbox" name="reply_button" lay-skin="switch" lay-text="ON|OFF" checked="">`)
                        // }
                        $('.order_day').val(setData.order_day)
                        $('.order_hour').val(setData.order_hour)
                        $('.cancel_day').val(setData.cancel_day)
                        $('.cancel_hour').val(setData.cancel_hour)
                        $('.day_consumption_gold').val(setData.day_consumption_gold)
                        $('.max_consumption_gold').val(setData.max_consumption_gold)
                        $('.min_consumption_gold').val(setData.min_consumption_gold)
                        $('.introduce').val(base.decode(setData.introduce))
                        form.render()
                    }
                    if(type==3){
                        $('.refund_button').empty()
                        $('.barter_button').empty()
                        if(setData.barter_button=='0'){
                            $('.barter_button').append(`<input type="checkbox" name="barter_button" lay-skin="switch" lay-text="ON|OFF">`)
                        }else{
                            $('.barter_button').append(`<input type="checkbox" name="barter_button" lay-skin="switch" lay-text="ON|OFF" checked="">`)
                        }
                        if(setData.refund_button=='0'){
                            $('.refund_button').append(`<input type="checkbox" name="refund_button" lay-skin="switch" lay-text="ON|OFF">`)
                        }else{
                            $('.refund_button').append(`<input type="checkbox" name="refund_button" lay-skin="switch" lay-text="ON|OFF" checked="">`)
                        }
                        console.log(after_desc.setContent);
                        after_desc.setContent(base.decode(setData.after_desc))
                        // $('#after_desc').html(base.decode(setData.after_desc))
                        form.render()
                    }if(type==5){
                        $('.overall_copy').val(setData.overall_copy)
                        form.render()
                    }
                }
            })
        }
        getSetting(type)
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~基础设置~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //监听基础设置提交
        form.on('submit(submit1)', function(data){
           if(data.field.order_day<0 || data.field.order_hour<0 || data.field.cancel_day<0 || data.field.cancel_hour<0 || data.field.order_day<0 || data.field.order_day<0 || data.field.order_day<0){
                layer.msg('值不能为负数')
                return false
           }
           if(data.field.order_day>365){
                layer.msg('自动收货天数不能大于365天')
                return false
            }  
            if(data.field.order_hour>24){
                layer.msg('自动收货小时数不能大于24小时')
                return false
            }   
            if(data.field.cancel_day>365){
                layer.msg('取消待付款订单天数不能大于365天')
                return false
            }  
            if(data.field.cancel_hour>24){
                layer.msg('取消待付款订单小时数不能大于24小时')
                return false
            }   
           if(data.field.order_button=='on'){
                data.field.order_button=1
           }else{
                data.field.order_button=0
           }
           if(data.field.msg_button=='on'){
                data.field.msg_button=1
            }else{
                data.field.msg_button=0
            }
            if(data.field.reply_button=='on'){
                data.field.reply_button=1
            }else{
                data.field.reply_button=0
            }
            data.field.set_id=setData.set_id
            admin.req({
                url:layui.setter.requestUrl+'api.php?c=mall_set/setMallButton',
                data:data.field
                ,success:function(res){
                    layer.msg(res.msg)
                }
            })
            return false;
        });
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~售后~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        //监听售后设置提交
        form.on('submit(submit3)', function(data){  
            if(data.field.refund_button=='on'){
                data.field.refund_button=1
            }else{
                data.field.refund_button=0
            }
            if(data.field.barter_button=='on'){
                data.field.barter_button=1
             }else{
                data.field.barter_button=0
             }
            data.field.after_desc=after_desc.getContent(0)
           data.field.set_id=setData.set_id
             admin.req({ 
                 url:layui.setter.requestUrl+'api.php?c=mall_set/setAfterButton',
                 data:data.field
                 ,success:function(res){
                    layer.msg(res.msg)
                    
                 }
             })
             return false;
             
         });
 

    });
    //对外暴露的接口
    exports('setting', {});
})