define(function(require){
    var utils = require('biz/utils.js');
    var url = require('biz/url.js');
    var program = {
        login: function() {
            var _this = this;
            var data = this.getFormData();
            utils.ajax(url.LOGIN, data, function(result) {
                if(!result.status) {
                    // login failed;
                }
                else{
                    if(result.isAdmin){
                        window.location.href = 'index.html';
                    }
                    else {
                        window.location.href = 'index.html';
                    }
                }
            },{type: 'post', errorCallback: function() {
                // login failed
                _this.clearForm();
            }})
        },
        getFormData: function() {
            var data = {};
            data['username'] = $('#username').val();
            data['password'] = $('#password').val();
            if(this.validData())
                return data;
        },
        clearForm: function() {
            $('#username').val('');
            $('#password').val('');
        },
        validData: function(data) {
            // ...
            return true;
        }
    };

    // dom events
    $('#login-btn').on('click', function() {
        $('#myForm').validator()
        program.login();
    })
})