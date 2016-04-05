define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    require('datepicker');
    var modal = require('ui/modalDialog.js');
    var template = require('artTemplate');

    var params = {
        id: 'addModal',
        title: '添加考试',
        body: '<form class="form-horizontal">'
                +  '<div class="form-group">'
                +    '<label for="exam-title" class="col-sm-2 control-label">标题</label>'
                +    '<div class="col-sm-10">'
                +      '<input type="email" class="form-control" id="exam-title" placeholder="Title">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label for="exam-des" class="col-sm-2 control-label">描述</label>'
                +    '<div class="col-sm-10">'
                +      '<textarea class="form-control" id="exam-des" rows="3"></textarea>'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label for="exam-start" class="col-sm-2 control-label">开始时间</label>'
                +    '<div class="col-sm-10">'
                +      '<div class="input-group date datepickers">'
                +        '<input class="form-control" type="text"><span class="input-group-addon"><i class="fa fa-calendar"></i></span>'
                +      '</div>'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label for="exam-end" class="col-sm-2 control-label">结束时间</label>'
                +    '<div class="col-sm-10">'
                +      '<div class="input-group date datepicker">'
                +        '<input class="form-control" type="text"><span class="input-group-addon"><i class="fa fa-calendar"></i></span>'
                +      '</div>'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label for="inputText" class="col-sm-2 control-label">可用编辑器：</label>'
                +    '<div class="col-sm-10">'
                +     '<select id="form-control">'
                +        '<option>C++</option>'
                +        '<option>GCC</option>'
                +        '<option>JAVA</option>'
                +      '</select>'
                +    '</div>'
                +  '</div>'
                +'</form>',
        cancelText:'关闭',
        confirmText:'提交',
        cancel: function(){
            // alert('test cancel');
        },
        confirm:function(){
            // alert('test confirm');
            // return false;
        }
    };
    console.log(params)
    // var modalEle = template('myModal',params);
    // $('body').append(modalEle);
    var newModal  = new modal(params);
    newModal.init();
    // $('#addModal').modal('show')

    $('.datepicker').datepicker('left');
    $('.datepickers').datepicker('place');
    var program ={
        title:'',
        getExamInfo:function(page){
             $.ajax({
                type : "get",
                content : "application/x-www-form-urlencoded;charset=UTF-8",
                url:"../../mock/exam.json",
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
    
    $(".addexam").click(function(){
        $('#addModal').modal('show'); 
    });
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