define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var template = require('artTemplate');
    var modal = require('ui/modalDialog.js');

    var params = {
        id: 'major',
        title: '专业信息',
        body: '<form id="majorInfo" method="post" action="" class="form-horizontal">'
                +  '<div class="form-group">'
                +    '<label class="col-md-2 control-label"><span class="require">*</span>学院名称</label>'
                +    '<div class="col-sm-5">'
                +         '<input type="text" name="academy" id="academy" class="form-control">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label class="col-md-2 control-label"><span class="require">*</span>专业名称</label>'
                +    '<div class="col-sm-5">'
                +         '<input type="text" name="majorName" id="majorName" class="form-control">'
                +    '</div>'
                +  '</div>'
                +'</form>',
        cancelText:'关闭',
        confirmText:'保存',
        cancel: function(){
            program.clearData()
        },
        confirm:function(){
            $('#marjorInfo').submit();
            if($('form').valid()){
                $('#major').modal('hide'); 
                program.addUser();
            }
        }
    };
    var newModal  = new modal(params);
    newModal.init();
    var program = {
        getMajor: function() {
            var _this = this;
            utils.ajax(url.MAJOR_LIST, {}, function(result) {
                _this.count = result.total;
                var lisr_render = template('getcontent', result);
                $('#listInfo').empty();
                $('#listInfo').append(lisr_render);
            });
        },
        selectById: function(id){
            var _this = this;
            utils.ajax(url.SELECT_MAJOR, {umid: id}, function(result){
                _this.setData(result.list[0]);
            })
        },
        setData: function(data){
            $('#academy').val(data.acadName);
            $('#majorName').val(data.majorName);
        },
        clearData: function(){
            $('#academy').val('');
            $('#majorName').val('');
        },
        addMajor: function(){

        },
        updateMajor: function(){
            var data = {
                "record.majorName" : program.majorName,
                "record.schoolName" : program.schoolName,
                "record.umid" : program.id
            }
            utils.ajax(url.UPDATE_MAJOR, data, function(result){
                if(result.status){
                    utils.setTips('success', '修改成功！');
                }
                else {
                    utils.setTips('warning', '修改失败！');
                }
            }, {type: 'post'})
        },
        deleteMagor: function(vals) {
            utils.ajax(url.DELETE_MAJOR, {umid: vals}, function(result){
                if(result.status){
                    utils.setTips('success', '删除成功！');
                }
                else{
                    utils.setTips('warning', '删除失败！');
                }
            })
        },
        validateForm: function() {
            var rules = {
                academy: "required",
                majorName: "required",
            };
            var messages = {
                academy: "请输入学院名称！",
                majorName: "请输入专业名称！",
            }
            utils.formValidate('#majorInfo',rules, messages);
        }
    };
    program.getMajor(1);
    utils.toggleCheck('check_list', 'listInfo');
    program.validateForm()

    $(".delete").on('click', function(){
        var valArr = [];
        $(":checkbox[name='title']:checked").each(function(i) {
            valArr[i] = $(this).val();
        });
        var vals = valArr.join(',');
        if(vals){
            program.deleteMagor(vals);
        }
        else{
            utils.setTips('info', '请先勾选删除项！');
        }
    });
    $('.cancelBtn').on('click', function(){
        program.clearData()
    })
    $('.modify').on('click', function(){
        $('#major').modal('show');
        var id = this.id;
        if(id){
            program.selectById(id);
        }
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
            program.getMajor();
        }
     });
});