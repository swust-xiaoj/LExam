define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    var modal = require('ui/modalDialog.js');
    var template = require('artTemplate');

    var program ={
        title:'',
        getExamInfo:function(page){
             $.ajax({
                type : "get",
                content : "application/x-www-form-urlencoded;charset=UTF-8",
                url:"../../mock/test.json",
                dataType : 'json',
                async : false,
                data:{
                    page:page,
                    rows:"20"
                },
                success:function(result){ 
                    console.log(result);
                    program.count = result.total;
                     var lisr_render = template('getcontent', result);
                      $("#listInfo").empty();   
                      $("#listInfo").append(lisr_render);
                }
            });
        },
        deleteIt:function(){
            $('.delete').on('click', function (e) {
                var valArr = new Array;
                $(":checkbox[name='title']:checked").each(function(i) {
                        valArr[i] = $(this).val();
                    });
                var vals = valArr.join(',');// 转换为逗号隔开的字符串
                console.log(vals);
                if(vals!=""){
                $.ajax({
                    type : "get",
                    content : "application/x-www-form-urlencoded;charset=UTF-8",
                    url:"../exam/ deleteExam",      
                    dataType : 'json',
                    async : false,
                    data:{
                        examIds:vals
                    },
                    success:function(result){ 
                        // console.log(result);
                        // if(result.status ==1){
                        //     pubMeth.alertInfo("alert-success","删除成功！");
                        // }else{
                        //     pubMeth.alertInfo("alert-danger","删除失败！");
                        // }
                    }
                });
                }else{
                    // pubMeth.alertInfo("alert-info","请先勾选删除项！");
                }
            }); 
        }
    };
    program.getExamInfo(1);
    program.deleteIt();
    var params = {
        id: 'addModal',
        body: 'I am the body',
        title: 'test-title'
    };
    var newModal  = new modal(params);
    newModal.init();
    // $(".addExam").click(function(){
    //     $('#addCourse').modal({
    //             backdrop:'static'
    //         }); 
    // });
     $.jqPaginator('#pagination', {
                    totalCounts : program.count,
                    visiblePages: 5,
                    currentPage: 1,
                    pageSize: 20,
                    first: '<li class="first"><a href="javascript:;">首页</a></li>',
                    last: '<li class="last"><a href="javascript:;">尾页</a></li>',
                    page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
                    onPageChange: function (num, type) {
                        if(type == 'init') {return;}
                        program.getExamInfo(num);
                    }
     });
});