define(function (require) {

    'use strict';
    var xhr = function (method, url, params, isasync, callback) {
        var request = new XMLHttpRequest();
        var that = this;
        // request.open(method, url + "&__rnd=" + (new Date).valueOf(), isasync);
        request.open(method, url, isasync);
        if (method.toLowerCase() === 'post') {
            // request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        }
        request.onload = function () {
            if (request.status === 200 && request.readyState === 4) {
                var cb = callback.bind(that, request.responseText);
                cb();
            } else if (request.status === 408) {
                console.log('retrying...');
                that.xhr(method, url, isasync, callback);
            }
        };
        request.onerror = function () {};
        request.send(JSON.stringify(params));
    };

    var ajax = {};
    ajax.x = function() {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        var versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];

        var xhr;
        for(var i = 0; i < versions.length; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {
            }
        }
        return xhr;
    };

    ajax.send = function(url, cb, method, data, sync) {
        var x = ajax.x();
        x.open(method, url, sync);
        x.onreadystatechange = function() {
            if (x.readyState == 4) {
                cb(x.responseText)
            }
        };
        if (method == 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };

    ajax.get = function(url, data, cb, sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url + (query.length ? '?' + query.join('&') : ''), cb, 'GET', null, sync)
    };

    ajax.post = function(url, data, cb, sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url, cb, 'POST', query.join('&'), sync)
    };

    return ajax;

});
