define(function(require, exports, module){
    require('jquery');
    require('bootstrap');
    require('ueditor_config');
    require('ueditor');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
<<<<<<< bc5465c185e003fa49f5ed70c4b91a798d1eee1b
    // require('wangEditor');
    var program = {

    };
    // var editor = new wangEditor('footer-info');
    // editor.create();
=======
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
>>>>>>> add doc
})