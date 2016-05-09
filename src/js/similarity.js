define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var template = require('artTemplate');
    var program = {};

    program = {
        count: '',
        page: 1,
        rows: 20,
        getSimilarityInfo: function() {
            var _this = this;
            utils.ajax(url.SELECT_SIMILARITYLIST, {page: _this.page, rows: _this.rows}, function(result) {
                _this.count = result.total;
                var lisr_render = template('getcontent', result);
                $('#listInfo').html(lisr_render);
            });
        },
        deleteIt: function() {
            
        }
    };

    program.getSimilarityInfo();
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
            program.page = num;
            program.getSimilarityInfo();
        }
     });
});