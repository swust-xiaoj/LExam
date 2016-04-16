define(function(require){
    require('jquery');
    var url =  require('biz/url.js');
    var utils = require('biz/utils.js');
    var template = require('artTemplate');

    var program = {
        initKnowledge: function() {
            utils.ajax(url.SELECT_KNOWLEDGE, {}, function(result) {
                var lisr_render = template('getcontent', result);
                $("#listInfo").html(lisr_render);
            })
        }
    };
    program.initKnowledge();
    $('.knowPoint').on('click', function(){
        window.location.href = 'problem.html';
    })
})