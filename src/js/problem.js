define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var template = require('artTemplate');
    var program = {};

    program = {
        title:'',
        getProblemInfo: function(page) {
            var _this = this;
            utils.ajax(url.PROBLEM_LIST, {page:page,rows:20}, function(result) {
                _this.count = result.total;
                var lisr_render = template('getcontent', result);
                $('#listInfo').empty();
                $('#listInfo').append(lisr_render);
            });
        },
        deleteIt: function() {
            $('.delete').on('click', function (e) {
                var valArr = [];
                $(":checkbox[name='title']:checked").each(function(i) {
                    valArr[i] = $(this).val();
                 });
                var vals = valArr.join(',');
                if(vals){
                    utils.ajax(url.PROBLEM_DELETE, {examId: vals}, function(result) {
                        if (result.status === 1) {
                            utils.setTips('success', '删除成功！');
                        }
                        else {
                            utils.setTips('danger', '删除失败！')
                        }
                    })
                }else{
                    utils.setTips('info', '请先勾选删除项！');
                }
            }); 
        }
    };
    program.getProblemInfo(1);
    program.deleteIt();
    $(".addProblem").click(function(){
        window.location.href="question.html";
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
            program.getProblemInfo(num);
        }
     });
});