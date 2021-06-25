layui.define(['layer', 'tinymce', 'form', 'admin', 'view', 'laytpl', 'setter', 'upload'], function(exports) {
    // layui.use('tinymce', layui.factory('tinymce'));
    // layui.factory('tinymce')
    console.log(layui.factory('public'));
    var $ = layui.$,
        layer = layui.layer,
        form = layui.form,
        laytpl = layui.laytpl,
        setter = layui.setter,
        view = layui.view,
        admin = layui.admin,
        upload = layui.upload,
        tinymce = layui.tinymce;

    function ToolClass() {

    };
    //预览图片
    ToolClass.prototype.lookBigImg = function(ImgArr) {
        var that = this;
        if (!ImgArr[0]) {
            return layer.msg('暂无');
        };
        layer.open({
            type: 1,
            title: '预览图片',
            area: [500 + 'px', 500 + 'px'],
            shadeClose: true, //点击遮罩关闭
            content: `<div id="lookContainer" style="height:100%;position:relative;">
                           
                      </div>`, //这里content是一个普通的String
            success: function() {
                ImgArr.forEach((item, index) => {
                    $('#lookContainer').append(`
                       <img layer-pid="look_${index}" layer-src="${layui.setter.CDN + item}"  src="${layui.setter.CDN + item}" style="width:100px;cursor: pointer;" alt="图片名"> 
                    `)
                    if (ImgArr.length === 1) {
                        $('#lookContainer img').css({
                            'position': 'absolute',
                            'left': '50%',
                            'top': '50%',
                            'transform': 'translate(-50%, -50%)'
                        })
                    }
                    setTimeout(function() {
                        layer.photos({
                            photos: '#lookContainer',
                            anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                        });
                    }, 100)
                })
            }
        });
    };
    //删除表格行的方法，url是接口名
    ToolClass.prototype.delTableLine = function(obj) {
        layer.confirm('确认要删除吗？', {
            btn: ['确定', '取消'] //按钮
        }, function(index) {
            layer.close(index);
            //此处请求后台程序，下方是成功后的前台处理……
            var index = layer.load(0, { shade: [0.7, '#393D49'] }, { shadeClose: true }); //0代表加载的风格，支持0-2
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=' + obj.url,
                data: obj.param || {},
                success: function(res) {
                    if (res.code == 0) {
                        layer.msg(res.msg);
                        layer.close(index);
                        if (obj.success) {
                            obj.success();
                        }
                    } else {
                        layer.msg(res.msg);
                        layer.close(index);
                    }
                }
            })
        });
    };
    //省市区三级联方法
    ToolClass.prototype.linkage = function(options) {
        var province = ''; //省id
        var city = ''; //市id
        var district = ''; //区/县id
        this.getProvince(options);
        form.on('select(' + options.province + ')', function(data) {
            $('.' + options.city).html(`<option value="">请选择</option>`);
            province = data.value;
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=region/getCityListregion/getCityList',
                data: {
                    province_id: data.value
                },
                success: function(res) {
                    if (res.code == 0) {
                        res.data.list.forEach(item => {
                            $('.' + options.city).append(`
                              <option value="${item.region_id}">${item.region_name}</option> 
                            `)
                            $('.' + options.county).html(`
                            `)
                        })
                    } else {
                        layer.msg(res.msg);
                    }
                    form.render();
                }
            })
        });
        form.on('select(' + options.city + ')', function(data) {
            $('.' + options.county).html(`<option value="">请选择</option>`);
            city = data.value;
            admin.req({
                url: layui.setter.requestUrl + 'api.php?c=region/getCountryList',
                data: {
                    city_id: data.value
                },
                success: function(res) {
                    if (res.code == 0) {
                        res.data.forEach(item => {
                            $('.' + options.county).append(`
                              <option value="${item.region_id}">${item.region_name}</option> 
                            `)
                        })
                    } else {
                        layer.msg(res.msg);
                    }
                    form.render();
                }
            });
        });
        form.on('select(' + options.county + ')', function(data) {
            district = data.value;
            options.success(province, city, district)
        });
    };
    ToolClass.prototype.getProvince = function(options) {
        var that = this;
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=getProvinceList',
            success: function(res) {
                if (res.code == 0) {
                    res.data.list.forEach(item => {
                        $('.' + options.province).append(`
                          <option value="${item.region_id}">${item.region_name}</option> 
                        `)
                    })
                    if (options.provinceId) {
                        $('.' + options.province).val(options.provinceId);
                        that.getCity(options);
                    }
                } else {
                    layer.msg(res.msg);
                }
                form.render();
            }
        })
    };
    //
    ToolClass.prototype.getCity = function(options) {
        var that = this;
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=getCityList',
            data: {
                province_id: options.provinceId
            },
            success: function(res) {
                if (res.code == 0) {
                    res.data.list.forEach(item => {
                        $('.' + options.city).append(`
                          <option value="${item.region_id}">${item.region_name}</option> 
                        `)
                    })
                    if (options.cityId) {
                        $('.' + options.city).val(options.cityId);
                        that.getCountryList(options);
                    }
                } else {
                    layer.msg(res.msg);
                }
                form.render();
            }
        })
    };
    ToolClass.prototype.getCountryList = function(options) {
        admin.req({
            url: layui.setter.requestUrl + 'api.php?c=getCountryList',
            data: {
                city_id: options.cityId
            },
            success: function(res) {
                if (res.code == 0) {
                    res.data.forEach(item => {
                        $('.' + options.county).append(`
                          <option value="${item.region_id}">${item.region_name}</option> 
                        `)
                    })
                    if (options.countyId) {
                        $('.' + options.county).val(options.countyId);
                    }
                } else {
                    layer.msg(res.msg);
                }
                form.render();
            }
        })
    };

    function Base64() {
        // private property  
        _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // public method for encoding  
        this.encode = function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = _utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        }

        // public method for decoding  
        this.decode = function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        }

        // private method for UTF-8 encoding  
        _utf8_encode = function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        }

        // private method for UTF-8 decoding  
        _utf8_decode = function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }

    //富文本编辑器构造函数
    function Edit(option) {
        this.ele = option.el;
        this.width = option.width;
        this.height = option.height || '300px';
        layui.tinymce.render({
            elem: this.ele,
            images_upload_handler: function(blobInfo, succFun, failFun) {
                var xhr, formData;
                var file = blobInfo.blob(); //转化为易于理解的file对象
                layer.load();
                xhr = new XMLHttpRequest();
                xhr.withCredentials = false;
                xhr.open('POST', layui.setter.requestUrl + 'api.php?c=uploadImg/uploadImage&module=pic');
                xhr.onload = function() {
                    var json;
                    if (xhr.status != 200) {
                        failFun('HTTP Error: ' + xhr.status);
                        return;
                    }
                    json = JSON.parse(xhr.responseText);
                    if (!json || typeof json.data != 'string') {
                        failFun('Invalid JSON: ' + xhr.responseText);
                        return;
                    };
                    succFun(layui.setter.CDN + json.data);
                    layer.closeAll('loading'); //关闭loading
                };
                formData = new FormData();
                formData.append('file', file, file.name); //此处与源文档不一样
                xhr.send(formData);
            },
            content_style: "img {max-width:100%;height:auto;}",
            form: {
                name: 'file',
                data: {
                    module: 'pic'
                }
            },
            height: this.height,
            width: this.width,
        }, (opt, edit) => {
            option.success && option.success();
        });
    };
    //获取html内容
    Edit.prototype.getContent = function(index) {
            return layui.tinymce.get(this.ele).getContent();
        }
        //获取纯文本内容
    Edit.prototype.getText = function(index) {
        return layui.tinymce.get(this.ele).getContent({ format: 'text' });
    }

    //设置文本内容
    Edit.prototype.setContent = function(con) {
            var that = this;
            layui.tinymce.get(that.ele).setContent(con);
        }
        // 
        //获取视频时常的方法
    function uploadVideo(params) {
        upload.render({
            elem: params.elem,
            url: params.url,
            accept: 'video',
            data: {
                module: function() {
                    return 'video'
                }
            },
            before: function(obj) {
                layer.load();
                obj.preview(function(index, file, result) {
                    var audioElement = new Audio(result);
                    var duration;
                    audioElement.addEventListener("loadedmetadata", function(_event) {
                        duration = audioElement.duration;
                        var hour = parseInt((duration) / 3600);
                        var minute = parseInt((duration % 3600) / 60);
                        var second = parseInt(duration % 60);
                        params.getTimes && params.getTimes({ hour, minute, second });
                    });
                });
            },
            done: function(res, index, upload) { //上传后的回调
                params.done && params.done(res, index, upload)
                layer.closeAll('loading'); //关闭loading
            },
            error: function(index, upload) {
                layer.closeAll('loading'); //关闭loading
            }
        })
    };

    var tool = new ToolClass();
    //富文本编辑器

    //对外暴露的接口
    exports('public', { tool, Edit, uploadVideo, Base64 });
});