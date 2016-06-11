/*
 * utils.js
 * created by xiaoj
 * 2016-4-8 11:49:50
 */

define(function(require){
    require('jquery');
    var constant = require('./constant.js');

    function paddingZero(val) {
        if(val < 10) {
            return '0' + val;
        }else {
            return val;
        }
    }

    return {
        ajax: function(url, params, _callback, extraOps) {
            if(!extraOps){
                extraOps = {};
            }
            var type = extraOps.type || 'get',
            isasync  = extraOps.async || false,
            istradi = extraOps.istradi || false;
            $.ajax({
                type: type,
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                url: url,
                async: isasync,
                data: params,
                dataType:'json',
                traditional: istradi,
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
        setTips: function (className, tipsText) {
            $('.tips').html('');
            $('.tips').html('<div class="alert alert-'+ className +' alert-dismissable fade in">'
                + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'
                + tipsText + '</div>').fadeIn(800).fadeOut(5000);
        },
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
        },
        adjustDataStru: function (data) {
            var dataObj = {};
            var knowledge = [];
            var course = [];
            if(!data) {
                for(var i = 0, len = data.length; i < len; i++){
                    if(!data[i].isCourse) {
                        course.push({value: data[i].knowId, text: data[i].knowName, parentId: data[i].parentId});
                    }
                    else {
                        knowledge.push({value: data[i].knowId, text: data[i].knowName});
                    }
                }
            }
            dataObj['course'] = course;
            dataObj['knowledge'] = knowledge;
            return dataObj;
        },
        initDateTimePicker: function(className) {
            $('.' + className).datetimepicker({
                format: 'yyyy-mm-dd hh:ii:ss',
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left"
             });
        },
        initJudgeResult: function() {
            var r = constant.JUDGERESULT;
            var tpl = ['<option>----------Result----------</option>'];
            $.each(r, function(i){
                tpl.push('<option value=' + (i - 1) + '>' + r[i] + '</option>');
            });
            $('.judge-result').html(tpl.join(''));
        },
        initCompiler: function(){
            var c = constant.COMPILER;
            var tpl = ['<option>---------Compiler---------</option>'];
            $.each(c, function(i){
                tpl.push('<option value=' + (i + 1 ) + '>' + c[i] + '</option>');
            });
            $('.compiler').html(tpl.join(''));
        },
        formValidate: function(id, rules, messages) {
            $( id ).validate( {
                rules: rules,
                messages: messages,
                errorElement: "strong",
                errorPlacement: function ( error, element ) {
                    error.addClass( "help-block" );

                    element.parents( ".col-sm-5" ).addClass( "has-feedback" );

                    if ( element.prop( "type" ) === "checkbox" ) {
                        error.insertAfter( element.parent( "label" ) );
                    } else {
                        error.insertAfter( element );
                    }

                    if ( !element.next( "span" )[ 0 ] ) {
                        $( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter( element );
                    }
                },
                success: function ( label, element ) {
                    if ( !$( element ).next( "span" )[ 0 ] ) {
                        $( "<span class='glyphicon glyphicon-ok form-control-feedback'></span>" ).insertAfter( $( element ) );
                    }
                },
                highlight: function ( element, errorClass, validClass ) {
                    $( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
                    $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
                },
                unhighlight: function ( element, errorClass, validClass ) {
                    $( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
                    $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
                }
            } );
        }
    }
})