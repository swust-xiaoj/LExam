define(function(require){
    require('jquery');
    require('bootstrap');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var program = {
        examId: '',
        userId: '',
        getPaperDetail: function() {
            var _this = this;
            utils.ajax(url.SELECT_PAPERDETAIL, {examId : _this.eId, userId : _this.uId}, function(result) {
                var basicInfo = result.mapPaper;
                $(".examName").text(basicInfo.examName);
                $(".userName").text(basicInfo.userName);
                $(".totalNum").text(basicInfo.score);
                $(".acNum").text(basicInfo.acedCount);
                $(".time").text(basicInfo.usedTime);
                var render = template("getcontent",result);
                $("#paperTempla").html(render);
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
    var parm = utils.getQueryObject();
    program.eId = parm["eId"];
    program.uId = parm["uId"];
    program.getPaperDetail();
})