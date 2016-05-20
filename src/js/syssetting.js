define(function(require, exports, module){
    require('jquery');
    require('bootstrap');
    require('ueditor_config');
    require('ueditor');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var program = {

    };
    var indexData = UE.getEditor('index-data', {
        initialFrameWidth:550 ,
        initialFrameHeight:300
    });
    var faqsData = UE.getEditor('faqs-data', {
        initialFrameWidth: 550,
        initialFrameHeight: 300
    })
})