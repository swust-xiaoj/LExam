define(function(require){
    require('jquery');
    require('bootstrap');
    var template = require('artTemplate');
    require('paginator');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var program = {
        initPage: function(page) {
            var _this = this;
            utils.ajax(url.UNLOCKLIST, {page: page, rows: 20}, function(result) {
                _this.count = result.total;
                var render_list = template('getcontent', result);
                $('#listInfo').html(render_list);
            })
        },
        unlock: function(ids) {
            utils.ajax(url.UNLOCKIT, {id: ids}, function(result){
                if(result.status) {
                    utils.setTips('success', '解锁成功！');
                }
                else {
                    utils.setTips('danger', '解锁失败！');
                }
            })
        }
    };
    program.initPage(1);
    utils.toggleCheck('check_list', 'listInfo');

    // dom events
    $(".unlocks").on('click', function(){
        var idArr = [];
        $(":checkbox[name='title']:checked").each(function(i) {
            idArr[i] = $(this).val();
        });
        var ids= idArr.join(',');
        if(ids) {
            program.unlock(ids);
        }
        else {
            utils.setTips('info', '请先勾选删除项！');
        }   
    });

    $("tbody").on("click", ".lock-btn", function(event) {
        var id = $(this).parents().eq(1).find('input:checkbox').val();
        if(id) {
            program.unlock(id);
        }
        else {
            utils.setTips('info', '请先勾选删除项！');
        }
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
            program.initPage(num);
        }
     });
})