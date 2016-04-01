define(function(require){
    var modal = function(params){
        this.id          = params.id || '';
        this.container   = params.container || document.getElementsByTagName('body')[0];
        this.title       = params.title || '';
        this.body        = params.body || '';
        this.cancelText  = params.cancelText || '取消';
        this.confirmText = params.confirmText || '确认';
        this.cancel      = params.cancel || null;
        this.confirm     = params.confirm || null;
    };
    var prop = modal.prototype;
    prop.view = function() {
        var tpl = '';
        tpl += '<div class="modal fade" id="' + this.id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">'
            +     '<div class="modal-dialog" role="document">'
            +        '<div class="modal-content">'
            +          '<div class="modal-header">'
            +            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            +            '<h4 class="modal-title" id="myModalLabel">' + this.title + '</h4>'
            +          '</div>'
            +          '<div class="modal-body">' + this.body + '</div>'
            +          '<div class="modal-footer">'
            +            '<button type="button" class="btn btn-default cancelBtn" data-dismiss="modal">' + this.cancelText + '</button>'
            +            '<button type="button" class="btn btn-primary confirmBtn">' + this.confirmText + '</button>'
            +          '</div>'
            +        '</div>'
            +      '</div>'
            +    '</div>';
        var tmpEle = document.createElement('div');
        tmpEle.innerHTML = tpl;
        return tmpEle.children[0];
    };
    prop.init = function() {
        var modal = this.modal = this.view();
        var _this = this;
        this.container.appendChild(modal);

        var confirmBtn, cancelBtn;
        if (this.cancel) {
            cancelBtn = modal.getElementsByClassName('cancelBtn')[0];
            cancelBtn.addEventListener('click', function() {
                _this.cancel(modal);
                // _this.destory();
            });
        }
        if (this.confirm) {
            confirmBtn = modal.getElementsByClassName('confirmBtn')[0];
            confirmBtn.addEventListener('click', function() {
                _this.confirm(modal);
                // _this.destory();
            });
        }
    };
    prop.destory = function(){
        this.container.removeChild(this.modal);
    };
    return modal;
})