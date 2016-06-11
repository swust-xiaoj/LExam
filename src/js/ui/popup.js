define(function (require) {

    function popup(params) {
        this.container = params.container;
        this.title = params.title || '';
        this.customClass = params.customClass || '';
        this.type = +params.type;
        this.content = params.content || '';
        this.confirmText = params.confirmText|| '';
        this.cancelText = params.cancelText|| '';
        this.cancel = params.cancel || null;
        this.confirm = params.confirm || null;
    }

    popup.prototype.view = function(){
        var popwin = document.createElement('div');
        var popClass = this.customClass ? 'popwin ' + this.customClass : 'popwin'; 
            popwin.setAttribute('class', popClass);
        var str = '';
            str+='<div class="pop-shadow"></div>';
            str+='<div class="pop-card">';
            if (this.title) {
                str+='<div class="pop-header">';
                str+='<span class="pop-title">'+this.title+'</span>';
                str+='<span class="pop-close">X</span>';
                str+='</div>';
            };
            str+='<div class="card-contents">';
            str+='<div class="card-input">';
            if (this.type === 2 ) {
                str+='<i class="mark"></i>'+this.content+'';
            } else {
                str+= ''+this.content+'';
            };
            str+='</div>';
            str+='</div>';
            str+='<div class="card-buttons">';
            if (this.cancelText) {
                str+='<span class="cancel_btn">' + this.cancelText + '</span>';
            };
            if (this.confirmText) {
                str+='<span class="confirm_btn">' + this.confirmText +'</span>';
            };
            str+='</div>';
            str+='</div>';
        popwin.innerHTML = str;
        return popwin;
    };

    popup.prototype.init = function() {
        var popwin = this.popwin = this.view();
        var that = this;
        this.container.appendChild(popwin);

        var confirmBtn, cancelBtn;
        if (this.cancelText && this.cancel) {
            cancelBtn = popwin.getElementsByClassName('cancel_btn')[0];
            cancelBtn.addEventListener('click', function() {
                that.cancel(popwin);
                that.destory();
            });
        };
        if (this.confirmText && this.confirm) {
            confirmBtn = popwin.getElementsByClassName('confirm_btn')[0];
            confirmBtn.addEventListener('click', function() {
                that.confirm(popwin);   
                that.destory();
            });
        };
    };

    popup.prototype.destory = function(){
        this.container.removeChild(this.popwin);
    };

    return popup;
});
