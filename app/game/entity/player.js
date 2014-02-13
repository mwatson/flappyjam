(function(root){

        var player = function(settings) {

                this.stats = {
                };

                this.tutorial = false;

                this.defaults = {};

                this.playerEnt = null;

                this.composites = null;

                this.addComposite = function(layer, frame1, frame2, frame3) {
                        this.composites.diver_swim1[layer].push(frame1);
                        this.composites.diver_swim2[layer].push(frame2);
                        this.composites.diver_swim3[layer].push(frame3);
                };

                this.removeComposite = function(layer, frame1, frame2, frame3) {
                        for(var i = 0; i < this.composites.diver_swim1[layer].length; i++) {
                                if(this.composites.diver_swim1[layer][i] == frame1) {
                                        this.composites.diver_swim1[layer].splice(i, 1);
                                }
                                if(this.composites.diver_swim2[layer][i] == frame2) {
                                        this.composites.diver_swim2[layer].splice(i, 1);
                                }
                                if(this.composites.diver_swim3[layer][i] == frame3) {
                                        this.composites.diver_swim3[layer].splice(i, 1);
                                }
                        }
                };

                this.rebuildSprites = function() {
                        var self = this, 
                            imgCanvas;
                        this.playerEnt.initSprites(this.skin + 'diver');
                        _.each(this.composites, function(images, canvasId){
                                imgCanvas = App.Assets.Images[self.skin + canvasId];
                                App.Tools.clearCompositeCanvas(imgCanvas);
                                for(var i = 0; i < images.length; i++) {
                                        App.Tools.compositeImages(images[i], imgCanvas);
                                }
                        });
                };

                // update base composites (for switching players)
                this.refreshComposites = function() {
                        this.composites.diver_swim1[0][0] = this.skin + 'diver_start_swim1'; 
                        this.composites.diver_swim2[0][0] = this.skin + 'diver_start_swim2'; 
                        this.composites.diver_swim3[0][0] = this.skin + 'diver_start_swim3'; 

                        this.rebuildSprites();
                };

                this.run = function(collisions) {
                };

                this.haltPlayer = function() {
                        this.playerEnt.attrs.dir = { x: 0, y: 0 };
                };

                this.init = function() {
                };

                this.setup = (function(self, settings) {
                    self.defaults = settings;
                })(this, settings);
        };

        root.App.Objects.Player = player;

})(this);
