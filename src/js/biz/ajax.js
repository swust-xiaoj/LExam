/*
 * ajax
 * @param methed get or post
 * @param url sendurl
 * @param params data
 * @param isasync async
 * @param callbacksuc success callback funtion
 * @param callbackerr error callback function
 * author xiaojie
 */
define(function(require){
    require('jquery');
    var ajax = function(method, url, params, isasync, callbacksuc,callbackerr) {
        $.ajax({
            type: method,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            url: url,
            async: isasync,
            data: params,
            success: callbacksuc,
            error:callbackerr,
        })
    };
    return ajax;
})