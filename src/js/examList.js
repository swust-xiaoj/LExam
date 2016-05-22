define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    require('datetimepicker');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
     var now = (new Date()).toLocaleString();
    $('.nowTime').text(now);
    setInterval(function() {
        now = (new Date()).toLocaleString();
        $('.nowTime').text(now);
    }, 1000);

    var program ={
        title:'',
        removeList: [],
        page: 1,
        dataSet:[],
        getExamInfo:function() {
            var _this = this;
            var data = {
                startTime: this.st,
                endTime: this.et,
                page: this.page,
                rows: 10
            }
            utils.ajax(url.EXAM_LIST, data, function(result) {
                _this.count = result.total;
                _this.dataSet = result.data;
                var lisr_render = template('getcontent', result);
                $('#listInfo').html(lisr_render);
            });
        }
    };
    program.getExamInfo();
    utils.toggleCheck('check_list', 'listInfo');

    $.jqPaginator('#pagination', {
        totalCounts : program.count,
        visiblePages: 5,
        currentPage: 1,
        pageSize: 10,
        first: '<li class="first"><a href="javascript:;">首页</a></li>',
        last: '<li class="last"><a href="javascript:;">尾页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if(type == 'init') {return;}
            program.page = num;
            program.getExamInfo();
        }
     });
});