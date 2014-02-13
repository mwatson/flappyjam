(function(root){

        var draw = function(_settings) {

                this.cache = {};
        
                var settings = _settings;

                this.canvas = {};

                this.transitions = {};

                // used for node-webkit only
                this.winDiff = {
                        width: 0, 
                        height: 0
                };

                // stores the min/max origin for the map
                this.bounds = {
                        x: { max: 0, min: 0 }, 
                        y: { max: 0, min: 0 }
                };
                
                this.get = function(id) {
                        return this.canvas[id];
                };

                // set the origin on all canvases
                this.setOrigin = function(x, y) {
                        var self = this;
                        _.each(this.canvas, function(canvas, id) {
                                if(canvas.originType == 'dynamic') {

                                        if(x < self.bounds.x.max && x > self.bounds.x.min) {
                                                canvas.origin.x = x;
                                        }

                                        if(y < self.bounds.y.max && y > self.bounds.y.min) {
                                                canvas.origin.y = y;
                                        }
                                }
                        });
                };

                this.forceOrigin = function(x, y) {
                        var self = this;
                        _.each(this.canvas, function(canvas, id) {
                                if(canvas.originType == 'dynamic') {
                                        canvas.origin.x = x;
                                        canvas.origin.y = y;
                                }
                        });
                };

                this.getOrigin = function() {
                        return this.canvas.background.origin;
                };

                this.getCanvasOffset = function(canvas) {
                        return {
                                x: this.canvas[canvas].el.offsetLeft, 
                                y: this.canvas[canvas].el.offsetTop, 
                                width: this.canvas[canvas].el.width, 
                                height: this.canvas[canvas].el.height
                        };
                };

                this.setResolution = function() {
                        var winW = window.innerWidth, 
                            winH = window.innerHeight;

                        // maintain aspect ratio
                        if(winW / winH < 4 / 3) {
                                winH = ~~(winW * (3 / 4));
                        } else {
                                winW = ~~(winH * (4 / 3));
                        }

                        if(!App.Game.settings.video.upscale) {
                                if(winW > 1280 || winH > 960) {
                                        winW = 1280;
                                        winH = 960;
                                }
                        }

                        _.each(this.canvas, function(canvas, id) {
                                canvas.setCanvasVisibleDimensions(
                                        winW, 
                                        winH
                                );
                        });

                        App.Game.settings.video.width  = winW;
                        App.Game.settings.video.height = winH;

                        //settings.width = winW;
                        //settings.height = winH;
                };

                // default, should it be fullscreen or windowed?
                this.isFullscreen = false;
                
                this.setFullscreen = function(setTo) {
                        if(setTo) {
                                if(App.Game.win) {
                                        this.isFullscreen = true;
                                        App.Game.win.enterFullscreen();
                                }
                        } else {
                                if(App.Game.win) {
                                        this.isFullscreen = false;
                                        App.Game.win.leaveFullscreen();
                                        App.Draw.setResolution();
                                }
                        }
                };

                // pull the width/height
                this.width = function() {
                        return settings.width;
                };

                this.height = function() {
                        return settings.height;
                };
                
                var canvasExtended = function(width, height, props) {

                        // this origin is the viewport origin on the map
                        this.origin = {
                                x: 0, 
                                y: 0
                        };

                        this.parallax = {
                                x: 1, 
                                y: 1
                        };

                        if(!_.isUndefined(props.parallax)) {
                                this.parallax = props.parallax;
                        }

                        this.originType = props.origin;

                        this.el = document.createElement('canvas');

                        this.el.setAttribute('id', props.id);

                        this.el.setAttribute('width', width);
                        this.el.setAttribute('height', height);
                        
                        this.setCanvasVisibleDimensions = function(width, height) {
                                this.el.style.width = ~~(width) + "px"; 
                                this.el.style.height = ~~(height) + "px";
                                this.el.style.marginTop = ~(height / 2) + "px";
                                this.el.style.marginLeft = ~(width / 2) + "px";

                                // do some node-webkit resizing here too
                        };
                        
                        document.getElementsByTagName('body')[0].appendChild(this.el);

                        var _width  = parseInt(this.el.getAttribute('width'), 10), 
                            _height = parseInt(this.el.getAttribute('height'), 10);

                        // these return the actual relevant dimensions of the canvas 
                        // not the width/height of the element, which may be smaller
                        this.width = function() {
                                return _width;
                        };

                        this.height = function() {
                                return _height;
                        };
                        
                        this.ctx = document.getElementById(props.id).getContext('2d');
                        
                        if(!_.isUndefined(props.style)) {
                                var self = this;
                                _.each(props.style, function(val, prop){
                                        self.el.style[prop] = val;
                                });
                        }
                        
                        this.calcX = function(x) {
                                return ~~((x + this.origin.x) * (this.parallax.x));
                        };

                        this.calcY = function(y) {
                                return ~~((y + this.origin.y) * (this.parallax.y));
                        };

                        this.calcXY = function(x, y) {
                                var coords = { x: 0, y: 0 };
                                coords.x = this.calcX(x);
                                coords.y = this.calcY(y);

                                return coords;
                        };

                        // this should only use coords that have already 
                        // been calculated with this.calcXY
                        this.checkCoords = function(x, y, w, h) {
                                if(x + w < 0) { // too far to the left
                                        return false;
                                }
                                if(y + h < 0) { // too far to the top
                                        return false;
                                }
                                if(x > this.width()) { // too far to the right
                                        return false;
                                }
                                if(y > this.height()) { // too far to the bottom
                                        return false;
                                }
                                return true;
                        };

                        //
                        // Drawing functions (wrappers for canvas functions)
                        // These all utilize the offset attributes, so when 
                        // adding new ones be sure to use this.calcX/Y if 
                        // you are writing directly to the canvas
                        //
                        
                        this.lastFillStyle = '';

                        this.fillRect = function(x, y, w, h, col) {

                                /*
                                var cId = w + '_' + h + '_' + col;
                                if(_.isUndefined(App.Assets.Images[cId])) {
                                        var c = document.createElement('canvas'), 
                                            ctx;
                                        c.id = cId;
                                        c.width = w * 2;
                                        c.height = h;
                                        ctx = c.getContext('2d');
                                        ctx.fillStyle = col;
                                        ctx.fillRect(0, 0, ~~w, ~~h);

                                        App.Assets.Images[cId] = c;
                                        console.log('caching', cId);
                                }
                                */

                                var coords = this.calcXY(x, y);
                                if(this.checkCoords(coords.x, coords.y, w, h)) {
                                        this.ctx.fillStyle = col;
                                        this.ctx.fillRect(coords.x, coords.y, ~~w, ~~h);
                                        return true;
                                }
                                return false;
                        };

                        this.strokeRect = function(x, y, w, h, col) {
                                var coords = this.calcXY(x, y);
                                if(this.checkCoords(coords.x, coords.y, w, h)) {
                                        this.ctx.strokeStyle = col;
                                        this.ctx.strokeRect(coords.x, coords.y, ~~w, ~~h);
                                }
                        };

                        this.strokeFillRect = function(x, y, w, h, fillCol, strokeCol, strokeWidth) {
                                // this isn't using this.calcXY because it's directly calling a function that does
                                this.fillRect(x, y, w, h, strokeCol);
                                var doubleStroke = ~~(strokeWidth * 2);
                                this.fillRect(x + strokeWidth, y + strokeWidth, w - doubleStroke, h - doubleStroke, fillCol);
                        };

                        this.clear = function() {
                                this.clearRect(-this.origin.x, -this.origin.y, this.width(), this.height());
                        };

                        this.clearRect = function(x, y, w, h) {
                                var coords = this.calcXY(x, y);
                                if(this.checkCoords(coords.x, coords.y, w, h)) {
                                        this.ctx.clearRect(coords.x, coords.y, ~~w, ~~h);
                                }
                        };
                        
                        this.tplCache = {};

                        var getString = function(text) {
                                var args = null;
                                if(_.isArray(text)) {
                                        args = text[1];
                                        text = text[0];
                                }

                                text = App.Tools.getString(text);
                                if(args) {
                                        text = _.template(text, args);
                                }

                                return text;
                        }

                        this.writeTextMultiLine = function(text, font, color, x, y, height) {
                                text = getString(text);
                                var chunks = text.split('|');

                                for(var i = 0; i < chunks.length; i++) {
                                        this.writeRaw(
                                                chunks[i], 
                                                font, 
                                                color, 
                                                x, 
                                                y + height * i
                                        );
                                }
                        };

                        this.writeText = function(text, font, color, x, y) {
                                this.writeRaw(getString(text), font, color, x, y);
                        };

                        this.writeTextRight = function(text, font, color, x, y) {
                                this.ctx.textAlign = 'right';
                                this.writeRaw(getString(text), font, color, x, y);
                                this.ctx.textAlign = 'start';
                        };

                        this.writeTextLeft = function(text, font, color, x, y) {
                                this.ctx.textAlign = 'left';
                                this.writeRaw(getString(text), font, color, x, y);
                                this.ctx.textAlign = 'start';
                        };

                        // write directly and don't cache the text
                        this.writeDirect = function(text, font, color, x, y) {
                                var coords = this.calcXY(x, y);
                                if(this.checkCoords(coords.x, coords.y, 0, 0)) {
                                        this.ctx.font = font;
                                        this.ctx.fillStyle = color;
                                        this.ctx.fillText(text, this.calcX(x), this.calcY(y));
                                }
                        };

                        this.writeRaw = function(text, font, color, x, y) {
                                var cHash = (text + '|' + font + '|' + color).replace(/ /g, '');

                                // cache the text on a canvas
                                if(_.isUndefined(App.Assets.Text[cHash])) {
                                        if(!text || !text.length) {
                                                return;
                                        }

                                        var c = document.createElement('canvas'), ctx;
                                        c.width = this.measureText(text, font).width;
                                        c.height = App.Game.settings.fontHeights[font];
                                        ctx = c.getContext('2d');

                                        ctx.font = font;
                                        ctx.fillStyle = color;
                                        ctx.textBaseline = 'top';
                                        ctx.fillText(text, 0, 0);

                                        App.Assets.Text[cHash] = c;
                                }

                                this.drawTextCanvas(cHash, this.calcX(x), this.calcY(y));
                        };

                        this.measureText = function(text, font) {
                                this.ctx.font = font;
                                return this.ctx.measureText(text);
                        };

                        this.drawTextCanvas = function(assetHash, x, y, align) {
                                if(_.isUndefined(App.Assets.Text[assetHash])) {
                                        return false;
                                }

                                var coords = this.calcXY(x, y), xPos = coords.x;

                                if(this.checkCoords(coords.x, coords.y, 0, 0)) {
                                        if(this.ctx.textAlign == 'right') {
                                                xPos -= App.Assets.Text[assetHash].width;
                                        }

                                        this.ctx.drawImage(
                                                App.Assets.Text[assetHash], 
                                                xPos, 
                                                coords.y - App.Assets.Text[assetHash].height + 17, 
                                                App.Assets.Text[assetHash].width, 
                                                App.Assets.Text[assetHash].height
                                        );
                                }
                        };

                        this.drawImg = function(assetName, x, y, xDir) {
                                if(_.isUndefined(App.Assets.Images[assetName])) {
                                        return false;
                                }

                                var coords = this.calcXY(x, y);
                                if(this.checkCoords(coords.x, coords.y, App.Assets.Images[assetName].width, App.Assets.Images[assetName].height)) {
                                        this.ctx.drawImage(
                                                App.Assets.Images[assetName], 
                                                0, 
                                                0, 
                                                App.Assets.Images[assetName].width, 
                                                App.Assets.Images[assetName].height, 
                                                coords.x, 
                                                coords.y, 
                                                App.Assets.Images[assetName].width, 
                                                App.Assets.Images[assetName].height
                                        );
                                        return true;
                                }
                                return false;
                        };

                        this.drawImgClipped = function(assetName, x, y, xDir, cX, cY, cW, cH) {
                                if(_.isUndefined(App.Assets.Images[assetName])) {
                                        return false;
                                }

                                var coords = this.calcXY(x, y);
                                if(this.checkCoords(coords.x, coords.y, App.Assets.Images[assetName].width, App.Assets.Images[assetName].height)) {
                                        this.ctx.drawImage(
                                                App.Assets.Images[assetName], 
                                                cX + (xDir == -1 ? App.Assets.Images[assetName].width / 2 : 0), 
                                                cY, 
                                                cW, 
                                                cH, 
                                                coords.x, 
                                                coords.y, 
                                                cW, 
                                                cH
                                        );
                                        return true;
                                }
                                return false;
                        };
                };

                var transition = function(options, start, end) {

                        this.opts = options;

                        this.start = start;
                        this.end   = end;

                        this.transitionObj = {
                                x: 0, 
                                y: 0, 
                                w: 0, 
                                h: 0
                        };

                        // set up the transition object
                        for(var i in this.transitionObj) {
                                if(!this.transitionObj.hasOwnProperty(i)) {
                                        continue;
                                }

                                if(this.start[i] < this.end[i]) {
                                        this.transitionObj[i] += this.opts.step;
                                } else if(this.start[i] > this.end[i]) {
                                        this.transitionObj[i] -= this.opts.step;
                                }
                        }

                        var curObj = _.extend({}, this.start), 
                            callback = null;

                        this.done = true;

                        this.run = function() {

                                if(this.done) {
                                        return;
                                }

                                if(this.opts.type == 'drawRect') {

                                        for(var i in curObj) {
                                                if(!curObj.hasOwnProperty(i)) {
                                                        continue;
                                                }

                                                curObj[i] += this.transitionObj[i];

                                                if(this.transitionObj[i] > 0 && curObj[i] > this.end[i]) {
                                                        this.done = true;
                                                } else if(this.transitionObj[i] < 0 && curObj[i] < this.end[i]) {
                                                        this.done = true;
                                                }
                                        }

                                        if(this.done) {
                                                if(callback) {
                                                        callback();
                                                        callback = null;
                                                }
                                        }
                                }
                        };

                        this.draw = function(interpolation) {

                                if(this.done) {
                                        return;
                                }

                                if(this.opts.type == 'drawRect') {

                                        var stepInterp = this.opts.step * interpolation;

                                        App.Draw.get('transitions').clear();
                                        App.Draw.get('transitions').fillRect(
                                                curObj.x + Math.ceil((this.transitionObj.x / this.opts.step) * stepInterp), 
                                                curObj.y + Math.ceil((this.transitionObj.y / this.opts.step) * stepInterp), 
                                                curObj.w + Math.ceil((this.transitionObj.w / this.opts.step) * stepInterp), 
                                                curObj.h + Math.ceil((this.transitionObj.h / this.opts.step) * stepInterp), 
                                                this.opts.color
                                        );
                                }
                        };

                        this.go = function(doneCallback) {
                                curObj =  _.extend({}, this.start);
                                this.done = false;
                                if(doneCallback) {
                                        callback = doneCallback;
                                }
                        };
                };
                
                this.init = (function(settings, self) {

                        // initialize and setup all canvases
                        for(var i = 0; i < settings.canvases.length; i++) {
                                var props = settings.canvases[i];
                                self.canvas[props.id] = new canvasExtended(
                                                                settings.width, 
                                                                settings.height, 
                                                                props
                                                        );
                        }

                        if(App.Game.win) {
                                self.winDiff.width = App.Game.win.width - App.Game.settings.video.width;
                                self.winDiff.height = App.Game.win.height - App.Game.settings.video.height;
                        }

                        //self.setResolution();

                })(settings, this);

                this.initTransitions = function() {
                        var self = this;
                        _.each(App.Defs.Transitions, function(t, transName) {
                                trans = App.Defs.Transitions[transName]();
                                self.transitions[transName] = new transition(trans.options, trans.start, trans.end);
                        });
                };

                this.runTransitions = function() {
                        _.each(this.transitions, function(transition, tName) {
                                transition.run();
                        });
                };

                this.drawTransitions = function(interpolation) {
                        _.each(this.transitions, function(transition, tName) {
                                transition.draw(interpolation);
                        });
                };

        };
        
        root.App.Objects.Draw = draw;

})(this);
