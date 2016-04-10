/*
 * utils.js
 * created by xiaoj
 * 2016-4-8 11:49:50
 */

define(function(require){
    require('jquery');

    //小于 10 的数前面补 0
    function paddingZero(val) {
        if(val < 10) {
            return '0' + val;
        }else {
            return val;
        }
    }

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
        },
        /*
         * get url params
         * url like "www.baidu.com?id=1&name=xiaoj"
         * @return object like {id: 1, name: 'xiaojie'}
         */
        getQueryObject:function () {
            var url = window.location.href;
            var search = url.substring(url.lastIndexOf("?") + 1);
            var obj = {};
            var reg = /([^?&=]+)=([^?&=]*)/g;
            search.replace(reg, function (rs, $1, $2) {
                var name = decodeURIComponent($1);
                var val = decodeURIComponent($2);                
                val = String(val);
                obj[name] = val;
                return rs;
            });
            return obj;
        },
        /* 
         * 按所给的时间格式输出指定的时间
         *
         * for example: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss 星期w')
         * output: 2014-09-05 13:14:20 星期五
         */
        formatDate: function(oDate, sFormation) {  
            var eles = {
                'yyyy': oDate.getFullYear(),
                'yy':   oDate.getFullYear().toString().slice(2),
                'MM':   paddingZero(oDate.getMonth() + 1),
                'M':    oDate.getMonth() + 1,
                'dd':   paddingZero(oDate.getDate()),
                'd':    oDate.getDate(),
                'HH':   paddingZero(oDate.getHours()),
                'H':    oDate.getHours(),
                'hh':   paddingZero(oDate.getHours() % 12),
                'h':    oDate.getHours() % 12,
                'mm':   paddingZero(oDate.getMinutes()),
                'm':    oDate.getMinutes(),
                'ss':   paddingZero(oDate.getSeconds()),
                's':    oDate.getSeconds(),
                'w':    ['日', '一', '二', '三', '四', '五', '六'][oDate.getDay()]
            };
            var regex = /(yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|w)/g;
            return sFormation.replace(regex, function(match) {
                 return eles[match];
            });   
        },
        toggleCheck: function(parClass, childId) {
            $('.' + parClass).click(function() {
                if(this.checked) {    
                    $('#'+ childId).find("input[type='checkbox']").prop("checked", true);      
                }
                else {    
                   $('#'+ childId).find("input[type='checkbox']").prop("checked", false);
                }    
            });
        }
    }
})