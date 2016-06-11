/**
 * @file The module of tab scroll 
 */

  define(function(require){
        var dom = require('saber-dom');
        var targetScroll=function(paramers){//targetProp
           this.parentNode=dom.query(paramers.parentNode);
           this.targetNode=dom.query(paramers.targetNode);
           this.parentH=parseInt(dom.getStyle(this.parentNode, 'height'));
        }
        targetScroll.prototype={
          init:function(){
              this.autoScroll();
              this.onChangeScroll();
          },
          autoScroll:function(){
               var self=this;
               (window.onload=function(){
                   var scroH = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//this.scrollTop;
                   if(scroH>=self.parentH){
                         dom.setStyle(self.parentNode, 'display', 'none');
                         dom.addClass(self.targetNode, 'tab-shadow');
                   }else if(scroH<self.parentH){
                         dom.setStyle(self.parentNode, 'display', 'block');
                         dom.removeClass(self.targetNode, 'tab-shadow');
                   }
               })()
          },
          onChangeScroll:function(){
               var self=this;
               (window.onscroll=function(){
                   var scroH = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//this.scrollTop();
                       dom.setStyle(self.parentNode, 'display', 'block');
                       dom.removeClass(self.targetNode,'tab-shadow');
                   if(scroH>=self.parentH){
                       dom.setStyle(self.parentNode, 'display', 'none')
                       dom.addClass(self.targetNode, 'tab-shadow');
                   }else if(scroH<self.parentH){
                       dom.setStyle(self.parentNode, 'display', 'block');
                       dom.removeClass(self.targetNode, 'tab-shadow');
                   }
              })()
          }
        }
        return targetScroll;
 })
