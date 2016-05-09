define(function(require, exports, module){
    require('jquery');
    require('bootstrap');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    require('wangEditor');
    var program = {

    };
    var editor = new wangEditor('footer-info');
    editor.create();
})