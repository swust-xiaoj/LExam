define(function(require){
    require('jquery');
    var url =  require('biz/url.js');
    var utils = require('biz/utils.js');
    var template = require('artTemplate');
    var modal = require('ui/modalDialog.js');

    var params = {
        id: 'courseKnow',
        title: '课程信息',
        body: '<form id="courseInfo" method="post" action="" class="form-horizontal">'
                +  '<div class="form-group">'
                +    '<label class="col-sm-2 control-label">是否课程</label>'
                +    '<div class="col-sm-5">'
                +      '<select class="form-control choose">'
                +         '<option value="0">否</option>'
                +         '<option value="1">是</option>'
                +      '</select>'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group isknow">'
                +    '<label class="col-sm-2 control-label"><span class="require">*</span>课程</label>'
                +    '<div class="col-sm-5">'
                +      '<select class="form-control courseName" name="courseName" id="courseName">'
                +        '<option value="">选择课程</option>'
                +      '</select>'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group isknow">'
                +    '<label class="col-md-2 control-label"><span class="require">*</span>知识点</label>'
                +    '<div class="col-sm-5">'
                +        '<input type="text" name="knowpoint" id="knowpoint" class="form-control knowName">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group isCourse">'
                +    '<label class="col-md-2 control-label"><span class="require">*</span>课程名</label>'
                +    '<div class="col-sm-5">'
                +        '<input type="text" name="coursepoint" id="coursepoint" class="form-control coursepoint">'
                +    '</div>'
                +  '</div>'
                +'</form>',
        cancelText:'关闭',
        confirmText:'保存',
        cancel: function(){
            // cancel funtion
        },
        confirm:function(){
            program.validateForm()
            $('#courseInfo').submit();
            if($('form').valid()){
                $('#courseKnow').modal('hide'); 
                program.addKnowledge();
            }
        }
    };
    var newModal  = new modal(params);
    newModal.init();

    var program = {
        initKnowledge: function() {
            utils.ajax(url.SELECTKNOWLEDGE, {}, function(result) {
                var length = result.total;
                    $("#listInfo").empty();
                    program.courseName = [];
                    program.sumList = [];
                    program.course = [];
                    for(var i = 0 ; i < length ; i++){
                        if(result.data[i].isCourse){
                            program.courseName.push(result.data[i]);
                        }else{
                            program.course.push(result.data[i]);
                            program.sumList.push(result.sumList[i]);
                        }
                    }               
                    program.courselength = program.courseName.length;
                    var knowlength = program.course.length;
                    for(var i = 0; i <program.courselength;i++){
                        $("#listInfo").append('<div class="media"><div class="media-body">' +
                                '<h4 class="media-heading">'+program.courseName[i].knowName+'</h4><div class="row" id="'+program.courseName[i].knowId+'"></div></div></div>');
                    
                    for(var j = 0; j <knowlength;j++){
                        if(program.course[j].parentId == program.courseName[i].knowId){
                            $("#"+program.courseName[i].knowId).append('<div class="col-md-3"><div class="checkbox">' +
                                    '<label><input type="checkbox" name="title" id="'+program.course[j].knowId+'"><a href="problem.html?id='+program.course[j].knowId+'">'+program.course[j].knowName+'</a>('+program.sumList[j]+')</label></div></div>');
                        }
                    }
                }
            })
        },
        addKnowledge: function(){
            var data = {
                "knowledge.knowName" : program.kName,
                "knowledge.isCourse" : program.chval,
                "knowledge.parentId" : program.parentId
            };
            var _this = this;
            utils.ajax(url.INSERT_KNOWLEDGE, data, function(result){
                if(result.status){
                    utils.setTips('success', '添加成功！');
                    _this.initKnowledge();
                }
                else {
                    utils.setTips('warning', '添加失败！');
                }
            })
        },
        deleteKnowledge: function(){
            var _this = this;
            utils.ajax(url.DELETE_KNOWLEDGE,{knowIds: _this.kIds}, function(result){
                if(result.status){
                    utils.setTips('success', '删除成功！')
                    _this.initKnowledge()
                }
                else{
                    utils.setTips('warning', '删除失败！');
                }
            })
        },
        validateForm: function() {
            chval = $(".choose option:selected").val();
            var rules1 = {
                courseName: "required",
                knowpoint: "required",
            };
            var messages1 = {
                courseName: "请选择课程！",
                knowpoint: "请填写知识点名！",
            }
            var rules2 = {
                coursepoint: 'required'
            }
            var messages2 = {
                coursepoint: '请填写课程名！'
            }
            if(chval === '1'){
                utils.formValidate('#courseInfo',rules2, messages2); 
            }
            else if(chval === '0'){
                utils.formValidate('#courseInfo',rules1, messages1); 
            }
        }
    };
    program.initKnowledge();
    // program.validateForm()s

    $('.addknow').on('click', function(){
        $('#courseKnow').modal('show');
        for(var i = 0; i < program.courselength;i++){
            $(".courseName").append("<option value="+program.courseName[i].knowId+">"+program.courseName[i].knowName+"</option>");
        }
    });
    $('.deleteknow').on('click', function(){
        var idArr = [];
        $(':checkbox[name="title"]:checked').each(function(index){
            idArr[index] = this.id;
        });
        program.kIds = idArr.join(',');
        if(program.kIds){
            program.deleteKnowledge();
        }
        else{
            utils.setTips('info', '请选择删除项！')
        }
    })
    $(".isCourse").hide();
    $(".choose").on('change', function(){
            program.chval = $(".choose option:selected").val();
            if(program.chval==1){
                $(".isCourse").show();
                $(".isknow").hide();
            }else{
                $(".isCourse").hide();
                $(".isknow").show();
            }
    });
})