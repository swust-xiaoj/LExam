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
        unlock: function() {
            utils.ajax(url.UNLOCKIT, {id: progrma.ids}, function(){
                if(reuslt.status) {
                    utils.setTips('success', '解锁成功！');
                }
                else {
                    utils.setTips('danger', '介绍失败！');
                }
            })
        }
    };
    program.initPage(1);
    utils.toggleCheck('check_list', 'listInfo');

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