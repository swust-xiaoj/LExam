define(function(require, exports, module){
    var $ = require('jquery');
    var utils = require('./utils.js');
    var url = require('./url.js')

    var course = [];
    var knowledgeHtml = [];
    var courseName = [];
    var sumList = [];
    var linkageMenu = {
        course: [],
        knowledgeHtml:[],
        courseName: [],
        sumList: [],
        setCourse: function() {
            var _this = this;
            utils.ajax(url.SELECTKNOWLEDGE, {}, function(result) {
                var length = result.total;
                var currId = "";
                var flag = 0;
                $(".courseName").empty();
                $(".courseName").append("<option>课程</option>");
                for(var i = 0 ; i < length ; i++){
                    if(result.data[i].isCourse){
                        _this.courseName.push(result.data[i]);
                        $(".courseName").append("<option value="+result.data[i].knowId+">"+result.data[i].knowName+"</option>");
                    }else{
                        _this.course.push(result.data[i]);
                        _this.sumList.push(result.sumList[i]);
                    }
                }
                _this.onchange();
            })
        },
        onchange: function() {
            var _this = this;
            $(".knowName").html("");
            var parentId = $(".courseName option:selected").val();
            if(parentId =="课程"){
                $(".knowName").html("<option>知识点</option>");
                return ;
            }
            for(var i = 0; i < _this.course.length ; i++){
                if(_this.course[i].parentId == parentId){
                    $(".knowName").append("<option value="+_this.course[i].knowId+">"+_this.course[i].knowName+"</option>");
                }
            }
        }
    };
    $(".courseName").change(function(){
            linkageMenu.onchange();
    });
    module.exports = linkageMenu;
})