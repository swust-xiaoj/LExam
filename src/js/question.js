define(function (require, exports, module) {
        require('jquery');
        require('bootstrap');
        require('ueditor_config');
        require('ueditor');
        var utils = require('biz/utils.js');
        var url = require('biz/url.js');
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
            getCourseName: function() {
                var _this = this;
                utils.ajax(url.SELECTKNOWLEDGE, {}, function(result) {
                    var len = result.total;
                    var curId = '', courseHTML = [], knowHTML = [], flag = 0;
                    for(var i = 0; i < len; i++) {
                        if (result.data[i].isCourse === 1) {
                            if(!flag){
                                curId = result.data[i].knowId;
                                flag = 1;                        
                            }
                            courseHTML.push('<option value=' + result.data[i].knowId + '>' + result.data[i].knowName + '</option>');
                        }
                        if (result.data[i].isCourse === 1) {
                            _this.course.push(result.data[i]);
                        }
                    }
                    for(var i = 0; i < len; i++){
                        if (result.data[i].parentId === curId) {
                            knowHTML.push("<option value="+result.data[i].knowId+">"+result.data[i].knowName+"</option>");
                        }                        
                    }
                    $('.courseName').html(courseHTML.join(''));
                    $('.knowName').html(knowHTML.join(''));
                })   
            },
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
                }, {type:'post',errorCallback: function() {
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
            }
        getProById:function(){
             $.ajax({
                type : "get",
                content : "application/x-www-form-urlencoded;charset=UTF-8",
                url:"../../mock/selectProblem.json",     
                dataType : 'json',
                async : false,
                data:{
                    "problemInfo.probId" : program.probId 
                },
                success:function(result){ 
                     console.log(result.data[0]);
                    program.content = result.data[0];
                },error:function(){
                   // pubMeth.alertInfo("alert-info","请求错误");
                }
            });
        },
        getQueryObject:function () {
           var  url = window.location.href;
            var search = url.substring(url.lastIndexOf("?") + 1);
            var obj = {};
            var reg = /([^?&=]+)=([^?&=]*)/g;
            search.replace(reg, function (rs, $1, $2) {
                var name = decodeURIComponent($1);
                var val = decodeURIComponent($2);                
                val = String(val);
                obj[name] = val;
                return rs;
            });
            return obj;
        },
        getValue:function(){
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
            program.date = program.getNowFormatDate();
            if(program.title!=""&&program.description!=""&&program.knowName!=""&&program.inputSample!=""
            &&program.inputTip!=""&&program.outputSample!=""&&program.outputTip!=""){
                    return true;
            }else{
                return false;
            }
        },
        updateProblem:function(id){
             $.ajax({
                        type : "post",
                        content : "application/x-www-form-urlencoded;charset=UTF-8",
                        url:"../problem/updateProblem",     
                        dataType : "json",
                        async : false,
                        data:{
                            "problemInfo.probId" :program.probId,
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
                        },
                        success:function(result){ 
                            console.log(result);
                            if(result.status=='1' && id=="justSave"){
                                // pubMeth.alertInfo("alert-success","修改成功");
                                window.location.href="problem.html";
                            }else if(result.status=='1' && id=="saveEdtor"){
                                // pubMeth.alertInfo("alert-success","修改成功");
                            }else if (result.status=='1' && id=="saveAdd"){
                                 // pubMeth.alertInfo("alert-success","修改成功");
                                 $(".ptitle").val("");
                                 ue.setContent("");
                                 $(".inputTip").val("");
                                 $(".outputTip").val("");
                                 $(".inputSample").val("");
                                 $(".outputSample").val("");
                                 $(".standardSource").val("");
                            }
                            else{
                                // pubMeth.alertInfo("alert-warning","修改失败！");
                            }
                        },
                        error:function(){
                            // pubMeth.alertInfo("alert-warning","请求失败！");
                        }
                    });
        },
        setValue:function(){
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
        getNowFormatDate:function () {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();
            return currentdate;
            },
            getKnowById:function(){
                     $.ajax({
                        type : "get",
                        content : "application/x-www-form-urlencoded;charset=UTF-8",
                        url:"../../mock/selectProblem.json",     
                        dataType : 'json',
                        async : false,
                        data:{
                            "problemInfo.probId" : program.probId 
                        },
                        success:function(result){ 
                             console.log(result.data[0]);
                            program.content = result.data[0];
                        },error:function(){
                           // pubMeth.alertInfo("alert-info","请求错误");
                        }
                    });
            }
        };  
        program.getCourseName();
        var  ue = UE.getEditor('description', {
           initialFrameWidth:550 ,//初始化编辑器宽度,默认1000
           initialFrameHeight:300  //初始化编辑器高度,默认320
        });
        var par = program.getQueryObject();
        if(par.id){
                $(".pageName").text("修改问题");
                program.probId = par.id;
                program.getProById();
                program.setValue();
        }
        $(".save").click(function(){
            if(program.getValue()){
                 var id = this.id;
                 if(program.probId==""){
                 program.addProblem(id);
                 }else{
                    program.updateProblem(id);
                 }
            }else{
                // pubMeth.alertInfo("alert-danger","必填字段请填写完整！");
            }
        });
        $(".courseName").change(function(){
            $(".knowName").html("");
            var parentId = $(".courseName option:selected").val();
            for(var i = 0; i < program.course.length ; i++){
                if(program.course[i].parentId == parentId){
                    $(".knowName").append("<option value="+program.course[i].knowId+">"+program.course[i].knowName+"</option>");
                }
            }
        });
});