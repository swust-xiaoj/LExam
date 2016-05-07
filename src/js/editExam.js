define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('datetimepicker');
    var linkageMenu = require('biz/linkageMenu.js');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var flag = 1;
    window.flag = flag;

    var program ={
        order: 1,
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        examId: '',
        addTemplate: function() {
            var tplArr = ['<tr><td><select class="form-control courseName" id="courseName-'+flag+'"><option>课程</option></select></td>',
                              '<td><select class="form-control knowName courseName-'+flag+'"><option>知识点</option></select></td>',
                              '<td><select class="form-control level level-'+flag+'">',
                                  '<option>难度</option>',
                                  '<option value="0">Easy</option>',
                                  '<option value="1">Normal</option>',
                                  '<option value="2">Hard</option></select></td>',
                              '<td><input class="form-control datepickers protime protime-'+flag+'" id="protime-'+flag+'"  type="text"  readonly /></td>',
                              '<td><input class="form-control score-'+flag+'" type="text"  value="10" /></td>',
                              '<td><span class="badge">0</span></td>',
                              '<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>'
                            ].join('');
            $('#quetemple').append(tplArr);
            // console.log(tplArr)
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
                _this.knowledgeTotal = result.KnowledgeTotal;
                _this.paramData = result.paramData;
                var length = result.paramTotal;
                for(var i = 0; i < length;i++){
                    var id = "courseName-"+i;
                    if(i==flag){
                        program.addTemplate();
                        $("#"+id).html("<option>课程</option>");
                        for(var k = 0; k < linkageMenu.courseName.length;k++){
                            $("#"+id).append("<option value="+linkageMenu.courseName[k].knowId+">"+linkageMenu.courseName[k].knowName+"</option>");
                        }
                        flag++;
                    }
                    var parentId = result.KnowledgeData[i].parentId;
                    
                    $("#"+id+" option[value='"+parentId+"']").attr("selected",true);
                    for(var j = 0; j < linkageMenu.course.length ; j++){//知识点
                        if(linkageMenu.course[j].parentId == parentId){
                            $(".iknowName").append("<option value="+linkageMenu.course[j].knowId+">"+linkageMenu.course[j].knowName+"</option>");
                        }
                    }
                    $(".courseName-"+i+"  option[value='"+result.KnowledgeData[i].knowId+"']").attr("selected",true);
                    $(".level-"+i+" option[value='"+result.paramData[i].level+"']").attr("selected",true);
                    $(".score-"+i).val(result.paramData[i].score);
                    program.expmIds[i] = result.paramData[i].expmId;
                }
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
        program.getExamInfoById(program.examId);
        program.setForm();
    }
    
    $(".addTemplate").click(function(){
       program.addTemplate();
        var length = linkageMenu.courseName.length;
        for(var i = 0;i<length;i++)
            $("#courseName-" + flag).append("<option value="+linkageMenu.courseName[i].knowId+">"+linkageMenu.courseName[i].knowName+"</option>");
        flag++;
    });

    $('#quetemple').on('change','.courseName', function(){
        console.log(this.id)
        var classname = '.' + this.id;
        $(classname).html('');
        var parentId = $(this).find('option:selected').val();
        if(parentId === '课程'){
            $(classname).html("<option>知识点</option>");
            return ;
        }
        for(var i = 0; i < linkageMenu.course.length ; i++){
            if(linkageMenu.course[i].parentId == parentId){
                $(classname).append("<option value="+linkageMenu.course[i].knowId+">"+linkageMenu.course[i].knowName+"</option>");
            }
        }
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
        flag -= 1;
    });


     $("#queTempla").on('change','.courseName',function(){
        var id = this.id;
        if(id!=""){
        var classname = "."+id;
        $(classname).html("");
        var parentId = $("#"+id+" option:selected").val();
        if(parentId =="课程"){
            $(classname).html("<option>知识点</option>");
            return ;
        }
        for(var i = 0; i < linkageMenu.course.length ; i++){
            if(linkageMenu.course[i].parentId == parentId){
                $(classname).append("<option value="+linkageMenu.course[i].knowId+">"+linkageMenu.course[i].knowName+"</option>");
            }
        }
        }
    });
});