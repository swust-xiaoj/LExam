/**
 * @file 全局系统消息提示
 */

define(function (require) {
    var widget = require('saber-widget');

    require('../widget/Alert');

    return widget.alert(
        null, 
        {
            className: 'global-alert',
            showClass: 'global-alert-show',
            maskClass: 'global-alert-mask',
            hideDelay: 3
        }
    );
});
