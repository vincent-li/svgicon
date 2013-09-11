KISSY.add('components/smarticon/index', function(S, Brick, Raphael) {
    function SmartIcon() {
        SmartIcon.superclass.constructor.apply(this, arguments);
    }

    SmartIcon.ATTRS = {
        name : {
            value : ''
        },
        n : {
            value : ''
        },
        size : {
            value : '32'
        },
        s : {
            value : '32'
        },
        color : {
            value : 'original'
        },
        c : {
            value : 'original'
        },
        hovercolor : {
            value : '#000'
        }, 
        hc : {
            value : '#000'
        }, 
        animate : {
            //是否展示动画--def:true false-不展示动画，为静态icon
            value : true
        },
        a : {
            value : true
        },
        loop : {
            vlaue : false
        },
        l : {
            vlaue : false
        },
        iteration : {
            value : false
        },
        i : {
            value : false
        },
        duration : {
            value : false
        },  
        d : {
            value : false
        },
        eventtype : {
            value : 'hover'
        },
        et : {
            value : 'hover'
        },
        onparent : {
            value : true
        },
        op : {
            value : true
        },
        version : {
            value : '201307041020'
        }
    };
   
    S.extend(SmartIcon, Brick, {
        /**
         * 初始化函数，在构造函数内部调用
         */
        initialize: function() {
            var self = this;
            var el = self.get('el');
            this.renderIconUsePagelet();
        },
        /**
         * 组件放置到dom后触发的方法调用
         */
        renderIconUsePagelet: function() {   
            var self = this;
            var config = {};
            config.n = self.get('n') || self.get('name') || 'smart-icon';
            config.s = self.get('s') || self.get('size');
            config.c = self.get('c') || self.get('color'); 
            config.hc = self.get('hc') ||self.get('hovercolor');
            config.a = self.get('a') || self.get('animate');
            config.l = self.get('l') || self.get('loop');
            config.i = self.get('i') || self.get('iteration');
            config.d = self.get('d') || self.get('duration');
            config.et = self.get('et') || self.get('eventtype');
            config.op = self.get('op') || self.get('onparent');
            var el = self.get('el');
            var id = el.attr('id');
            if(!id){
                var date = (new Date()).getTime();
                el.attr('id',config.n+'_'+date);
                id = el.attr('id');
            }
            el.css({width: config.s,height: config.s});
            config.parent = config.op ? el.parent() : false;
            config.scale = config.s / defSize;
            var icondata = self.getStoreData(config.n);
            if(!icondata){
                S.use('components/smarticon/icons/'+config.n,function(S, svgData){
                    if(svgData){
                        self.setStoreData(config.n,svgData);
                        Raphael(id, config.s, config.s).createSmartIcon(id, config, svgData);
                    }
                });
            }else{
                Raphael(id, config.s, config.s).createSmartIcon(id, config, icondata);
            }
        },
        getStoreData : function(icon_n){
            var self = this;
            var d = window['iconData'] || {};
            return d[icon_n] || '';
        },
        setStoreData : function(icon_n,svgData){
            var self = this;
            var d = window['iconData'] || {};
            if(!d[icon_n]){
                d[icon_n] = svgData;
                window['iconData'] = d;
            }
        }
    });
    var svgR = Raphael.svg;
    var vmlR = Raphael.vml;
    var defSize = 32;
    var defDuration = 200;//默认动画持续时间xxx毫秒
    var hoverDuration = 200;//默认hover动画的时间xxx毫秒
    //扩展raphael 方法，根据数据创建svg icon
    Raphael.fn.createSmartIcon = function(id, config, iconData) {
        var paths = [];
        //copy一份svg图像数据
        svgData = S.clone(iconData);
        config.d = config.d || svgData.duration || defDuration;
        var shapeLength = svgData.shapes.length;
        config.i = config.i ? config.i : svgData.iteration;
        var animations = []; //存储每个path的动画
        var attrs = [];//icon初始设置
        var fills = [];//icon的fill颜色
        var spinner = config.scale;
        var parent = config.parent;
        var TRANSFORM = "s" + spinner + "," + spinner + ",0,0";
        //isMorph 标识是否需要变形
        var isMorph = isRoll = false;
        //
        if (config.n.match(/roll/)) {
            isRoll = true;
            var svgAnimate = function() {
                var i = 0;
                if (S.one("#" + id)) {
                    if (!anim) {
                        for (i = 0; i < shapeLength; i++)
                            paths[i].animate(animations[i].repeat(Infinity));
                        anim = true
                    }
                } else if (anim) {
                    for (i = 0; i < shapeLength; i++)
                        paths[i].stop();
                    anim = false;
                }
            }
        }

        //检测变形
        isMorph = config.n.match(/morph/);
        //数据变形及微调
        for (var i = 0; i < shapeLength; i++) {
            var o = svgData.shapes[i].init;
            var key;
            for (key in o){
                o[key].transform = TRANSFORM + o[key].transform
            }
        }
        if (svgR){
            for (var k = 0; k < shapeLength; k++){
                var _f = svgData.shapes[k].frames;
                for (var key in _f){
                    "transform" in _f[key] && (_f[key].transform = TRANSFORM + _f[key].transform);
                }
            }   
        }else{
            for (var k = 0; k < shapeLength; k++){
                var _f = svgData.shapes[k].framesIE ? svgData.shapes[k].framesIE : svgData.shapes[k].frames;
                for (var key in _f){
                    "transform" in _f[key] && (_f[key].transform = TRANSFORM + _f[key].transform);
                }
            }
        }
      
        for (var i = 0; i < shapeLength; i++){
            var attr = svgData.shapes[i].init.attr; 
            if("original" != config.c) attr.fill = config.c;
            fills.push(attr.fill);
            paths[i] = this.path(attr.path).attr(attr);//svgData中path属性的数据设置
        }
        var tempParent = this.rect(0, 0, config.s, config.s).attr({
            fill: "#fff",
            stroke: "none",
            "stroke-width": 0,
            opacity: 0}).toFront();
        //如果没有默认传人的icon parent节点，就是用上面svg数据画出来的节点当parent
        parent = parent ? parent : tempParent;
        //animate--p
        if (config.a) { //这里处理动画效果
            if (isMorph) {//如果是变形
                for (var i = 0; i < shapeLength; i++){
                    //存储动画到 animations
                    animations.push(Raphael.animation(svgData.shapes[i].frames,defDuration));
                    //存储属性到 attrs
                    attrs.push(svgData.shapes[i].init.attr);
                }
                //如果有鼠标hover颜色变化，把变化颜色放到属性的fill里面
                if (config.hc) {
                    var Attrs = clone(attrs);
                    for (var i = 0; i < shapeLength; i++){
                        Attrs[i].fill = config.hc;
                    }
                        
                }
            } else if (!svgR && vmlR){//兼容ie的做法
                for (var i = 0; i < shapeLength; i++){
                    var frameie = svgData.shapes[i].framesIE;
                    var frames = svgData.shapes[i].frames;
                    frameie ? animations.push(Raphael.animation(frameie, config.d)) : animations.push(Raphael.animation(frames, config.d));
                    attrs.push(svgData.shapes[i].init.attr);
                }
            }else{
                for (var i = 0; i < shapeLength; i++){
                    animations.push(Raphael.animation(svgData.shapes[i].frames, config.d));
                    attrs.push(svgData.shapes[i].init.attr);
                }
            }
            var clickAnim = true;//点击动画完成标志
            var anim = true;//动画完成标识
            if ("click" == config.et){//点击事件
                if (config.l && !isMorph){ //一直循环，并非微小动作
                    if (isRoll) {// 如果是微调动画，处理如下
                        for (var i = 0; i < shapeLength; i++){
                            paths[i].stop().animate(animations[i].repeat(Infinity));
                        }  
                        setInterval(svgAnimate, 500)
                    } else if (config.hc) {//如果是改变hover颜色，处理如下
                        parent.on('mouseenter',function() {
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].animate({fill: config.hc}, hoverDuration);
                            }  
                        }).on('mouseleave',function() {
                            for (var i = 0; i < shapeLength; i++)
                                paths[i].animate({fill: fills[i]}, hoverDuration);
                        });
                        
                        //用来判断点击动画是否完成，如果没有完成继续repeat，否则加载初始化init.attr
                        parent.on('click',function() {
                            for (var i = 0; i < shapeLength; i++){
                                e[i].stop().animate(clickAnim ? animations[i].repeat(config.l) : attrs[i], 0);
                            }
                            clickAnim = !clickAnim;
                        });
                    } else{
                        parent.on('click',function() {
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(clickAnim ? animations[i].repeat(config.l) : attrs[i], 0);
                            }
                            clickAnim = !clickAnim;
                        });
                    }
                }else{
                    //
                    if(isMorph){//非循环播放，只是一次微小动作
                        if(config.hc){ //根据config.hc来做是动作还是改变颜色
                            parent.on('mouseenter',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].animate({fill: config.hc}, hoverDuration);
                                }
                            }).on('mouseleave',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].animate({fill: fills[i]}, hoverDuration);
                                }   
                            });
                            clickAnim = true;
                            parent.on('click',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].stop().animate(clickAnim ? animations[i] : Attrs[i], defDuration);
                                }
                                clickAnim = !clickAnim;
                            });
                        }else{
                            clickAnim = true, 
                            parent.on('click',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].stop().animate(clickAnim ? animations[i] : attrs[i], defDuration);
                                }
                                clickAnim = !clickAnim;
                            });
                        }
                    }else{// isloop --true 那就是轮播 
                        if(config.hc){//根据config.hc来做是动作还是改变颜色
                            parent.on('mouseenter',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].animate({fill: config.hc}, hoverDuration);
                                }
                            }).on('mouseleave',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].animate({fill: fills[i]}, hoverDuration);
                                } 
                            });
                            parent.on('click',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].stop().animate(animations[i].repeat(config.i));
                                }
                            });
                        }else{
                            parent.on('click',function() {
                                for (var i = 0; i < shapeLength; i++){
                                    paths[i].stop().animate(animations[i].repeat(config.i));
                                }
                            });
                        }
                    }
                }
            }else if (config.l && !isMorph){//不是点击触发
                if (isRoll) {
                    for (var i = 0; i < shapeLength; i++){
                        paths[i].stop().animate(animations[i].repeat(Infinity));
                    }
                    anim = true;
                    setInterval(svgAnimate, 500)
                } else{
                    if(config.hc){
                        parent.on('mouseenter',function() {
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate({fill: config.hc}, hoverDuration).animate(animations[i].repeat(config.l));
                            }
                        }).on('mouseleave',function() {
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(attrs[i], 0);
                            } 
                        });
                    }else{
                        parent.on('mouseenter',function() {
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(animations[i].repeat(config.l));
                            }
                        }).on('mouseleave',function() {
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(attrs[i], 0);
                            }
                        });
                    }
                }
            }else{
                if(isMorph){
                    parent.on('mouseenter',function() {
                        if (config.hc){
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate({fill: config.hc}, hoverDuration).animate(animations[i]);
                            }
                        }else{
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(animations[i]);
                            }
                        }
                    }).on('mouseleave',function() {
                        for (var i = 0; i < shapeLength; i++){
                            paths[i].stop().animate(attrs[i], defDuration);
                        }
                    });
                }else{
                    parent.on('mouseenter',function() {
                        if (config.hc){
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(attrs[i], 0).animate({fill: config.hc}, hoverDuration).animate(animations[i].repeat(config.i));
                            }
                        }else{
                            for (var i = 0; i < shapeLength; i++){
                                paths[i].stop().animate(attrs[i], hoverDuration).animate(animations[i].repeat(config.i));
                            }
                        }
                    }).on('mouseleave',function() {
                        for (var i = 0; i < shapeLength; i++){
                            paths[i].stop().animate(attrs[i], hoverDuration);
                        }
                    });
                } 
            }
        } else {//这里不需要动画
            if(config.hc) {
                parent.on('mouseenter',function() {
                    for (var i = 0; i < shapeLength; i++){
                        paths[i].stop().animate({fill: config.hc}, hoverDuration);
                    }
                }).on('mouseleave',function() {
                    for (var i = 0; i < shapeLength; i++){
                        paths[i].stop().animate({fill: fills[i]}, hoverDuration);
                    }
                });
            }
        }
        return true;
    };

    return SmartIcon;
}, {
    requires: ["brix/core/brick","./raphael/raphael"]
});