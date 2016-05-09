define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('ueditor_config');
    require('ueditor');
    require('fileupload');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var linkageMenu = require('biz/linkageMenu.js');
    var modal = require('ui/modalDialog.js');

    var params = {
        id: 'upload',
        title: '添加测试数据',
        body: '<div class="input-group col-md-8">'
                +    '<input type="text" class="form-control testdata" placeholder="支持格式：zip" disabled>'
                +    '<span class="input-group-btn">'
                +    '<input type="file" id="datafile" name="zip" style="display: none">'
                +       '<a class="btn btn-info file" onclick=$("input[id=datafile]").click();>上传</a>'
                +  '</span></div>',
        cancelText:'关闭',
        confirmText:'保存',
        cancel: function(){
           //.
        },
        confirm:function(){
            program.uploadByFile();
            window.location.reload();
        }
    };
    var newModal  = new modal(params);
    newModal.init();
    var program = {
        date:'',
        title :'',
        probId :'',
        totalSubmit :'',
        acedNum :'',
        level :'',
        limitTime :'',
        limitMemory :'',
        description :'',
        inputTip:'',
        outputTip :'',
        inputSample : '',
        outputSample : '',
        standardSource :'',
        testdataNum :'',
        course:[],
        knowName:'',
        content :"",
        addProblem:function(id){
            var _this = this;
            var data = {
                "problemInfo.title" :program.title,
                "problemInfo.createTime":program.date,
                "problemInfo.level" :program.level,
                "problemInfo.limitTime" :program.limitTime,
                "problemInfo.limitMemory" :program.limitMemory,
                "problemInfo.testdataNum" :program.testdataNum,
                "problemInfo.description" :program.description,
                "problemInfo.inputTip" :program.inputTip,
                "problemInfo.outputTip" :program.outputTip,
                "problemInfo.inputSample" :program.inputSample,
                "problemInfo.outputSample" :program.outputSample,
                "problemInfo.standardSource" : program.standardSource,
                 know_id :program.knowName
            };
            utils.ajax(url.INSERT_PROBLEM, data, function(result) {
                if(result.status=='1' && id=="justSave") {
                    utils.setTips('success', '添加成功！');
                    window.location.href="problem.html";
                }else if(result.status=='1' && id=="saveEdtor") {
                    utils.setTips('success', '添加成功！');
                }else if (result.status=='1' && id=="saveAdd") {
                    utils.setTips('success', '添加成功！');
                }
                else {
                    utils.setTips('warning', '保存失败！');
                }
            }, {type: 'post', errorCallback: function() {
                utils.setTips('warning', '请求失败！');
                _this.clearFormData();
            }});
        },
        clearFormData: function (){
            $(".ptitle").val("");
            ue.setContent("");
            $(".inputTip").val("");
            $(".outputTip").val("");
            $(".inputSample").val("");
            $(".outputSample").val("");
            $(".standardSource").val(""); 
        },
        getProById:function(){
            utils.ajax(url.SELECT_PROBLEM, {'problemInfo.probId': program.probId}, function(result) {
                program.content = result.data[0];
            },{errorCallback: function() {
                utils.setTips('info', '请求错误！');
            }});
        },
        getFormData: function() {
            program.title = $(".ptitle").val();
            program.limitTime = $(".limitTime").val();
            program.limitMemory = $(".limitMemory").val();
            program.level = $(".level option:selected").val();
            program.knowName = $(".knowName option:selected").val();
            program.description = ue.getContent();
            program.inputTip = $(".inputTip").val();
            program.outputTip = $(".outputTip").val();
            program.inputSample = $(".inputSample").val();
            program.outputSample = $(".outputSample").val();
            program.standardSource =$(".standardSource").val();
            program.date = utils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            if (program.title
            && program.description
            && program.knowName
            && program.inputSample
            && program.inputTip
            && program.outputSample
            && program.outputTip) {
                return true;
            }
            else {
                return false;
            }
        },
        updateProblem: function(id) {
            var _this = this;
            var data = {
                "problemInfo.probId": program.probId,
                "problemInfo.title": program.title,
                "problemInfo.createTime": program.date,
                "problemInfo.level": program.level,
                "problemInfo.limitTime": program.limitTime,
                "problemInfo.limitMemory": program.limitMemory,
                "problemInfo.testdataNum": program.testdataNum,
                "problemInfo.description": program.description,
                "problemInfo.inputTip": program.inputTip,
                "problemInfo.outputTip": program.outputTip,
                "problemInfo.inputSample": program.inputSample,
                "problemInfo.outputSample": program.outputSample,
                "problemInfo.standardSource": program.standardSource,
                 know_id: program.knowName
            };
            utils.ajax(url.UPDATE_PROBLEM, data, function(result) {
                if(result.status=='1' && id=="justSave"){
                    utils.setTips('success', '修改成功!');
                    window.location.href="problem.html";
                }
                else if(result.status=='1' && id=="saveEdtor") {
                    utils.setTips('success', '修改成功！');
                }
                else if(result.status=='1' && id=="saveAdd") {
                    utils.setTips('success', '修改成功！');
                    _this.clearFormData();
                }
                else {
                    utils.setTips('warning', '修改失败！');
                }
            }, {type: 'post', errorCallback: function() {
                utils.setTips('warning', '修改失败！');
            }});
        },
        setFormData: function() {
            $(".ptitle").val(program.content.title);
            $(".limitTime").val(program.content.limitTime);
            $(".limitMemory").val(program.content.limitMemory);
            $(".level option[value='"+program.content.level+"']").attr("selected",true);
            ue.ready(function() {
                ue.setContent(program.content.description);
            });
            $(".inputTip").val(program.content.inputTip);
            $(".outputTip").val(program.content.outputTip);
            $(".inputSample").val(program.content.inputSample);
            $(".outputSample").val(program.content.outputSample);
            $(".standardSource").val(program.content.standardSource);
        },
        getKnowById: function() {
            utils.ajax(url.SELECT_PROBLEM, {'problemInfo.probId': problem.probId}, function(result) {
                program.content = result.data[0];
            },{erroCallback: function() {
                utils.setTips('info', '请求错误！');
            }});
        },
        uploadByFile: function(){
            $.ajaxFileUpload({
                url: url.INSERT_PROBLEMDATA,
                secureuri: false,
                fileElementId: 'datafile',
                dataType: 'json',
                data: {
                    probId: program.probId
                },
                success: function(data, status) {
                    if(data.status) {
                        utils.setTips('success', '添加成功！');
                        $('#upload').modal('hide');
                    }
                },
                error: function() {
                    utils.setTips('warning', '添加失败！');
                }
            })
        },
        uploadByForm: function() {
            var data = {
                probId: program.probId,
                input: program.input,
                output: program.output
            }
            utils.ajax(url.INSERT_PROBLEMDATA, data, function(result) {
                utils.setTips('success', '成功！')
            },{erroCallback: function() {
                utils.setTips('info', '请求错误！');
            }, type: 'post', istradi:true})
        },
        change:function(tagert , className){
            $(tagert).change(function() {
                var path = $(this).val();
                var path1 = path.lastIndexOf("\\");
                var name = path.substring(path1 + 1);
                $(className).val(name);
            });
        },
        saveTestData: function() {
            var index = $(".testdatatotal option:selected").val();
            var input = $(".testDataInput").val();
            var output = $(".testDataOutput").val();
            program.input[index] = input;
            program.output[index] = output; 
        },
        showTestData: function() {
            utils.ajax(url.SELECT_PROBLEMDATA, {probId: program.probId}, function(result) {
                var len = result.total;
                for(var i = 0; i < len; i++){
                    $(".testdatatotal").append('<option>'+i+'</option>');
                    program.input.push(result.input[i]);
                    program.output.push(result.output[i]);
                }
            }, {errorCallback: function(){
                utils.setTips('warning', '请求失败！');
            }})
        }
    };
    // page init  
    linkageMenu.setCourse();
    program.change('input[id=datafile]', '.testdata');
    
    utils.toggleCheck('check_list', 'listInfo');

    var ue = UE.getEditor('description', {
       initialFrameWidth:550 ,//初始化编辑器宽度,默认1000
       initialFrameHeight:300  //初始化编辑器高度,默认320
    });
    var par = utils.getQueryObject();
    if(par.id){
        $(".pageName").text("修改问题");
        program.probId = par.id;
        program.getProById();
        program.setFormData();
        program.showTestData();
        $(".formTest").click(function(){
            $('#upload').modal('show');
        }); 
    }
    else {
        $('.testDataByForm').hide()
    }
    // DOMEvent
    $(".save").click(function(){
        if(program.getFormData()) {
            var id = this.id;
            if(program.probId==""){
                program.addProblem(id);
            }
            else {
                program.updateProblem(id);
            }
        }
        else {
            utils.setTips('danger', '必填字段请填写完整！');
        }
    });
    $(".saveTestData").click(function(){
        program.saveTestData();
    });
    $(".testdatatotal").change(function(){
        var index = $(".testdatatotal option:selected").val();
        if(index=="选择参数" || index==""){
            $(".testDataInput").val("");
            $(".testDataOutput").val("");
        }
        else {
            $(".testDataInput").val(program.input[index]);
            $(".testDataOutput").val(program.output[index]);
        }
    });
    $('.courseName').on('change', function(){
        linkageMenu.onchange();
    });
});