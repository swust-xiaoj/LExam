define(function(require){
    require('jquery');
    require('bootstrap');
    var template = require('artTemplate');
    require('paginator');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var program = {
        page: 1,
        getPaperList: function() {
            var _this = this;
            utils.ajax(url.SELECT_PAPERLIST, {page: _this.page, rows: 20}, function(result) {
                _this.count = result.total;
                var render_list = template('getcontent', result);
                $('#listInfo').html(render_list);
            })
        },
        deletePaper: function(ids) {
           var _this = this
            utils.ajax(url.DELETE_PAPER, {id: ids}, function(result) {
                if(result.status){
                    utils.setTips('success', '删除成功！');
                    _this.getPaperList()
                }
                else {
                    utils.setTips('warning', '删除失败！');
                }
            })
        }
    };
    program.getPaperList();
    utils.toggleCheck('check_list', 'listInfo');

    // dom events
    $(".delete").on('click', function(){
        var idArr = [];
        $(":checkbox[name='title']:checked").each(function(i) {
            idArr[i] = $(this).val();
        });
        var ids= idArr.join(',');
        if(ids) {
            program.deletePaper(ids);
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
            program.page = num;
            program.getPaperList();
        }
     });
})