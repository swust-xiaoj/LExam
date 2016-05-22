define(function(require){
    require('jquery');
    require('bootstrap');
    require('paginator');
    var url = require('biz/url.js');
    var utils = require('biz/utils.js');
    var template = require('artTemplate');
    var constant = require('biz/constant.js');

    var program = {
        initPage: function(){
            utils.initJudgeResult();
            utils.initCompiler();
            this.getSubmitInfo(1);
        },
        getSubmitInfo: function(page) {
            var _this = this;
            utils.ajax(url.SELECT_SUBMIT, {page: page, rows: 20}, function(result) {
                _this.count = result.total;
                _this.rstid2text(result.data);
                var lisr_render = template('getcontent', result);
                $('#listInfo').html(lisr_render);
            })
        },
        rstid2text: function(data) {
            for(var i = 0, len = data.length; i < len; i++) {
                data[i]['rstText'] = constant.JUDGERESULT[(data[i].result + 1)];
                switch ((data[i].result + 1)) {
                    case 0: data[i]['rstClass'] = 'danger';
                            break;
                    case 1: data[i]['rstClass'] = 'success';
                            break;
                    case 2: data[i]['rstClass'] = 'info';
                            break;
                    case 3: data[i]['rstClass'] = 'warning';
                            break;
                    case 4: data[i]['rstClass'] = 'warning';
                            break;
                    case 5: data[i]['rstClass'] = 'danger';
                            break;
                    case 6: data[i]['rstClass'] = 'danger';
                            break;
                    case 7: data[i]['rstClass'] = 'inverse';
                            break;
                    case 8: data[i]['rstClass'] = 'danger';
                            break;
                    case 10: data[i]['rstClass'] = 'info';
                            break;
                }
            }
        }
    };
    // init page
    program.initPage();
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
            program.getSubmitInfo(num);
        }
     });
})