define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var program = {
        faqs:'',
        index:'',
        getWebInfo:function(){
            utils.ajax(url.SELECT_SITEINFO,{},function(result) {
                for(var i = 0, len = result.data.length; i < len; i++) {
                    if(result.data[i].name.toLowerCase()=="faqs") {
                        program.faqs = result.data[i].value;
                        $(".content").html(program.faqs);
                    }
                    else if(result.data[i].name.toLowerCase()=="index") {
                        program.index = result.data[i].value;
                        $(".main").html(program.index);
                    }
                }
            })
        }
    };
    program.getWebInfo();
});