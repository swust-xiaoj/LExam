/*
 * utils.js
 * created by xiaoj
 * 2016-4-8 11:49:50
 */

define(function(require){
    require('jquery');
    return {
        /*
         * ajax
         * @param url sendurl
         * @param params data
         * @param isasync async
         * @param callbacksuc success callback funtion
         * author xiaojie
         */
        ajax: function(url, params, _callback, extraOps = {}) {
            var type = extraOps.type || 'get',
            isasync  = extraOps.async || false;
            $.ajax({
                type: type,
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                url: url,
                async: isasync,
                data: params,
                dataType:'json',
                success: function(result){
                    if(_callback) {
                        _callback(result);
                    }
                },
                error:function() {
                    if ((extraOps||{}).errorCallback) {
                        (extraOps||{}).errorCallback();
                    }
                }
            })
        },
        /*
         * set ajax return status text
         * @param className tips class only in [danger, success, info, warning]
         * @param tipsText text, html string can also
         */
        setTips: function (className, tipsText) {
            $('.tips').html('');
            $('.tips').html('<div class="alert alert-'+ className +' alert-dismissable">'
                + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
                + tipsText + '</div>');
        }
    }
})