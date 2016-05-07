define(function(require){
    var $ = require('jquery');
    // var utils = require('./utils.js');
    var url = require('./url.js')

    var course = [];
    var knowledgeHtml = [];
    var courseName = [];
    var sumList = [];
    function setCourse(){
            $.ajax({
                type:"get",
                content:"application/x-www-form-urlencoded;charset=UTF-8",
                url:url.SELECTKNOWLEDGE,
                dataType : 'json',
                async : false,
                success:function( result ){
                    var length = result.total;
                    var currId = "";
                    var flag = 0;
                    $(".courseName").empty();
                    $(".courseName").append("<option>课程</option>");
                    for(var i = 0 ; i < length ; i++){
                        if(result.data[i].isCourse){
                            courseName.push(result.data[i]);
                            $(".courseName").append("<option value="+result.data[i].knowId+">"+result.data[i].knowName+"</option>");
                        }else{
                            course.push(result.data[i]);
                            sumList.push(result.sumList[i]);
                        }
                    }
                    onchange();
                }
            });
        }
        function onchange(){
            $(".knowName").html("");
            var parentId = $(".courseName option:selected").val();
            if(parentId =="课程"){
                $(".knowName").html("<option>知识点</option>");
                return ;
            }
            for(var i = 0; i < course.length ; i++){
                if(course[i].parentId == parentId){
                    $(".knowName").append("<option value="+course[i].knowId+">"+course[i].knowName+"</option>");
                }
            }
        }
    return {
        setCourse:setCourse,
        onchange:onchange,
        course:course,
        courseName:courseName,
        sumList:sumList
    };
})