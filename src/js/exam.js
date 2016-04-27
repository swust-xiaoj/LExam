define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    require('datetimepicker');
    // var modal = require('ui/modalDialog.js');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');

    // $('.datepicker').datepicker('left');
    // $('.datepickers').datepicker('place');
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
                rows: 20
            }
            utils.ajax(url.EXAM_LIST, data, function(result) {
                _this.count = result.total;
                _this.dataSet = result.data;
                var lisr_render = template('getcontent', result);
                $('#listInfo').html(lisr_render);
            });
        },
        deleteIt:function(){
            var valArr = [];
            var _this = this;
            $(":checkbox[name='title']:checked").each(function(i) {
                _this.removeList.push($(this).parents().eq(1));
                valArr[i] = $(this).val();
             });
            var vals = valArr.join(',');
            if(vals){
                utils.ajax(url.EXAM_DELETE, {examId: vals}, function(result) {
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
    program.getExamInfo();
    utils.toggleCheck('check_list', 'listInfo');
    utils.initDateTimePicker('datepickers');
    $(".addexam").click(function(){
        window.location.href = 'editExam.html'
    });
    $('.delete').on('click', function (e) {
        program.deleteIt();
    });
    $('.search').on('click', function(){
        var st = $('.startTime').val();
        var et = $('.endTime').val();
        if(!st || !et){
            utils.setTips('info', '请选择查询时间段！');
            return false;
        }
        if(st > et){
            utils.setTips('warning', '开始日期不能大于结束日期！');
            return false;
        }
        program.st = st;
        program.et = et;
        program.getExamInfo();
    });
    $('table').on('click', 'th', function(){;
        var sortType = $(this).text();
        program.dataSet.sort(function(a,b){
            return a[sortType].localeCompare(b[sortType]);
        });
        var result = {};
        if(program.flag){
            program.dataSet.reverse();
            program.flag = 0;
            $.extend(result, {data:program.dataSet})
            var lisr_render = template('getcontent', result);
            $('#listInfo').html(lisr_render);
        }
        else{
            $.extend(result, {data:program.dataSet})
            var lisr_render = template('getcontent', result);
            $('#listInfo').html(lisr_render);
            program.flag = 1;            
        }
        // r[sortType] = 1;
    })
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
            program.getExamInfo();
        }
     });
});