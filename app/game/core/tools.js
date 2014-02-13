(function(root){

        var tools = function() {

                this.rand = function(low, high) {
                        return Math.floor(Math.random() * (high - low + 1)) + low;
                };
        
                this.log = function() {
                        console.log(arguments);
                };

                this.debugColor = '#000';

                this.printFPS = function(ontoLayer, counts) {
                        var avgs = {};
                        _.each(counts, function(val, key) {
                                avgs[key] = 0;
                                _.each(val, function(v) {
                                        avgs[key] += v;
                                });
                                avgs[key] = 1000 / (avgs[key] / val.length);
                                avgs[key] = Math.round(avgs[key]);
                        });

                        var canvas = App.Draw.get(ontoLayer);
                        canvas.writeDirect(
                                avgs.draw + ' fps', 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 60, 
                                canvas.height() - 40
                        );
                        canvas.writeDirect(
                                avgs.update + ' ups', 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 60, 
                                canvas.height() - 20
                        );
                };

                this.printPlayerPos = function(ontoLayer, player) {
                        var canvas = App.Draw.get(ontoLayer);
                        canvas.writeDirect(
                                'X: ' + player.attrs.x, 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 60, 
                                canvas.height() - 100
                        );
                        canvas.writeDirect(
                                'Y: ' + player.attrs.y, 
                                App.Game.settings.debug.font, 
                                this.debugColor, 
                                canvas.width() - 60, 
                                canvas.height() - 80
                        );
                };

                this.assetLoader = function() {
                        var self = this;

                        _.each(App.Defs.Assets.Fonts, function(asset, id) {
                                App.Assets.Fonts[asset.name] = {
                                        initWidth: App.Draw.get('hud').measureText('amazing awesome!', '24px ' + asset.name), 
                                        loaded: false
                                };
                        });

                        _.each(App.Defs.Assets.Images, function(asset, id) {
                                App.Assets.Images[asset.name] = new Image();
                                App.Assets.Images[asset.name].onload = function() {
                                        var c = document.createElement('canvas'), 
                                            ctx;
                                        c.id = asset.name;
                                        c.width = this.width;
                                        c.height = this.height;
                                        ctx = c.getContext('2d');
                                        
                                        ctx.drawImage(App.Assets.Images[asset.name], 0, 0);
                                        //ctx.scale(-1, 1);
                                        //ctx.drawImage(App.Assets.Images[asset.name], -c.width, 0);

                                        App.Assets.Images[asset.name] = c;
                                        App.Defs.Assets.Loaded.Images++;

                                        if(App.Defs.Assets.Loaded.Images == App.Defs.Assets.Images.length) {
                                                App.Tools.buildComposites();
                                        }
                                };
                                App.Assets.Images[asset.name].src = 'assets/' + asset.rel;
                        });

                        _.each(App.Defs.Assets.Sounds, function(asset, id) {
                                App.Assets.Sounds[asset.name] = new Audio();
                                App.Assets.Sounds[asset.name].addEventListener('canplay', function() {
                                        App.Defs.Assets.Loaded.Sounds++;
                                        App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();

                                        App.Assets.Sounds[asset.name].source = App.Sound.AudioContext.createMediaElementSource(App.Assets.Sounds[asset.name]);
                                        App.Assets.Sounds[asset.name].source.connect(App.Sound.AudioContext.destination);
                                });
                                App.Assets.Sounds[asset.name].src = 'assets/' + asset.rel;
                                App.Assets.Sounds[asset.name].load();
                        });

                        _.each(App.Defs.Assets.SoundQueues, function(asset, id) {
                                App.Assets.SoundQueues[asset.name] = new App.Objects.SoundQueue(asset.sounds);
                        });
                };

                this.assetFontCheck = function() {
                        var w, self = this;
                        _.each(App.Defs.Assets.Fonts, function(asset, id) {
                                if(!App.Assets.Fonts[asset.name].loaded) {
                                        w = App.Draw.get('hud').measureText('amazing awesome!', '24px ' + asset.name);
                                        if(App.Assets.Fonts[asset.name].initWidth.width != w.width) {
                                                App.Assets.Fonts[asset.name].loaded = true;
                                                App.Defs.Assets.Loaded.Fonts++;
                                                App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();
                                        }
                                }
                        });
                };

                this.assetsCheckComplete = function() {
                        return (App.Defs.Assets.Loaded.CompositeImages == App.Defs.Assets.CompositeImages.length && 
                                App.Defs.Assets.Loaded.Images == App.Defs.Assets.Images.length && 
                                App.Defs.Assets.Loaded.Sounds == App.Defs.Assets.Sounds.length && 
                                App.Defs.Assets.Loaded.Fonts == App.Defs.Assets.Fonts.length);
                };

                this.buildComposites = function() {
                        var self = this;
                        _.each(App.Defs.Assets.CompositeImages, function(asset, id) {
                                var c = document.createElement('canvas');
                                c.id = asset.name;
                                c.width = App.Assets.Images[asset.images[0].frame].width;
                                c.height = App.Assets.Images[asset.images[0].frame].height;

                                self.compositeImages(asset.images, c);

                                App.Assets.Images[asset.name] = c;
                                App.Defs.Assets.Loaded.CompositeImages++;

                                App.Defs.Assets.Loaded.Complete = self.assetsCheckComplete();
                        });                        
                };

                this.clearCompositeCanvas = function(canvas) {
                        var ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                };

                this.compositeImages = function(images, canvas) {
                        var ctx = canvas.getContext('2d');
                        for(var i = 0; i < images.length; i++) {
                                if(!images[i]) {
                                        continue;
                                }
                                ctx.drawImage(
                                        App.Assets.Images[images[i].frame],
                                        images[i].offset.x,
                                        images[i].offset.y
                                );
                        }
                        return true;
                };

                this.boxesIntersect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
                                if(x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
                                        return true;
                                }
                                return false;
                };

                this.getString = function(str) {
                        var local = App.Game.settings.local;
                        if(!_.isUndefined(App.Defs.Strings[local]) && !_.isUndefined(App.Defs.Strings[local][str])) {
                                return App.Defs.Strings[local][str];
                        }
                        return str;
                };

                this.formatNumber = function(n, decPlaces, thouSeparator, decSeparator) {
                        var decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
                        decSeparator = decSeparator == undefined ? "." : decSeparator,
                        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
                        sign = n < 0 ? "-" : "",
                        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
                        j = (j = i.length) > 3 ? j % 3 : 0;
                        return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
                };
        };
        
        root.App.Objects.Tools = tools;

})(this);
