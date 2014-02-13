(function(root) {

        var world = function(settings) {

                var maps = null;

                this.mapId = 0;

                // the current map
                this.map = null;

                this.loadMap = function(mapId) {
                        if(_.isUndefined(maps[mapId])) {
                                console.log('Map not found');
                                return;
                        }

                        if(!_.isNull(this.map)) {
                                this.map.destroy();
                                delete this.map;
                                this.map = null;
                        }
                        
                        this.mapId = mapId;
                        this.createMap(maps[this.mapId]);
                };

                this.createMap = function(settings) {
                        this.map = new App.Objects.Map(settings);
                };

                this.getPlayer = function(playerNumber) {
                        return this.map.entities[0];
                };

                this.getCamera = function() {
                        return this.map.entities[1];
                };

                this.init = (function(settings, self){
                        maps = settings;
                        self.loadMap(0);

                })(settings, this);
        };

        root.App.Objects.World = world;

})(this);
