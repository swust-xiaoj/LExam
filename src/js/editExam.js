define(function (require, exports, module) {
    require('jquery');
    require('bootstrap');
    require('datetimepicker');
    var template = require('artTemplate');
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');

    $('.datepickers').datetimepicker({
        format: 'yyyy-mm-dd hh:ii:ss',
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left"
    });
    // $('.datepickers').datepicker('place');
    var program ={
        title: '',
        startTime: '',
        endTime: '',
        description: '',
        addQuesTpl: function() {
            var tplArr = ['<tr><td><select class="form-control courseName"></select></td>',
                              '<td><select class="form-control knowName"></select></td>',
                              '<td><select class="form-control level">',
                                  '<option value="0">Easy</option>',
                                  '<option value="1">Normal</option>',
                                  '<option value="2">Hard</option></select></td>',
                                '<td><input class="form-control datepickers"  type="text"  readonly /></td>',
                                '<td><input class="form-control datepickers"  type="text"  readonly /></td>',
                                '<td><input class="form-control"  type="text"  value="10" /></td>',
                                '<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td></tr>'
            ].join('');
            $('#quetemple').append(tplArr);
        },
        removeQuesTpl: function() {

        },
        appendCourseAndKnowledge: function(){
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
                }
                for(var i = 0; i < len; i++){
                    if (result.data[i].parentId === curId) {
                        knowHTML.push("<option value="+result.data[i].knowId+">"+result.data[i].knowName+"</option>");
                    }                        
                }
                $('.courseName').html(courseHTML.join(''));
                $('.knowName').html(knowHTML.join(''));
            })
        }
    };
    program.appendCourseAndKnowledge();
    // program.deleteIt();
    
    $(".addTemplate").click(function(){
        program.addQuesTpl();
        program.appendCourseAndKnowledge();
    });
    //delete current tr ele
    $("tbody").on("click", ".glyphicon-remove", function(event){
        // tips: eq(0) sames to ele.parent...
        $(this).parents().eq(1).remove()
    });
});