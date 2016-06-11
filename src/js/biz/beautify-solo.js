/**
 * @file 单行省略号显示问题    
 */

define(function (require) {

    var dom = require('saber-dom');

    var cache = [];

    var body = document.querySelector('body');

    var winWidth = 0;

    var isOrientationSuported = 'onorientationchange' in window
        , rotateEvent = isOrientationSuported ? 'orientationchange' : 'resize';


    /*
     *只能声明一次实例 , 需要添加更多请通过addOne添加
     */
    function SoloBeautify(selector, sizeTune){

        diableRotate();

        cache.length = 0;

        var doms = dom.queryAll(selector);

        var size = doms.length
            , node = null;

        if(size > 0){
            winWidth = body.offsetWidth;
            for(var i = 0; i < size; ++i){
                node = doms[i];
                this._addOneNode(node, sizeTune);
                this._tuneNode(node, sizeTune);
            }
            enableRotate();
        }

    }

    var SlbtProto = SoloBeautify.prototype;

    SlbtProto._addOneNode = function(node, sizeTune){
        cache.push({
            dom: node
            , tune: sizeTune
        });
    };

    SlbtProto._tuneNode = function(node, sizeTune){
        node.style.width = (winWidth + sizeTune) + 'px';
    };


    SlbtProto.addOne = function(node, sizeTune){
        this._addOneNode(node, sizeTune);
        this._tuneNode(node, sizeTune);
        if(cache.length === 1){
            enableRotate();
        }
    };

    SlbtProto.removeOne = function(node){
        var size = cache.length
            , item = null;
        for(var i = 0; i < size; ++i){
            item = cache[i];            
            if(item['dom'] === node){
                cache.splice(i, 1);
                node.style.width = '';
                break;
            }
        }

        if(!cache.length){
            diableRotate();
        }
        
    }

    SlbtProto.clearAll = function(){
        cache.length = 0;
        diableRotate();
    };


    function tuneAll(){
        setTimeout(function(){
            var size = cache.length
                , item = null;

            winWidth = body.offsetWidth;

            for(var i = 0; i < size; ++i){
                item = cache[i] 
                item['dom'].style.width = (winWidth + item['tune']) + 'px';
            }
        }, 300);
    } 


    function enableRotate(){
        window.addEventListener(rotateEvent, tuneAll);
    };

    function diableRotate(){
        window.removeEventListener(rotateEvent, tuneAll);
    };
    

    return SoloBeautify;

});
