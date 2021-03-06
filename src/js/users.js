define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    require('validate');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var modal = require('ui/modalDialog.js');

    var params = {
        id: 'user',
        title: '用户信息',
        body: '<form id="userInfo" method="post" action="" class="form-horizontal">'
                +  '<div class="form-group">'
                +    '<label class="col-sm-2 control-label">学号</label>'
                +    '<div class="col-sm-5">'
                +      '<input type="text" name="number" id="number" class="form-control studentNum" placeholder="num">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label class="col-sm-2 control-label">姓名</label>'
                +    '<div class="col-sm-5">'
                +      '<input type="text" name="userName" id="userName" class="form-control realName">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label class="col-sm-2 control-label">班级</label>'
                +    '<div class="col-sm-5">'
                +        '<input type="text" name="userClass" id="userClass" class="form-control className">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label class="col-sm-2 control-label">入学年份</label>'
                +    '<div class="col-sm-5">'
                +        '<input type="text" name="inYear" id="inYear" class="form-control term">'
                +    '</div>'
                +  '</div>'
                +  '<div class="form-group">'
                +    '<label class="col-sm-2 control-label">学院</label>'
                +    '<div class="col-sm-5">'
                +         '<input type="text" name="academy" id="academy" class="form-control umid">'
                +    '</div>'
                +  '</div>'
                +'</form>',
        cancelText:'关闭',
        confirmText:'保存',
        cancel: function(){
            // cancel funtion
        },
        confirm:function(){
            $('#userInfo').submit();
            if($('form').valid()){
                $('#user').modal('hide'); 
                program.addUser();
            }
        }
    };
    var newModal  = new modal(params);
    newModal.init();
    
    var program = {
        page:'1',
        userId :'',
        className:'',
        realName:'',
        term:'',
        studentNum:"",
        selectProfile: function() {
            utils.ajax(url.SELECT_PROFILE, {page: program.page, rows: 20}, function(result) {
                program.count = result.total;
                var lisr_render = template('getcontent', result);
                $("#listInfo").empty(); 
                $("#listInfo").append(lisr_render);                
            })
        },
        clearValue: function() {
            $(".studentNum").val("");
            $(".realName").val("");
            $(".className").val("");
            $(".term").val("");
        },
        selectById: function() {
            var _this = this;
            utils.ajax(url.SELECT_PRO_BYID, {usrpfId: program.userId}, function(result) {
                _this.setUserProfile(result.data[0]);
            })
        },
        setUserProfile: function(data) {
            $(".studentNum").val(data.studentNumber);
            $(".realName").val(data.realName);
            $(".className").val(data.className);
            $(".term").val(data.term);
            $(".umid").val(data.umid);
        },
        deleteUser: function(vals) {
            utils.ajax(url.DELETEPROFILE, {ids: vals}, function(result) {
                if(result.status === 1) {
                    utils.setTips('success', '删除成功！');
                    // remove this col...
                }
                else {
                    utils.setTips('danger', '删除失败！');
                }
            });
        },
        updateUser: function() {
            var data = {
                usrpfId : program.userId,
                realName : program.realName,
                className :program.className,
                studentNumber :program.studentNum,
                term : program.term
            };
            var _this = this;
            utils.ajax(url.UPDATE_PROFILE, data, function(result) {
                if (result.status === 1) {
                    utils.setTips('success', '保存成功！');
                    _this.selectProfile();
                }
                else {
                    utils.setTips('danger', '保存失败！');
                }
            }, {type: 'post'});
        },
        addUser: function() {
            var data = {
                usrpfId : program.userId,
                realName : program.realName,
                className :program.className,
                studentNumber :program.studentNum,
                term : program.term
            };
            var _this = this;
            utils.ajax(url.INSERT_PROFILE, data, function(result) {
                if (result.status === 1) {
                    utils.setTips('success', '保存成功！');
                    _this.selectProfile();
                }
                else {
                    utils.setTips('danger', '保存失败！');
                }
            }, {type: 'post'});
        },
        validateForm: function() {
            var rules = {
                number: {
                    required: true,
                    digits: true
                },
                userName: "required",
                userClass: "required",
                inYear: {
                    required: true,
                    date: true
                },
                academy: "required"
            };
            var messages = {
                number: {
                    required: "请输入你的学号",
                    digits: "学号只包含数字"
                },
                userName: "请输入你的姓名",
                userClass: "请输入你的班级",
                inYear:{
                    date: "日期格式不正确",
                    required: "请输入你的入学年份" 
                } ,
                academy: "请输入你的学院"
            }
            utils.formValidate('#userInfo',rules, messages);
        }
    };
    program.selectProfile();
    program.validateForm()
    utils.toggleCheck('check_list', 'listInfo');
    $(".deleteUser").click(function(){
        var valArr = [];
        $(":checkbox[name='title']:checked").each(function(i) {
                    valArr[i] = $(this).val();
        });
        var vals = valArr.join(',');
        if(vals) {
            program.deleteUser(vals);
        }
        else {
            utils.setTips('info', '请先勾选删除项！');
        }
    });
    
    $(".addUser").click(function(){
        $('#user').modal('show'); 
        var id = this.id;
        if(id){
            program.userId = id;
            program.selectById();
        }
    });
    $(".cancelBtn").click(function(){
        program.clearValue();
    });
    $(".saveData").click(function(){
        program.className = $(".className").val();
        program.realName=$(".realName").val();
        program.studentNum=$(".studentNum").val();
        program.term=$(".term").val();
        if(program.userId!=""){
            program.updateUser();
            window.location.reload();
        }else{
            program.addUser();
            window.location.reload();
        }
    });
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