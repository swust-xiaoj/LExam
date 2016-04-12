define(function(require){
    var $ = require('jquery');
    var utils = require('./utils.js');
    var url = require('./url.js')
    var knowledge = [];
    var courseHtml = ['<option>课程</option>'];
    var knowledgeHtml = ['<option>知识点</option>'];
    return {
        setCourse: function() {
            utils.ajax(url.SELECTKNOWLEDGE, {}, function(result) {
                for(var i = 0, len = result.total; i < len; i++) {
                    if(result.data[i].isCourse) {
                        courseHtml.push('<option value=' + result.data[i].knowId + '>' + result.data[i].knowName + '</option>');
                    }
                    else {
                        knowledge.push(result.data[i]);
                    }
                }
                $('.courseName').html(courseHtml.join(''));
                $('.knowName').html(knowledgeHtml.join(''));
            })
        },
        onchange: function() {
            var parentId = $(".courseName option:selected").val();
            knowledgeHtml = ['<option>知识点</option>'];
            for(var i = 0; i < knowledge.length ; i++){
                if(knowledge[i].parentId == parentId){
                    knowledgeHtml.push('<option value=' + knowledge[i].knowId + '>' + knowledge[i].knowName + '</option>');
                }
            }
            $('.knowName').html(knowledgeHtml.join(''));
        }
    }
})