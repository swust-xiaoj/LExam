define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var template = require('artTemplate');
    var linkageMenu = require('biz/linkageMenu.js');
    var program = {};

    program = {
        title:'',
        removeList:[],
        page: 1,
        getProblemInfo: function() {
            var _this = this;
            var query = {
                "problemInfo.title": _this.title,
                "problemInfo.level" : _this.level,
                knowId : _this.know,
                page: _this.page,
                rows: 20
            };
            utils.ajax(url.PROBLEM_LIST, query, function(result) {
                _this.count = result.total;
                for(var i = 0, len = result.data.length; i < len; i++) {
                    result.data[i].courseName = result.course[i].knowName || '';
                    result.data[i].knowName = result.knowledge[i].knowName || '';
                    (result.data[i].totalSubmit === 0 || result.data[i].acedNum === 0) ? result.data[i].difficulty = 0 : result.data[i].difficulty = (result.data[i].acedNum / result.data[i].totalSubmit).toFixed(3)
                }
                var lisr_render = template('getcontent', result);
                $('#listInfo').html(lisr_render);
            });
        },
        deleteIt: function() {
            var valArr = [];
            var _this = this;
            $(":checkbox[name='title']:checked").each(function(i) {
                _this.removeList.push($(this).parents().eq(1));
                valArr[i] = $(this).val();
             });
            var vals = valArr.join(',');
            if(vals){
                utils.ajax(url.PROBLEM_DELETE, {examId: vals}, function(result) {
                    if (result.status === 1) {
                        utils.setTips('success', '删除成功！');
                        _this.removeEle();
                    }
                    else {
                        utils.setTips('danger', '删除失败！')
                    }
                })
            }else{
                utils.setTips('info', '请先勾选删除项！');
            }
        },
        removeEle: function(){
            $(this.removeList).each(function(){
                $(this).remove()
            })
        }
    };
    program.getProblemInfo();
    utils.toggleCheck('check_list', 'listInfo');
    linkageMenu.setCourse();
    
    $(".addProblem").click(function(){
        window.location.href="question.html";
    });

    $('.courseName').on('change', function(){
        linkageMenu.onchange();
    });
    $('.search').on('click', function() {
        program.page = 1;
        program.title = $('.searTitle').val().trim();
        program.level = $(".level option:selected").val();
        program.know = $(".knowName option:selected").val();
        program.getProblemInfo();
    });
    $('.opration').on('change', '.knowName,.level', function() {
        var value = $(this).val();
        if($(this).attr('class').indexOf('knowName')!==-1){
            program.know = value;
        }
        else {
            program.level = value;
        }
        program.getProblemInfo();
    })
    $('.delete').on('click', function (e) {
        program.deleteIt();
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
            program.page = num;
            program.getProblemInfo();
        }
     });
});