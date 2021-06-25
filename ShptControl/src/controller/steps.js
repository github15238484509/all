layui.define(function (exports) {
    var $ = layui.jquery;
    var view = layui.view;
    //步骤器构造函数
    function Steps(obj){
            this.index = 0;
            this.el = obj.el;
            this.nextEl = obj.nextEl;
            this.prevEl = obj.prevEl;
            this.title = obj.title || []; 
            this.subMit = obj.subMit;
            this.render();
        };
     //渲染内容
       Steps.prototype.render = function(){
           $(this.prevEl).hide();
           $(this.subMit).hide();
            $(this.el).append(`
                <ul class="step-top">
                
                </ul>
            `)
            $(this.el).append(`
                <div class="step-content">
                    <dl class="step-content-dl">
                    </dl>
                </div>
            `)
            $(this.el).find('.steps').each((index,item)=>{
                    $(this.el).find('.step-top').append(`
                        <li>
                            <div style="display: flex;align-items: center;flex: 1;">
                                <div class="step-number active">${index+1}</div>
                                <div class="line"></div>
                            </div>
                            <div class="step-wz step-active">${$(item).attr('data-title')||''}</div>
                        </li>
                    `)
                    $(this.el).find('.step-content-dl').append(`
                        <dd class="step-content-dd" id="goodRender${index+1}">${$(item).html()}</dd>
                    `)
            })
            $(this.el).find('.steps').remove();
            view('goodRender1').render('/template/goodsManage/testGoods')
            view('goodRender2').render('/template/goodsManage/addGoodsTwo')
            view('goodRender3').render('/template/goodsManage/addGoodsThree')
            view('goodRender4').render('/template/goodsManage/addGoodsFour')
       }
    //  //用户点击下一步
        Steps.prototype.next_step = function(){
              $(this.prevEl).show();
                this.index++;
                if (this.index >= 3) {
                    this.index = 3;
                    $(this.nextEl).hide();
                    $(this.subMit).show();
                };
                $('.step-content dl').css({
                    'transform': 'translateX(-' + this.index * (25) + '%)'
                });
                $('.step-top .step-number').eq(this.index).addClass('active');
        };
    // //用户点击上一步
        Steps.prototype.previous_step = function(){
            $(this.nextEl).show();
            $(this.subMit).hide();
                $('.step-top .step-number').eq(this.index).removeClass('active');
                this.index--;
                if (this.index <= 0) {
                    this.index = 0;
                    $(this.prevEl).hide();
                }
                $('.step-content dl').css({
                    'transform': 'translateX(-' + this.index * (25) + '%)'
                })
        };
      exports('steps', {Steps})
});