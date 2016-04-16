define(function(require){
    require('jquery');
    var url =  require('biz/url.js');
    var utils = require('biz/utils.js');

    var program = {
        initKnowledge: function() {
            utils.ajax(url.SELECTKNOWLEDGE, {}, function(result) {
                var data = result.data;
                var sumList = result.sumList;
                var course = [];
                $.each(data, function(i){
                    $(this).sum = sumList[i];
                    if($(this).isCourse) {
                        course.push($(this));
                    }
                });
                for(var i = 0, len = course.length; i < len; i++){
                    for(var j = 0, llen = data.length; j < llen; j++) {
                        //
                    }
                }
                var lisr_render = template('getcontent', result);
                $("#listInfo").html(lisr_render);
            })
        }
    }
})