define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('paginator');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    
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
        }
    };

    program.selectProfile();
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
        var id = this.id;
        if(id){
            program.userId = id;
            program.selectById();
        }
        $('#user').modal({
             backdrop : 'static'
        });
    });
    $(".closebutton").click(function(){
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
});