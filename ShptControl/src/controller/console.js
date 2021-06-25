/**

 @Name：layuiAdmin 主页控制台
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */


layui.define(function (exports) {

  /*
    下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
  */


  //区块轮播切换
  layui.use(['admin', 'carousel'], function () {
    var $ = layui.$
      , admin = layui.admin
      , carousel = layui.carousel
      , element = layui.element
      , device = layui.device();
    let arrList = [
            {
              supplier_daishenhe_num: '',//审核线上店铺
              name: '待审核线上店铺',
              url: ''
            },
            {
              merchant_daishenhe_num: '',//待审核线下店铺
              name: '待审核线下店铺',
              url: ''
            },
            {
              supplier_comment_daishenhe_num: '',//待审核线上评论
              name: '待审核线上评论',
              url: ''
            },
            {
              merchant_comment_daishenhe_num: '',//待审核线下评论
              name: '待审核线下评论',
              url: ''
            },
            {
              goods_daishenhe_num: '',//待审核商品
              name: '待审核商品',
              url: ''
            },
            {
              merchant_is_auth_daishenhe_num: '',//待审核线下店铺资质
              name: '待审核线下店铺资质',
              url: ''
            },
            {
              supplier_extract_order_num: '',//线上商家提现
              name: '线上商家提现',
              url: ''
            },
            {
              merchant_extract_order_num: '',//线下商家提现
              name: '线下商家提现',
              url: ''
            },
            {
              user_extract_order_num: '',//用户提现
              name: '用户提现',
              url: ''
            },
            {
              task_num: '',//待审核任务
              name: '待审核任务',
              url: ''
            },
            {
              comment_num: '',//推荐词
              name: '推荐词',
              url: ''
            }
       ];
    //轮播切换
    $('.layadmin-carousel').each(function () {
      var othis = $(this);
      carousel.render({
        elem: this
        , width: '100%'
        , arrow: 'none'
        , interval: othis.data('interval')
        , autoplay: othis.data('autoplay') === true
        , trigger: (device.ios || device.android) ? 'click' : 'hover'
        , anim: othis.data('anim')
      });
    });
    //获取待办事项数据
    function dbsx() {
      admin.req({
        url: layui.setter.requestUrl + 'api.php?c=tong_ji/shopStatistics',
        data: {

        },
        done: function (res) {

        }
      })
    }
    element.render('progress');
  });

  //数据概览
  layui.use(['admin', 'carousel', 'echarts'], function () {
    var $ = layui.$
      , admin = layui.admin
      , carousel = layui.carousel
      , echarts = layui.echarts;


  });

  exports('console', {})
});