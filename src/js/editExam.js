define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('datetimepicker');
    var linkageMenu = require('biz/linkageMenu.js');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');

    var program ={
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        examId: '',
        addQuesTpl: function() {
            var tplArr = ['<tr><td><select class="form-control courseName"></select></td>',
                              '<td><select class="form-control knowName"></select></td>',
                              '<td><select class="form-control level">',
                                  '<option value="0">Easy</option>',
                                  '<option value="1">Normal</option>',
                                  '<option value="2">Hard</option></select></td>',
                              '<td><input class="form-control datepickers protime"  type="text"  readonly /></td>',
                              '<td><input class="form-control"  type="text"  value="10" /></td>',
                              '<td><span class="badge">0</span></td>',
                              '<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>'
            ].join('');
            $('#quetemple').append(tplArr);
        },
        getFormData: function() {
            this.title = $('.examTitle').val();
            this.description = $('.description').val();
            this.startTime = $('.startTime').val();
            this.endTime = $('.endTime').val();
        },
        validForm: function() {
            this.getFormData();
            if(!this.title || !this.startTime || !this.endTime) {
                utils.setTips('warning', '带有 * 的为必填项！');
                return false;
            }
            if(this.startTime > this.endTime) {
                utils.setTips('warning', '开始时间不能大于结束时间！');
                return false;
            }
            return true;
        },
        getExamInfoById: function(id) {
            var _this = this;
            utils.ajax(url.SELECT_EXAM_BYID, {examId: id}, function(result) {
                _this.title = result.data[0].title;
                _this.description = result.data[0].description;
                _this.startTime = result.data[0].startTime;
                _this.endTime = result.data[0].endTime;
            })
        },
        setForm: function() {
            $(".examTitle").val(this.title);
            $(".description").val(this.description);
            $(".startTime").val(this.startTime);
            $(".endTime").val(this.endTime);
        },
        clearForm: function() {
            $(".examTitle").val('');
            $(".description").val('');
            $(".startTime").val('');
            $(".endTime").val('');            
        },
        submitForm: function(types) {
            var data = {
                title : this.title,
                startTime : this.startTime,
                endTime :this.endTime,
                description : this.description
            };
            var _this = this;
            if(this.validForm()){
                utils.ajax(url.INSERT_EXAM, data, function(result){
                    if(result.status){
                        switch (types) {
                            case 'justSave':
                                utils.setTips('success', '添加成功！');
                                window.location.href = 'exam.html';
                                break;
                            case 'saveEdtor':
                                utils.setTips('success', '添加成功！');
                                break;
                            case 'saveAdd':
                                utils.setTips('success', '添加成功！');
                                _this.clearForm();
                                break;
                        }
                    }
                    else {
                        utils.setTips('warning', '添加失败！');
                    }
                }, {type: 'post'})
            }
        },
        updateForm: function() {
            var data = {
                examId: this.examId,
                title: this.title,
                startTime: this.startTime,
                endTime:this.endTime,
                description: this.description
            };
            var _this = this;
            if(this.validForm()){
                utils.ajax(url.UPDATE_EXAM, data, function(result){
                    if(result.status){
                        switch (types) {
                            case 'justSave':
                                utils.setTips('success', '修改成功！');
                                window.location.href = 'exam.html';
                                break;
                            case 'saveEdtor':
                                utils.setTips('success', '修改成功！');
                                break;
                            case 'saveAdd':
                                utils.setTips('success', '修改成功！');
                                _this.clearForm();
                                break;
                        }
                    }
                    else {
                        utils.setTips('warning', '修改失败！');
                    }
                }, {type: 'post'})
            }
        }
    };
    linkageMenu.setCourse();
    utils.initDateTimePicker('datepickers');


    // update page init
    var query = utils.getQueryObject();
    if(query.id) {
        $('.pageName').html('修改考试');
        program.examId = query.id;
        program.getExamInfoById(this.examId);
        program.setForm();
    }
    
    $(".addTemplate").click(function(){
        program.addQuesTpl();
        utils.initDateTimePicker('datepickers');
        linkageMenu.setCourse();
    });

    $('.courseName').on('change', function(){
        linkageMenu.onchange();
    });

    $('.save').on('click', function() {
        var types = this.id;
        if(!program.examId) {
            program.submitForm(types);
        }
        else {
            program.updateForm();
        }
    });
    $('#quetemple').on('change','.knowName,.level,.protime', function(){
        // console.log($(this).parents().eq(1).find('.badge').text(4));
        var data = {};
        var _this = $(this);
        utils.ajax(url.PROBLEM_LIST, data, function(result) {
            _this.parents().eq(1).find('.badge').text(result.total)
        })
    })
    //delete current tr ele
    $("tbody").on("click", ".glyphicon-remove", function(event){
        // tips: eq(0) sames to ele.parent...
        $(this).parents().eq(1).remove();
    });
});